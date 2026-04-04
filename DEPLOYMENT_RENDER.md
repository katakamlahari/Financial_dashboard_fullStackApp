# Render Deployment Configuration

This is a guide to deploy the Finance Dashboard Backend on Render.

## Prerequisites

- GitHub account with the code pushed
- Render account (free tier available)

## Step-by-Step Deployment

### 1. Create a Render Account
- Go to [render.com](https://render.com)
- Sign up or log in with GitHub

### 2. Create a New Web Service

1. Click "New" button
2. Select "Web Service"
3. Connect your GitHub repository
4. Select the repository containing the Finance Dashboard backend

### 3. Configure the Service

Fill in the following details:

- **Name**: `finance-dashboard-api`
- **Environment**: Select `Node`
- **Region**: Choose closest to your location
- **Branch**: `main` (or your default branch)
- **Build Command**: 
  ```
  npm install && npm run build && npx prisma migrate deploy
  ```
- **Start Command**: 
  ```
  npm start
  ```

### 4. Set Environment Variables

In the "Environment Variables" section, add:

```
DATABASE_URL=file:./prisma/prod.db
NODE_ENV=production
JWT_SECRET=your-very-secure-random-secret-key-here
JWT_EXPIRY=7d
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=https://your-frontend-domain.com
```

### 5. Deploy

Click "Create Web Service" to start the deployment.

Render will:
1. Clone your repository
2. Install dependencies
3. Build the TypeScript
4. Run Prisma migrations
5. Start the server

## Post-Deployment

### Access Your API

- **Base URL**: `https://finance-dashboard-api.onrender.com`
- **API Docs**: `https://finance-dashboard-api.onrender.com/api-docs`
- **Health Check**: `https://finance-dashboard-api.onrender.com/health`

### Database

Render provides free disk space. The SQLite database will persist on the server.

To backup/export database:
1. Use Prisma Studio via SSH
2. Export data using Render's shell access

### Monitoring

- View logs in Render dashboard
- Monitor CPU and memory usage
- Set up notifications for deployment failures

## Scaling Considerations

For production scale-up:
1. Consider migrating to PostgreSQL
2. Use Environment variables for multi-environment setup
3. Implement caching (Redis)
4. Set up database backups

## Updating Your Deployment

To update after pushing code changes:

1. Push changes to GitHub
   ```bash
   git add .
   git commit -m "your message"
   git push origin main
   ```

2. Render automatically triggers a redeploy
   - Or manually redeploy from the Render dashboard

3. Check deployment logs to ensure all steps completed

## Troubleshooting

### Build Failed
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### Database Connection Error
- Ensure `DATABASE_URL` is set correctly
- Check that Prisma migrations ran successfully
- Look at application logs for specific errors

### CORS Issues
- Update `CORS_ORIGIN` environment variable
- Include your frontend URL with protocol

### Out of Memory
- Upgrade to a paid plan
- Optimize database queries
- Implement pagination/limits

## Render Pricing (Free Tier)

- Free web service with shared CPU
- 0.5GB RAM
- Auto-pause after 15 minutes of inactivity
- For production, upgrade to Starter or Pro plan

## Alternative: Using Render PostgreSQL

For better reliability, use Render's PostgreSQL:

1. Create a PostgreSQL database on Render
2. Update `DATABASE_URL` to PostgreSQL connection string
3. Update Prisma schema if needed:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

---

For more details, visit [Render Docs](https://render.com/docs)
