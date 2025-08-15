const express = require('express');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const { createClient } = require('redis');
const rateLimit = require('express-rate-limit');
const { problemHandler, makeProblem } = require('../../utils/problemDetails');

const app = express();
const port = 3001;

// Redis Client for JTI deny-list
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect();

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

app.use(express.json());

// Login Rate Limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 attempts per windowMs
  message: makeProblem(429, 'Too Many Requests', 'Too many login attempts from this IP, please try again after 15 minutes.'),
  keyGenerator: (req) => req.ip, // Limit by IP
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

// Password Policy
const passwordPolicy = z.string().min(8, 'Password must be at least 8 characters long.')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .regex(/[0-9]/, 'Password must contain at least one number.')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.');

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: passwordPolicy, // Apply password policy
  twoFactorEnabled: z.boolean().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Middleware to check if token is blacklisted
async function checkBlacklist(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(makeProblem(401, 'Unauthorized', 'No token provided.', 'https://boatable.app/problems/no-token'));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(makeProblem(401, 'Unauthorized', 'Token format invalid.', 'https://boatable.app/problems/invalid-token-format'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const isBlacklisted = await redisClient.get(`blacklist:${decoded.jti}`);
    if (isBlacklisted) {
      return next(makeProblem(401, 'Unauthorized', 'Token has been revoked.', 'https://boatable.app/problems/token-revoked'));
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(makeProblem(401, 'Unauthorized', 'Token expired.', 'https://boatable.app/problems/token-expired'));
    }
    return next(makeProblem(401, 'Unauthorized', 'Invalid token.', 'https://boatable.app/problems/invalid-token'));
  }
}

app.get('/api/auth/profile', checkBlacklist, (req, res) => {
  res.json({ message: 'Auth profile data', user: req.user });
});

app.post('/api/auth/register', (req, res, next) => {
  try {
    registerSchema.parse(req.body);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Simulate user lookup and password verification
    if (email === 'test@example.com' && password === 'Password123!') {
      const jti = Math.random().toString(36).substring(2, 15); // Unique JWT ID
      const token = jwt.sign({ userId: 'user123', email, jti }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token }); // Return raw JWT
    } else {
      throw makeProblem(401, 'Unauthorized', 'Invalid credentials.', 'https://boatable.app/problems/invalid-credentials');
    }
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/logout', checkBlacklist, async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.decode(token);
    const jti = decoded.jti;
    const expiresIn = decoded.exp - (Date.now() / 1000); // Time until token expires in seconds

    if (expiresIn > 0) {
      await redisClient.set(`blacklist:${jti}`, 'true', { EX: expiresIn });
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

app.use(problemHandler);

app.listen(port, () => {
  console.log(`Auth service listening on port ${port}`);
});