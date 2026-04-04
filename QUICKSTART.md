# Quick Start Guide

Get the Finance Dashboard Backend running in 5 minutes!

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

## Installation (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Environment
```bash
cp .env.example .env
```

### Step 3: Setup Database
```bash
npm run migrate
npm run seed
```

This creates a SQLite database with sample data.

### Step 4: Start Server
```bash
npm run dev
```

Server is running at: `http://localhost:3000`

---

## Access Points

| URL | Purpose |
|---|---|
| `http://localhost:3000` | API Home |
| `http://localhost:3000/health` | Health Check |
| `http://localhost:3000/api-docs` | Swagger UI |

---

## Sample Credentials

After seeding, you can login with:

### Admin User
```
Email: admin@example.com
Password: admin123
Role: ADMIN
```

### Analyst User
```
Email: analyst@example.com
Password: analyst123
Role: ANALYST
```

### Viewer User
```
Email: viewer@example.com
Password: viewer123
Role: VIEWER
```

---

## Quick API Test

### 1. Get Access Token

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Save the `token` from response.

### 2. Get Dashboard Summary

```bash
curl -X GET http://localhost:3000/api/records/dashboard/summary \
  -H "Authorization: Bearer <your-token>"
```

### 3. Create a Record

```bash
curl -X POST http://localhost:3000/api/records \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "type": "INCOME",
    "category": "Bonus",
    "date": "2024-01-15T12:00:00Z",
    "notes": "Performance bonus"
  }'
```

---

## Common Commands

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# View database with Prisma Studio
npm run studio

# Reseed database
npm run seed

# Run migrations
npm run migrate
```

---

## Project Structure

```
src/
├── controllers/      # HTTP request handlers
├── services/         # Business logic
├── repositories/     # Database access
├── routes/          # API endpoints
├── middleware/      # Express middleware
├── schemas/         # Zod validation
├── utils/           # Helper utilities
├── config/          # Configuration (Swagger)
└── index.ts         # Server entry point

prisma/
├── schema.prisma    # Database schema
└── seed.ts         # Sample data
```

---

## Features Overview

### ✅ User Management
- Register users
- Login with JWT
- Role-based access (ADMIN, ANALYST, VIEWER)
- User activation/deactivation

### ✅ Financial Records
- Create income/expense records
- Flexible filtering & sorting
- Pagination support
- Category organization

### ✅ Dashboard Analytics
- Total income/expense
- Net balance calculation
- Category breakdown
- Monthly trends
- Recent transactions

### ✅ Security
- JWT authentication
- Role-based authorization
- Input validation (Zod)
- Soft delete support

### ✅ API Documentation
- Interactive Swagger UI
- OpenAPI spec
- Request/response examples

---

## Development Workflow

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Open Swagger UI
Visit `http://localhost:3000/api-docs` in your browser.

### 3. Test Endpoints
Use the interactive Swagger UI to test endpoints.

### 4. View Logs
Check terminal for request/response logs.

### 5. View Database
```bash
npm run studio
```
Opens Prisma Studio to view database records.

---

## Database Management

### View Data
```bash
npm run studio
```

### Reset Database
```bash
rm dev.db
npm run migrate
npm run seed
```

### Create New Data
Use API endpoints to create records, or use Prisma Studio GUI.

---

## Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env file
PORT=3001

# Restart server
npm run dev
```

### Database Locked
```bash
rm dev.db
npm run migrate
npm run seed
```

### Dependencies Issue
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Rebuild TypeScript
npm run build
```

---

## Next Steps

1. **Read Documentation**
   - [README.md](./README.md) - Complete guide
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
   - [API_EXAMPLES.md](./API_EXAMPLES.md) - Request/response examples

2. **Deploy**
   - [DEPLOYMENT_RENDER.md](./DEPLOYMENT_RENDER.md) - Deploy to Render
   - [DEPLOYMENT_RAILWAY.md](./DEPLOYMENT_RAILWAY.md) - Deploy to Railway
   - [DEPLOYMENT_VERCEL.md](./DEPLOYMENT_VERCEL.md) - Deploy to Vercel

3. **Extend**
   - Add new endpoints
   - Add authentication providers
   - Add database indexes
   - Implement caching

4. **Test**
   - Try API endpoints in Swagger UI
   - Create records with different categories
   - Test filtering and pagination
   - Verify role-based access

---

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | Server framework |
| TypeScript | Type safety |
| Prisma ORM | Database management |
| SQLite | Development database |
| Zod | Input validation |
| JWT | Authentication |
| Morgan | HTTP logging |
| Swagger | API documentation |

---

## Environment Variables

Key variables to know:

```env
# Server
PORT=3000                           # Server port
NODE_ENV=development               # Environment

# Database
DATABASE_URL=file:./dev.db          # SQLite file

# Authentication
JWT_SECRET=your-secret-key         # Change this!
JWT_EXPIRY=7d                       # Token expiry

# Logging
LOG_LEVEL=debug                     # debug|info|warn|error

# CORS
CORS_ORIGIN=http://localhost:3000  # Allowed origins
```

---

## File Customization

### Add New Environment Variable

1. Add to `.env`
   ```env
   MY_VAR=value
   ```

2. Use in code
   ```typescript
   const value = process.env.MY_VAR;
   ```

### Add New User Role

1. Update `prisma/schema.prisma`
   ```prisma
   enum Role {
     ADMIN
     ANALYST
     VIEWER
     SUPERVISOR  // New role
   }
   ```

2. Run migration
   ```bash
   npm run migrate
   ```

3. Update middleware
   ```typescript
   roleMiddleware(['SUPERVISOR'])
   ```

### Add New Record Type

1. Update `prisma/schema.prisma`
   ```prisma
   enum RecordType {
     INCOME
     EXPENSE
     TRANSFER  // New type
   }
   ```

2. Run migration
   ```bash
   npm run migrate
   ```

3. Update validation schema
   ```typescript
   z.enum(['INCOME', 'EXPENSE', 'TRANSFER'])
   ```

---

## Support & Help

- 📖 **Documentation**: Check README.md
- 🏗️ **Architecture**: Check ARCHITECTURE.md
- 📝 **Examples**: Check API_EXAMPLES.md
- 🐛 **Issues**: Check terminal logs

---

## What's Next?

After running locally:

1. ✅ Explore API endpoints in Swagger UI
2. ✅ Create test records
3. ✅ Try different user roles
4. ✅ Test filtering and pagination
5. ✅ Review ARCHITECTURE.md to understand design
6. ✅ Deploy to production (Railway recommended)

---

**Ready to go!** 🚀

Start the server with `npm run dev` and visit `http://localhost:3000/api-docs`
