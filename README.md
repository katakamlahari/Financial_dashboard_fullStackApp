# Finance Dashboard Backend API

A clean, production-ready backend system for a Finance Dashboard application built with Node.js, Express.js, SQLite, and Prisma ORM.

## 🚀 Features

### User Management
- User registration and authentication with JWT
- Role-based access control (ADMIN, ANALYST, VIEWER)
- User activation/deactivation
- Soft delete support

### Financial Records
- Create, read, update, and delete financial records
- Support for INCOME and EXPENSE types
- Flexible filtering and searching
- Pagination and sorting

### Dashboard Analytics
- Total income and expense calculations
- Net balance computation
- Category-wise breakdown
- Monthly trends analysis
- Recent transactions retrieval

### Security & Validation
- JWT authentication
- Role-based authorization middleware
- Zod schema validation
- Comprehensive error handling
- Request logging with Morgan

### API Documentation
- Swagger/OpenAPI documentation
- Interactive API explorer

## 📋 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Logging**: Morgan
- **API Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## 📁 Project Structure

```
finance-dashboard-backend/
├── src/
│   ├── controllers/          # Request handlers
│   ├── services/             # Business logic
│   ├── repositories/         # Data access layer
│   ├── routes/               # API route definitions
│   ├── middleware/           # Express middleware
│   ├── schemas/              # Zod validation schemas
│   ├── utils/                # Helper utilities
│   ├── config/               # Configuration files
│   └── index.ts              # Application entry point
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeding script
├── .env.example              # Environment variables template
├── package.json              # Project dependencies
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## 🔧 Installation

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd finance-dashboard-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
LOG_LEVEL=debug
```

4. **Setup database**
```bash
# Create and migrate database
npm run migrate

# Seed sample data
npm run seed
```

5. **Start development server**
```bash
npm run dev
```

Server will be running at `http://localhost:3000`
API docs available at `http://localhost:3000/api-docs`

## 📖 API Documentation

### Authentication

#### Register
```bash
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "VIEWER",
      "isActive": true,
      "createdAt": "2024-01-01T12:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### Login
```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Users Endpoints

#### Get User Profile
```bash
GET /api/users/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "VIEWER",
    "isActive": true
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### Get All Users (Admin only)
```bash
GET /api/users?page=1&limit=10
Authorization: Bearer <admin-token>

