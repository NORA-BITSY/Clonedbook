import { NextApiRequest, NextApiResponse } from 'next';

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  environment: string;
  checks: {
    database: 'ok' | 'error';
    firebase: 'ok' | 'error';
    memory: 'ok' | 'warning' | 'error';
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthCheckResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: 'error',
        firebase: 'error',
        memory: 'error'
      }
    });
  }

  try {
    // Basic health checks
    const memoryUsage = process.memoryUsage();
    const memoryStatus = memoryUsage.heapUsed / memoryUsage.heapTotal > 0.9 
      ? 'error' 
      : memoryUsage.heapUsed / memoryUsage.heapTotal > 0.7 
        ? 'warning' 
        : 'ok';

    // Firebase check (basic - just check if config exists)
    const firebaseStatus = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'ok' : 'error';

    const response: HealthCheckResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: firebaseStatus, // Firebase Firestore
        firebase: firebaseStatus,
        memory: memoryStatus
      }
    };

    // Set cache headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.status(200).json(response);
  } catch (error) {
    console.error('Health check failed:', error);
    
    return res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: 'error',
        firebase: 'error',
        memory: 'error'
      }
    });
  }
}