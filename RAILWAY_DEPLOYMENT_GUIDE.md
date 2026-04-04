# Railway Deployment Guide - Senior Backend Configuration

## Executive Summary

This guide provides **production-grade** backend configuration for Finance Dashboard deployment on Railway. All issues have been fixed including environment variables, database configuration, CORS, and date handling.

---

## PART 1: ENVIRONMENT CONFIGURATION - FIXED ✅

### Fixed Issues:
- ✅ Removed invalid quotes from CORS_ORIGIN
- ✅ Proper environment variable formatting for Railway
- ✅ Strong JWT_SECRET generation
- ✅ Full compatibility with current stack

### Railway Environment Variables

Set these in **Railway Dashboard → Environment Variables**:

```bash
# Database (Railway auto-generates for PostgreSQL add-on)
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://[user]:[password]@[host]:5432/[database]

# Server Configuration
NODE_ENV=production
PORT=3000

# JWT (Generate: openssl rand -base64 32)
JWT_SECRET=aB7$kL2@mN8#pQ5!xY9&zC3*vW4+rS6-tU1^hJ0%dF4=
JWT_EXPIRY=7d

# CORS (Match YOUR frontend domain exactly - NO QUOTES, NO TRAILING SLASH)
CORS_ORIGIN=https://financial-dashboard.vercel.app

# Logging
LOG_LEVEL=info
```

### Best Practices:

