const express = require('express');
const { z } = require('zod');
const { problemHandler } = require('../../utils/problemDetails');

const app = express();
const port = 3002;

app.use(express.json());

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  age: z.number().int().positive().optional(),
  bio: z.string().max(200).optional(),
});

app.get('/api/user/health', (req, res) => {
  res.json({ message: 'User service is healthy' });
});

app.put('/api/user/update-profile', (req, res, next) => {
  try {
    updateProfileSchema.parse(req.body);
    res.json({ message: 'User profile updated successfully' });
  } catch (error) {
    next(error);
  }
});

app.use(problemHandler);

app.listen(port, () => {
  console.log(`User service listening on port ${port}`);
});