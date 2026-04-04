import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import { swaggerSpec } from '@/config/swagger';
import { errorHandler, asyncHandler } from '@/middleware/error.middleware';
import userRoutes from '@/routes/user.routes';
import recordRoutes from '@/routes/record.routes';
import logger from '@/utils/logger';
import prisma from '@/utils/database';

dotenv.config();

// ==================== ENVIRONMENT VALIDATION ====================
const requiredEnv = ['DATABASE_URL', 'JWT_SECRET', 'NODE_ENV'];
const missingEnv = requiredEnv.filter((env) => !process.env[env]);
if (missingEnv.length > 0) {
  logger.error(`Missing environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// ==================== Middleware ====================

// ==================== CORS CONFIGURATION ====================
// Parse CORS_ORIGIN: supports single domain or comma-separated list
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? corsOrigin : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(
  morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'),
);

// ==================== Routes ====================

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// Database health check
app.get('/health/db', asyncHandler(async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ok',
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Database connection failed',
      timestamp: new Date().toISOString(),
    });
  }
}));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);

// Root endpoint - Dashboard
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Finance Dashboard API</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 900px;
          width: 100%;
          padding: 50px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .header h1 {
          color: #333;
          font-size: 2.5em;
          margin-bottom: 10px;
        }
        
        .header p {
          color: #666;
          font-size: 1.1em;
        }
        
        .version-badge {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.9em;
          margin-top: 10px;
        }
        
        .status-section {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
          text-align: center;
        }
        
        .status-badge {
          display: inline-block;
          background: #10b981;
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: bold;
        }
        
        .links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .link-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 25px;
          border-radius: 15px;
          text-decoration: none;
          transition: transform 0.3s, box-shadow 0.3s;
          cursor: pointer;
          text-align: center;
        }
        
        .link-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        
        .link-card h3 {
          margin-bottom: 10px;
          font-size: 1.3em;
        }
        
        .link-card p {
          font-size: 0.9em;
          opacity: 0.9;
        }
        
        .link-card.docs {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        .link-card.health {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        .endpoints {
          background: #f9f9f9;
          padding: 25px;
          border-radius: 10px;
          margin-top: 30px;
        }
        
        .endpoints h2 {
          color: #333;
          margin-bottom: 20px;
          font-size: 1.5em;
        }
        
        .endpoint-list {
          list-style: none;
        }
        
        .endpoint-list li {
          padding: 12px;
          margin-bottom: 10px;
          background: white;
          border-left: 4px solid #667eea;
          border-radius: 5px;
          font-family: 'Courier New', monospace;
          font-size: 0.95em;
          color: #555;
        }
        
        .method {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 3px 10px;
          border-radius: 3px;
          font-weight: bold;
          margin-right: 10px;
          font-size: 0.85em;
        }
        
        .endpoint-path {
          color: #333;
          font-weight: 500;
        }
        
        .footer {
          text-align: center;
          margin-top: 40px;
          color: #999;
          font-size: 0.9em;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        
        @media (max-width: 600px) {
          .container {
            padding: 30px;
          }
          
          .header h1 {
            font-size: 1.8em;
          }
          
          .links-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰 Finance Dashboard</h1>
          <p>Manage your finances with our powerful API</p>
          <span class="version-badge">Version 1.0.0</span>
        </div>
        
        <div class="status-section">
          <p>Server Status:</p>
          <span class="status-badge">✓ Running</span>
        </div>
        
        <div class="links-grid">
          <a href="/api-docs/" class="link-card docs">
            <h3>📚 API Documentation</h3>
            <p>Interactive Swagger UI - Explore all endpoints</p>
          </a>
          
          <a href="/health" class="link-card health">
            <h3>💓 Health Check</h3>
            <p>Server status and diagnostics</p>
          </a>
        </div>
        
        <div class="endpoints">
          <h2>🔌 Key API Endpoints</h2>
          <ul class="endpoint-list">
            <li><span class="method">POST</span> <span class="endpoint-path">/api/users/register</span> - Create new account</li>
            <li><span class="method">POST</span> <span class="endpoint-path">/api/users/login</span> - Login to account</li>
            <li><span class="method">GET</span> <span class="endpoint-path">/api/users/profile</span> - Get user profile</li>
            <li><span class="method">POST</span> <span class="endpoint-path">/api/records</span> - Add financial record</li>
            <li><span class="method">GET</span> <span class="endpoint-path">/api/records</span> - List financial records</li>
            <li><span class="method">GET</span> <span class="endpoint-path">/api/records/dashboard/summary</span> - Dashboard summary</li>
            <li><span class="method">GET</span> <span class="endpoint-path">/api/records/dashboard/trends</span> - Monthly trends</li>
            <li><span class="method">GET</span> <span class="endpoint-path">/api/records/dashboard/breakdown</span> - Category breakdown</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>© 2026 Finance Dashboard API | Built with Express.js, Prisma & SQLite</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
    },
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(errorHandler);

// ==================== Server Startup ====================

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connection successful');

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