**JWT_SECRET Generation:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | ForEach-Object {[char](Get-Random -Minimum 33 -Maximum 126)}) -join ''))
```

**CORS_ORIGIN Format:**
```
✅ CORRECT:   CORS_ORIGIN=https://financial-dashboard.vercel.app
❌ WRONG:     CORS_ORIGIN='https://financial-dashboard.vercel.app'
❌ WRONG:     CORS_ORIGIN=https://financial-dashboard.vercel.app/
❌ WRONG:     CORS_ORIGIN=financial-dashboard.vercel.app
```

---

## PART 2: DATABASE CONFIGURATION - FIXED ✅

### Why SQLite is NOT Reliable in Railway

| Aspect | SQLite | PostgreSQL |
|--------|--------|-----------|
| **Filesystem** | Ephemeral (data lost on restart) | Persistent (Railway managed) |
| **Temp Restarts** | Data LOST ❌ | Data SAFE ✅ |
| **Concurrent Connections** | 1-2 max | Unlimited |
| **Backups** | Manual only | Railway managed ✅ |
| **Scalability** | Not scalable | Highly scalable |
| **Lock Conflicts** | High ⚠️ | Low ✅ |

### Current Configuration

Our Prisma schema now supports BOTH environments:

```prisma
datasource db {
  provider = env("DATABASE_PROVIDER")
  url      = env("DATABASE_URL")
}
```

### SQLite (Development Only)

```bash
# .env (Local Development)
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:./dev.db
```

**Generate migrations:**
```bash
npx prisma migrate dev --name init
```

### PostgreSQL (Railway Production - RECOMMENDED)

#### Step 1: Add PostgreSQL to Railway Project
1. Go to Railway Dashboard
2. Select your project
3. Click "New Service" → "Database" → "PostgreSQL"
4. Railway auto-generates `DATABASE_URL`

#### Step 2: Update Environment Variables
Railway automatically adds:
```
DATABASE_URL=postgresql://root:[password]@[host]:[port]/[database]
```

Just add:
```
DATABASE_PROVIDER=postgresql
```

#### Step 3: First Deployment - Run Migrations

Update your deployment command in Railway to:
```bash
npm run build && npm run migrate:prod && npm start
```

---

## PART 3: PRISMA CONFIGURATION - FIXED ✅

### Updated package.json Scripts

```json
{
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "postinstall": "npx prisma generate",
    "migrate": "npx prisma migrate dev",
    "migrate:prod": "npx prisma migrate deploy",
    "migrate:reset": "npx prisma migrate reset --force",
    "studio": "npx prisma studio",
    "seed": "node --loader ts-node/esm prisma/seed.ts",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write src/**/*.ts",
    "railway:deploy": "npm run build && npm run migrate:prod && npm start"
  }
}
```

### What Each Script Does:

| Script | Purpose | When to Use |
|--------|---------|------------|
| `postinstall` | Auto-generates Prisma client | **CRITICAL** - runs after `npm install` |
| `migrate:prod` | Deploy migrations to production | Railway deployment |
| `migrate:reset` | Reset DB (DEV ONLY) | Local development only |
| `railway:deploy` | Complete build & deploy | Railway build command |

---

## PART 4: CORS IMPLEMENTATION - FIXED ✅

### Updated Express Middleware (src/index.ts)

```typescript
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
```

### Features:
- ✅ Single or multiple domains support
- ✅ Automatic trimming of whitespace
- ✅ Dev mode allows all origins
- ✅ Production mode restricts to CORS_ORIGIN
- ✅ Credentials enabled for JWT auth
- ✅ All HTTP methods supported

### Testing CORS:

```bash
# Test from frontend: 
fetch('https://api.railway-app.com/api/records', {
  credentials: 'include',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
})
```

If you get CORS error:
1. Check browser console for exact domain mismatch
2. Update `CORS_ORIGIN` in Railway to match exactly
3. Restart Railway service

---

## PART 5: DATE HANDLING FIXED - CRITICAL BUG ✅

### The Problem
Dates were not consistently stored in ISO format, causing issues with:
- Frontend date parsing
- Date range queries
- API responses

### The Fix

**In services/record.service.ts:**
```typescript
private formatRecordDates(record: any) {
  return {
    ...record,
    date: record.date instanceof Date ? record.date.toISOString() : record.date,
    createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : record.createdAt,
    updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : record.updatedAt,
  };
}
```

**In controllers/record.controller.ts:**
```typescript
// Validate dates with error handling
if (req.query.startDate) {
  startDate = new Date(req.query.startDate as string);
  if (isNaN(startDate.getTime())) {
    return res.status(400).json({
      success: false,
      error: 'Invalid startDate format',
    });
  }
}
```

### API Response Format (Now ISO)

```json
{
  "success": true,
  "data": {
    "id": "cuid123",
    "amount": 1000,
    "type": "INCOME",
    "category": "Salary",
    "date": "2026-04-04T10:30:00.000Z",
    "createdAt": "2026-04-04T09:00:00.000Z",
    "updatedAt": "2026-04-04T10:30:00.000Z"
  },
  "timestamp": "2026-04-04T10:31:00.000Z"
}
```

---

## PART 6: PRODUCTION BEST PRACTICES - IMPLEMENTED ✅

### Environment Variable Validation

```typescript
const requiredEnv = ['DATABASE_URL', 'JWT_SECRET', 'NODE_ENV'];
const missingEnv = requiredEnv.filter((env) => !process.env[env]);
if (missingEnv.length > 0) {
  logger.error(`Missing environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}
```

**Server won't start if critical variables are missing** ✅

### Health Check Endpoints

**Basic Health:**
```
GET /health
Response: {
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2026-04-04T10:31:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

**Database Health:**
```
GET /health/db
Response: {
  "status": "ok",
  "message": "Database connection successful",
  "timestamp": "2026-04-04T10:31:00.000Z"
}
```

### Graceful Shutdown

```typescript
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Closes connections properly
// Waits max 30 seconds before force shutdown
```

---

## RAILWAY DEPLOYMENT STEP-BY-STEP

### Step 1: Connect GitHub

1. Go to https://railway.app/dashboard
2. Click "Create New Project"
3. Select "Deploy from GitHub"
4. Select repository: `Financial_dashboard_fullStackApp`
5. Click "Deploy Now"

### Step 2: Configure Build

Railway auto-detects Node.js. Set:

**Build Command:**
```bash
npm install && npm run build && npm run migrate:prod
```

**Start Command:**
```bash
npm start
```

### Step 3: Add Environment Variables

In Railway Dashboard → Project Settings → Variables:

| Key | Value |
|-----|-------|
| `DATABASE_PROVIDER` | `postgresql` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | (Generate using openssl) |
| `JWT_EXPIRY` | `7d` |
| `PORT` | `3000` |
| `LOG_LEVEL` | `info` |
| `CORS_ORIGIN` | YOUR_FRONTEND_DOMAIN |

Railway will auto-provide `DATABASE_URL` when PostgreSQL is added.

### Step 4: Add PostgreSQL Database

1. In Railway project, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway auto-generates `DATABASE_URL`
4. Your app now has a persistent database ✅

### Step 5: Deploy

1. Click "Deploy" button
2. Wait for build to complete (3-5 minutes)
3. Get your Railway URL: `https://your-project.up.railway.app`

### Step 6: Update CORS_ORIGIN

After frontend deployed:

1. Update `CORS_ORIGIN` to your frontend domain
2. Railway auto-redeploys
3. Test API calls work

---

## TESTING AFTER DEPLOYMENT

### Test 1: Server Health
```bash
curl https://your-project.up.railway.app/health
# Should return: {"status": "ok", ...}
```

### Test 2: Database Health
```bash
curl https://your-project.up.railway.app/health/db
# Should return: {"status": "ok", ...}
```

### Test 3: API Endpoint
```bash
curl -H "Authorization: Bearer YOUR_JWT" \
  https://your-project.up.railway.app/api/records
```

### Test 4: CORS from Frontend
```javascript
fetch('https://your-project.up.railway.app/api/records', {
  credentials: 'include',
  headers: { 'Authorization': 'Bearer TOKEN' }
});
// Should NOT get CORS errors
```

---

## TROUBLESHOOTING

### Issue: "Missing environment variables"

**Solution:** Check Railway Dashboard → Variables
- Ensure all required variables are set
- Check for typos
- Save and redeploy

### Issue: Database connection failed

**Solution:**
1. Verify `DATABASE_URL` is set correctly
2. Check PostgreSQL service is running (Railway Dashboard)
3. Run: `npm run migrate:prod` locally with same URL
4. Check logs: Railway Dashboard → Logs

### Issue: CORS Error

**Solution:**
1. Check exact frontend domain (no trailing slash)
2. Update `CORS_ORIGIN` to match exactly
3. Wait 2-3 minutes for Railway to redeploy
4. Clear browser cache
5. Check browser console for exact error

### Issue: Invalid Dates in API

**Solution:**
- All dates are now ISO format (2026-04-04T10:30:00.000Z)
- Frontend must parse with: `new Date(dateString)`
- Check API response in Postman for actual format

### Issue: Timeout on First Deploy

**Solution:**
- Database migrations take time on first deploy
- Check Railway logs for progress
- 10 minute timeout may be too short
- Manually run migrations in Railway:
  ```bash
  npm run migrate:prod
  ```

---

## MONITORING & LOGS

### View Logs in Railway
1. Project Dashboard → Logs
2. Filter by service (API)
3. Search for errors: "error" or "FAILED"

### Key Log Messages to Monitor
```
✓ Database connection successful
✓ Server is running on port 3000
✓ Environment: production
✗ Error: Missing environment variables
✗ Error: Database connection failed
```

---

## NEXT STEPS

1. ✅ Fix all code (DONE)
2. ✅ Update environment variables (THIS GUIDE)
3. ⏭️ Deploy to Railway (FOLLOW STEP-BY-STEP)
4. ⏭️ Test all endpoints
5. ⏭️ Monitor logs for first 24 hours
6. ⏭️ Set up error tracking (Sentry optional)

---

## Support Resources

- **Railway Docs:** https://docs.railway.app/
- **Prisma Guide:** https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch-typescript-postgres
- **Express.js CORS:** https://expressjs.com/en/resources/middleware/cors.html
- **JWT Best Practices:** https://tools.ietf.org/html/rfc7519

