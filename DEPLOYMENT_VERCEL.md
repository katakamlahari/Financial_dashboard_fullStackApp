# Vercel Deployment Configuration

This is a guide to deploy the Finance Dashboard Backend on Vercel using Serverless Functions.

## Prerequisites

- GitHub account with code pushed
- Vercel account
- Node.js 16+ runtime support

## Drawbacks & Considerations

### When to Use Vercel
- Frontend already on Vercel
- Need global edge network
- Serverless architecture preferred
- Cost-effective for low traffic

### When NOT to Use Vercel
- Need persistent job queues
- Long-running operations (>30s timeout)
- WebSocket connections required
- Always-on server needed

For Finance Dashboard, **Render or Railway** are better choices.

## Step 1: Serverless Configuration

Create `vercel.json` in root:

```json
{
  "version": 2,
  "buildCommand": "npm run build && npx prisma generate",
  "outputDirectory": "dist",
  "env": {
    "DATABASE_URL": "@database_url",
    "JWT_SECRET": "@jwt_secret",
    "NODE_ENV": "production",
    "LOG_LEVEL": "info"
  },
  "functions": {
    "src/index.ts": {
      "runtime": "nodejs18.x",
      "memory": 1024
    }
  }
}
```

## Step 2: Update package.json

For Vercel, add `api` entry point:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "vercel-build": "npm run build && npx prisma generate"
  }
}
```

## Step 3: Create API Handler

Create `api/index.ts`:

```typescript
import app from '../src/index';

export default app;
```

Or create `api/handler.ts`:

```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/index';

export default async (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};
```

## Step 4: Export Express App

Modify `src/index.ts` to export the app for Vercel:

```typescript
// At the end of src/index.ts
export default app;

// Add this for local development
if (process.env.NODE_ENV !== 'production') {
  startServer();
}
```

## Step 5: Deploy to Vercel

### Via Web Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Connect GitHub account
3. Import Finance Dashboard repository
4. Vercel auto-detects configuration
5. Click "Deploy"

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Step 6: Environment Variables

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add all variables:

```
DATABASE_URL=file:./prisma/prod.db
JWT_SECRET=your-secure-secret
NODE_ENV=production
LOG_LEVEL=info
CORS_ORIGIN=https://your-frontend.vercel.app
PORT=3000
```

## Database Considerations

### SQLite on Vercel (Not Recommended)

- Read-only on Vercel
- Data resets on redeploy
- Limited to 50MB per deployment

**Solution**: Use Vercel KV or external database

### PostgreSQL (Recommended)

Use Vercel's PostgreSQL:

```bash
# Create database
vercel postgres

# Get connection string
vercel postgres list
```

Update environment variables with PostgreSQL URL.

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### MongoDB (Alternative)

Use MongoDB Atlas:

```bash
# Create free cluster at https://www.mongodb.com/cloud/atlas
# Get connection string
# Update DATABASE_URL
```

## Important: Request/Response Handling

Vercel has limits:

- **Function timeout**: 30 seconds (Pro: 300s)
- **Request payload**: 6MB
- **Response payload**: 6MB
- **Concurrency**: Limited on free plan

### Optimize for Serverless

```typescript
// Add request timeout handling
app.use((req, res, next) => {
  res.setTimeout(25000, () => {
    res.status(500).send({ error: 'Request timeout' });
  });
  next();
});

// Limit payload
app.use(express.json({ limit: '1mb' }));

// Add query timeout
const queryTimeout = 20000; // 20 seconds
```

## Access Your API

After deployment:
- **Base URL**: `https://finance-dashboard.vercel.app`
- **API Docs**: `https://finance-dashboard.vercel.app/api-docs`

## Limitations & Solutions

### Issue: Database Resets on Deploy
- **Solution**: Use persistent database (PostgreSQL, MongoDB)
- **Why**: Vercel filesystem is ephemeral

### Issue: Serverless Functions Can't Use WebSockets
- **Solution**: Use REST API only (already implemented)
- **Why**: Vercel functions are request-response

### Issue: 30-Second Timeout
- **Solution**: Implement background jobs with external service
- **Workaround**: Optimize queries, use caching

### Issue: Cold Starts
- **Solution**: Keep functions warm with scheduled pings
- **Or**: Use Vercel Pro with guaranteed memory

## Alternative Database Options for Vercel

### 1. Vercel KV (Recommended for Vercel)
```bash
vercel kv create
```

### 2. MongoDB Atlas (Free)
```
Database URL: mongodb+srv://...
```

### 3. PlanetScale MySQL
```
Free tier available
Good for relational data
Database URL: mysql://...
```

### 4. Supabase PostgreSQL
```
Free tier with 500MB
Database URL: postgresql://...
```

## Best Practice: Hybrid Deployment

**Recommended Setup**:

1. Frontend on Vercel
2. Backend on Railway or Render
3. Database on PlanetScale or Supabase

This provides:
- Global CDN for frontend
- Always-on backend server
- Persistent database
- Better performance

## Performance Optimization

For Vercel serverless:

1. **API Response Caching**
```typescript
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=60');
  next();
});
```

2. **Query Optimization**
```typescript
// Lean queries, limited fields
const records = await prisma.financialRecord.findMany({
  select: {
    id: true,
    amount: true,
    category: true,
    date: true,
  },
  take: 10,
});
```

3. **Request Batching**
```typescript
// Batch multiple operations
const [records, total] = await Promise.all([...]);
```

## Monitoring & Logs

```bash
# View logs
vercel logs finance-dashboard

# Real-time logs
vercel logs finance-dashboard --follow
```

## Upgrade Plan

Free plan limitations:
- 100 serverless invocations/day
- 12 concurrent connections
- 30-second timeout

Upgrade to Pro for production use.

## Migration from Vercel to Other Platforms

If you outgrow Vercel:

```bash
# Export code
git clone your-repo

# Deploy to Railway
railway link
railway up

# Or deploy to Render
# Push to GitHub, connect via Render dashboard
```

---

**Recommendation**: For this Finance Dashboard app, use **Railway** or **Render** instead of Vercel for better compatibility and features.

For more details, visit [Vercel Docs](https://vercel.com/docs)
