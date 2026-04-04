import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Dashboard API',
      version: '1.0.0',
      description: 'API documentation for Finance Dashboard Backend',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            firstName: {
              type: 'string',
            },
            lastName: {
              type: 'string',
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'ANALYST', 'VIEWER'],
            },
            isActive: {
              type: 'boolean',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        FinancialRecord: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            amount: {
              type: 'number',
            },
            type: {
              type: 'string',
              enum: ['INCOME', 'EXPENSE'],
            },
            category: {
              type: 'string',
            },
            date: {
              type: 'string',
              format: 'date-time',
            },
            notes: {
              type: 'string',
            },
            createdBy: {
              type: 'string',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
            data: {
              type: 'object',
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
                details: {
                  type: 'object',
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Records',
        description: 'Financial records endpoints',
      },
      {
        name: 'Dashboard',
        description: 'Dashboard analytics endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
