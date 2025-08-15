const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const mount = (ctx, target) => app.use(ctx, createProxyMiddleware({
  target, changeOrigin: true,
  pathRewrite: (path) => path.replace(ctx, ''),
  onProxyReq: (p) => p.setHeader('x-gateway', 'boatable'),
}));

mount('/api/auth', 'http://localhost:3001');
mount('/api/user', 'http://localhost:3002');
mount('/api/payment', 'http://localhost:3008');
mount('/api/iot', 'http://localhost:3009');
mount('/api/marketplace', 'http://localhost:3010');
mount('/api/social', 'http://localhost:3011');
// ...repeat for all services

const port = 4000; // Using port 4000 to avoid conflict with Next.js dev server on 3000
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});