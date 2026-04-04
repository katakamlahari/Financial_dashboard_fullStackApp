# Railway Deployment Configuration

This is a guide to deploy the Finance Dashboard Backend on Railway.

## Prerequisites

- GitHub, GitLab, or Bitbucket account with code pushed
- Railway account (free tier available with $5 monthly credit)

## Step-by-Step Deployment

### 1. Create a Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub/GitLab/Bitbucket

### 2. Create a New Project

1. Click "New Project"
2. Select "Deploy from GitHub"
3. Authorize Railway to access your GitHub account
4. Select the Finance Dashboard repository

### 3. Configure the Application

#### Automatic Detection
Railway auto-detects Node.js project and reads:
- `package.json` for dependencies
- `package.json` scripts for build/start commands

#### Custom Configuration (if needed)

Create a `railway.json` in root directory:

```json
{
  "buildCommand": "npm install && npm run build",
  "startCommand": "npm start",
  "nixpacks": {
    "providers": ["nodejs-npm"]
  }
}
```

### 4. Set Environment Variables

1. Go to Variables tab in Railway
2. Add the following:

```
DATABASE_URL=file:./prisma/prod.db
NODE_ENV=production
JWT_SECRET=your-very-secure-random-secret-key
JWT_EXPIRY=7d
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=https://your-frontend-domain.com
```

### 5. Configure Build & Deploy

Add the startup script in the deployment settings:

```bash
npm run migrate:prod && npm start
```

### 6. Deploy

1. Click "Deploy"
2. Railway builds and deploys your application
3. View real-time logs during deployment

## Post-Deployment

### Access Your API

Once deployed, Railway provides:
- **Base URL**: `https://your-project.railway.app`
- **API Docs**: `https://your-project.railway.app/api-docs`
- **Health Check**: `https://your-project.railway.app/health`

### Custom Domain (Optional)

1. Go to Deployments
2. Click on your deployment
3. Add custom domain under "Settings"
4. Update DNS records at your domain provider

## Database Management

### SQLite (Current Setup)

SQLite database is stored in the deployment file system.

To backup:
```bash
# Via Railway CLI
railway run ls -la prisma/
railway run cat prisma/prod.db > backup.db
```

### PostgreSQL (Recommended for Production)

1. Create PostgreSQL database:
   ```bash
   railway add --service postgresql
   ```

2. Find connection string:
   ```bash
   railway variables
   ```

3. Update `DATABASE_URL`:
   - Replace `DATABASE_URL` with PostgreSQL connection string

4. Update Prisma schema (optional):
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

5. Run migrations:
   ```bash
   railway run npx prisma migrate deploy
   ```

## Scaling & Monitoring

### Monitor Application

```bash
# View logs
railway logs

# Check environment variables
railway variables

# Connect to terminal
railway shell
```

### Manual Deployment

For deployments from command line:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
railway up

# Check status
railway status

# View logs
railway logs -f
```

## Railway Pricing (Free Tier)

- $5 monthly credit for free tier
- Includes compute, databases, and network
- Pay-as-you-go after credits used
- Reasonable pricing for production use

## Code Deployment Flow

1. Make changes to code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "your changes"
   git push origin main
   ```
3. Railway automatically deploys (takes 2-5 minutes)
4. Check deployment logs for errors

## Environment-Specific Configuration

### Development
```
NODE_ENV=development
LOG_LEVEL=debug
```

### Production
```
NODE_ENV=production
LOG_LEVEL=info
```

Switch by updating Railway variables.

## Troubleshooting

### Build Fails
- Check Railway build logs
- Ensure `package-lock.json` is committed
- Verify Node version compatibility (16+)

### Database Connection Fails
- Verify `DATABASE_URL` is set correctly
- For PostgreSQL, ensure user permissions
- Check firewall/IP whitelist

### Port Binding Issues
- Railway auto-assigns port, don't hardcode
- Use `process.env.PORT` (already in code)

### Memory/CPU Issues
- Upgrade plan or optimize code
- Use connection pooling for databases
- Implement caching

## Advanced: CI/CD with Railway

### Automatic Deployments

```bash
# Enable auto-deploy from GitHub
railway enable auto-deploy

# Disable if needed
railway disable auto-deploy
```

### Multiple Environments

Create multiple Railway projects:

1. Main project for production
2. Staging project for testing
3. Development project for development

Each with separate database and environment variables.

## Database Seeding

To seed production database:

```bash
# Temporarily set command to seed
railway run npx prisma db seed

# Then revert to normal start command
```

Or create a seed script in GitHub Actions.

## Backup & Restore

### PostgreSQL Backup
```bash
railway run pg_dump > backup.sql
railroad run psql < backup.sql
```

### SQLite Backup
```bash
railway run cp prisma/prod.db prisma/prod.db.bak
```

## Performance Tips

1. Use PostgreSQL for production (faster than SQLite)
2. Add database indexes in Prisma schema
3. Implement pagination for list endpoints
4. Use query caching for analytics
5. Monitor slow queries in logs

## Monitoring & Alerts

Railway provides:
- Real-time logs
- Deployment history
- Metrics dashboard
- Error tracking

Check regularly and set up external monitoring for production.

---

For more information, visit [Railway Docs](https://docs.railway.app)
