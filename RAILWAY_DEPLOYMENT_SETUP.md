# Railway Deployment Setup Guide

## Prerequisites
- Code committed and pushed to GitHub
- Railway.app account
- PostgreSQL database on Railway (or any PostgreSQL provider)

## Deployment Steps

### 1. Create a Railway Project
- Go to [Railway.app](https://railway.app)
- Click "New Project"
- Select "Deploy from GitHub repo" or "Provision PostgreSQL"

### 2. Connect GitHub Repository
- Select: `katakamlahari/Financial_dashboard_fullStackApp`
- Authorize Railway to access your GitHub

### 3. Add PostgreSQL Database (if not already connected)
- In the project, click "+ New"
- Select "PostgreSQL"
- Railway will automatically generate `DATABASE_URL`

### 4. Set Environment Variables in Railway Dashboard
Railway Dashboard → Your Project → Variables
```
NODE_ENV=production
PORT=3000
JWT_SECRET=<generate-32-char-secret-with-openssl>
JWT_EXPIRY=7d
CORS_ORIGIN=https://your-frontend-domain.com
DATABASE_URL=<auto-provided-by-railway>
```

**Generate JWT_SECRET:**
```bash
# On your local machine (Unix/Mac/Linux):
openssl rand -base64 32

# On Windows PowerShell:
$bytes = [byte[]]::new(32)
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

### 5. Set Deployment Command (if not auto-detected)
Railway Dashboard → Your Project → Settings → Build/Deploy

**Build Command:**
```
npm run build
```

**Start Command:**
```
npm start
```

### 6. Enable Auto-Deploy (Optional)
- Settings → Auto Deploy → Enable
- Choose your branch (e.g., `main`)

### 7. Deploy Manually (First Time)
```bash
# In your local repository
git push origin main

# Or trigger manually in Railway Dashboard
# Click "Deploy" button
```

### 8. First Deployment Process
Railway will:
1. ✅ Install dependencies (`npm install`)
2. ✅ Build the app (`npm run build` - compiles TypeScript + transforms path aliases)
3. ✅ Run migrations (`npm run migrate:prod` - but this needs to be in a release phase)
4. ✅ Start the server (`npm start`)

## Common Issues

### Issue: Migrations not running on first deploy
**Solution:** Add a Procfile to the project root:
```
release: npx prisma migrate deploy
web: npm start
```

This tells Railway to run migrations before starting the web server.

### Issue: DATABASE_URL not found
**Solution:** Ensure PostgreSQL is connected to your project and the `DATABASE_URL` environment variable is visible in the Logs tab.

### Issue: Build fails with TypeScript errors
**Solution:** The repo has already been fixed. Ensure you're deploying the latest commit with:
- `tsc-alias` installed (transforms `@/` import aliases)
- `tsconfig.json` properly configured
- Build command: `npm run build` (runs `tsc && tsc-alias`)

### Issue: Port binding errors
**Solution:** Railway automatically assigns a PORT via the `PORT` environment variable. Code already uses this correctly.

## Post-Deployment

### View Logs
Railway Dashboard → Your Project → Logs tab

### Custom Domain
Railway Dashboard → Your Project → Settings → Custom Domain

### Scale Resources
Railway Dashboard → Your Project → Settings → Instance Size

## Local Development (for testing migrations)

### Prerequisites
- PostgreSQL installed locally
- `.env.local` configured

### Setup Local Database
```bash
# Create database (run in PostgreSQL)
createdb finance_dashboard

# Run migrations
npm run migrate

# Start dev server
npm run dev
```

## Monitoring

- **Logs**: Railway Dashboard → Logs
- **Metrics**: Railway Dashboard → Metrics
- **Health Checks**: Ensure `GET /health` endpoint works (if implemented)

## Rebuild & Redeploy

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Railway will auto-deploy if enabled, or manually trigger:
# Railway Dashboard → Deploy button
```

## Rollback

If deployment fails, Railway keeps previous builds. You can:
1. Click "Rollback" in Railway Dashboard
2. Or redo the Git push to the previous working commit

---

✅ Your backend is now ready for production deployment on Railway!