Response: 200 OK
{
  "success": true,
  "data": {
    "data": [...users],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

#### Update User (Admin only)
```bash
PUT /api/users/{userId}
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "firstName": "Jane",
  "role": "ANALYST",
  "isActive": true
}
```

#### Assign Role (Admin only)
```bash
PUT /api/users/{userId}/role
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "role": "ANALYST"
}
```

#### Activate/Deactivate User (Admin only)
```bash
PUT /api/users/{userId}/activate
PUT /api/users/{userId}/deactivate
Authorization: Bearer <admin-token>
```

#### Delete User (Admin only)
```bash
DELETE /api/users/{userId}
Authorization: Bearer <admin-token>
```

### Financial Records Endpoints

#### Create Record
```bash
POST /api/records
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 5000,
  "type": "INCOME",
  "category": "Salary",
  "date": "2024-01-01T12:00:00Z",
  "notes": "Monthly salary"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "record-id",
    "amount": 5000,
    "type": "INCOME",
    "category": "Salary",
    "date": "2024-01-01T12:00:00Z",
    "notes": "Monthly salary",
    "createdBy": "user-id",
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

#### Get All Records (with filters)
```bash
GET /api/records?type=INCOME&category=Salary&page=1&limit=10&sortBy=date&sortOrder=desc
Authorization: Bearer <token>

Query Parameters:
- type: INCOME | EXPENSE (optional)
- category: string (optional)
- startDate: ISO date-time (optional)
- endDate: ISO date-time (optional)
- page: integer (default: 1)
- limit: integer (default: 10)
- sortBy: date | amount | createdAt (default: date)
- sortOrder: asc | desc (default: desc)

Response: 200 OK
{
  "success": true,
  "data": {
    "data": [...records],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

#### Get Record by ID
```bash
GET /api/records/{recordId}
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "record-id",
    ...
  }
}
```

#### Update Record
```bash
PUT /api/records/{recordId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 5500,
  "category": "Bonus"
}
```

#### Delete Record
```bash
DELETE /api/records/{recordId}
Authorization: Bearer <token>
```

### Dashboard Endpoints

#### Get Dashboard Summary
```bash
GET /api/records/dashboard/summary?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "totalIncome": 25000,
    "totalExpense": 15000,
    "netBalance": 10000,
    "categoryTotals": [
      {
        "category": "Salary",
        "type": "INCOME",
        "total": 20000,
        "count": 2
      },
      {
        "category": "Rent",
        "type": "EXPENSE",
        "total": 12000,
        "count": 2
      }
    ],
    "recentTransactions": [...]
  }
}
```

#### Get Monthly Trends
```bash
GET /api/records/dashboard/monthly-trends?months=12
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "month": "2023-12",
      "income": 15000,
      "expense": 8000
    },
    {
      "month": "2024-01",
      "income": 20000,
      "expense": 12000
    }
  ]
}
```

#### Get Category Breakdown
```bash
GET /api/records/dashboard/category-breakdown
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "category": "Salary",
      "type": "INCOME",
      "total": 50000,
      "count": 12
    },
    {
      "category": "Groceries",
      "type": "EXPENSE",
      "total": 3600,
      "count": 36
    }
  ]
}
```

## 🔐 Authentication & Authorization

### Roles

- **ADMIN**: Full access to all endpoints
- **ANALYST**: Can read records and access analytics
- **VIEWER**: Read-only access (can only view their own records)

### JWT Token

Include token in request header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  role TEXT DEFAULT 'VIEWER' CHECK(role IN ('ADMIN', 'ANALYST', 'VIEWER')),
  isActive BOOLEAN DEFAULT true,
  deletedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Financial Records Table
```sql
CREATE TABLE financial_records (
  id TEXT PRIMARY KEY,
  amount REAL NOT NULL,
  type TEXT CHECK(type IN ('INCOME', 'EXPENSE')),
  category TEXT NOT NULL,
  date DATETIME NOT NULL,
  notes TEXT,
  createdBy TEXT NOT NULL,
  deletedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES users(id)
);
```

## 🚀 Deployment

### Option 1: Render (Recommended)

1. **Push your code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Create a new Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Choose branch to deploy

3. **Configure the service**
   - Name: `finance-dashboard-api`
   - Environment: `Node`
   - Build command: `npm install && npm run build && npx prisma migrate deploy`
   - Start command: `npm start`

4. **Add environment variables**
   - Go to Environment section
   - Add all variables from `.env`:
     ```
     DATABASE_URL=<your-sqlite-db-url-or-file-path>
     NODE_ENV=production
     JWT_SECRET=<strong-random-secret>
     JWT_EXPIRY=7d
     PORT=3000
     LOG_LEVEL=info
     CORS_ORIGIN=<your-frontend-url>
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy

### Option 2: Railway

1. **Install Railway CLI**
```bash
npm i -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Initialize project**
```bash
railway init
```

4. **Set environment variables**
```bash
railway variables set DATABASE_URL="file:./dev.db"
railway variables set JWT_SECRET="your-secret-key"
railway variables set NODE_ENV="production"
```

5. **Deploy**
```bash
railway up
```

### Option 3: Vercel (for Serverless)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Configure `vercel.json`**
```json
{
  "buildCommand": "npm run build && npx prisma generate",
  "outputDirectory": "dist"
}
```

## 🧪 Testing

### Sample Requests

**Register User**
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Login**
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Create Record**
```bash
curl -X POST http://localhost:3000/api/records \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "type": "INCOME",
    "category": "Salary",
    "date": "2024-01-01T12:00:00Z",
    "notes": "Monthly salary"
  }'
```

**Get Dashboard Summary**
```bash
curl -X GET http://localhost:3000/api/records/dashboard/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📚 Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Production
npm run build            # Build TypeScript to JavaScript
npm start                # Start production server

# Database
npm run migrate          # Run Prisma migrations
npm run migrate:prod     # Run migrations in production
npm run studio           # Open Prisma Studio (database GUI)
npm run seed             # Seed database with sample data

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

## 🔍 Logging

The application uses Morgan for HTTP request logging and a custom logger for application-level logging.

Log levels:
- DEBUG: Detailed diagnostic information
- INFO: General informational messages
- WARN: Warning messages
- ERROR: Error messages

Configure via `LOG_LEVEL` environment variable.

## 📝 Best Practices Implemented

- ✅ Clean Architecture (Controller → Service → Repository → Model)
- ✅ Separation of Concerns
- ✅ Modular Design
- ✅ Type Safety with TypeScript
- ✅ Input Validation with Zod
- ✅ JWT Authentication
- ✅ Role-Based Access Control
- ✅ Error Handling & Logging
- ✅ Soft Deletes for Data Integrity
- ✅ API Documentation with Swagger
- ✅ Environment Configuration
- ✅ Database Migrations with Prisma

## 🐛 Common Issues

### Database locked error
```bash
# Delete the old database file and run migrations again
rm dev.db
npm run migrate
```

### Port already in use
Change PORT in `.env` file to an available port.

### JWT token expired
Tokens expire based on `JWT_EXPIRY` setting. Users need to login again to get a new token.

## 📄 License

ISC

## 🤝 Support

For issues and questions, please check the API documentation at `/api-docs` endpoint.

---

Built with ❤️ for efficient financial tracking
