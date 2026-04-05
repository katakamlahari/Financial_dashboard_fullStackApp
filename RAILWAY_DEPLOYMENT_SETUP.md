# Railway Deployment Setup Guide - FinTrackr Backend

## ⚠️ Important: First Time Setup

Before deploying, you **MUST** complete these Railway setup steps. The app will fail without them.

---

## 🚀 Step-by-Step Railway Deployment

### Step 1: Create a Railway Project
1. Go to [railway.app](https://railway.app)
2. Sign in or create an account
3. Click **"+ New Project"**
4. Select **"Deploy from GitHub"** 
5. Authorize Railway to access your GitHub account
6. Select repository: `katakamlahari/Financial_dashboard_fullStackApp`
7. Select **main** branch
8. Click **Deploy**

### Step 2: Add PostgreSQL Database to Your Project
⚠️ **CRITICAL:** The backend requires a PostgreSQL database!

1. In your Railway Project dashboard
2. Click **"+ New"** (top right)
3. Select **"PostgreSQL"**
4. Railway will automatically create a PostgreSQL instance
5. **Railway auto-provides `DATABASE_URL`** - no manual setup needed!

### Step 3: Set Environment Variables

Railway Dashboard → Variables Tab:

**Auto-provided by Railway:**
```
DATABASE_URL=postgresql://...  ← Railway provides this automatically
```

**You must set these:**

| Variable | Value | How to Generate |
|----------|-------|-----------------|
| `JWT_SECRET` | Random 32-char string | See below |
| `NODE_ENV` | `production` | Copy as-is |
| `CORS_ORIGIN` | Your frontend domain | e.g., `https://your-app.vercel.app` |

**Generate JWT_SECRET:**

On your local machine (any OS):
```bash
# Mac/Linux:
openssl rand -base64 32

# Windows PowerShell:
$bytes = [byte[]]::new(32); [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes); [Convert]::ToBase64String($bytes)
```

Copy the output and paste into Railway Variables as `JWT_SECRET`

### Step 4: Verify Variables Are Set

Railway should show:
```
DATABASE_URL     = postgresql://...     ✅ Auto-provided
JWT_SECRET       = <your-random-key>    ✅ You set this
NODE_ENV         = production           ✅ You set this
CORS_ORIGIN      = https://...          ✅ You set this
PORT             = <auto-assigned>      ✅ Railway provides
```

### Step 5: Check Deployment Status

1. Railway Dashboard → **Deployments** tab
2. Look for your deployment (should start automatically)
3. Wait for **Build** to complete ✅
4. Check **Logs** tab for migrations running
5. App should start without errors

### Step 6: Verify App is Running

After successful deployment:

1. Go to **Domains** tab in Railway
2. Railway provides a public domain: `https://your-app-*.railway.app`
3. Test the API:
   ```bash
   curl https://your-app-*.railway.app/api/health
   ```

---

## ✅ Deployment Checklist

Before each deployment, verify:

- [ ] PostgreSQL database is **connected** to the Railway project
- [ ] `DATABASE_URL` is visible in Variables (Railway provides this)
- [ ] `JWT_SECRET` is set (32+ characters)
- [ ] `NODE_ENV=production`
- [ ] `CORS_ORIGIN` matches your frontend domain
- [ ] `.git` has latest commits pushed
- [ ] No `.env.production` file in repo (it's in `.gitignore`)

---

## 🔧 How Deployment Works

When you push to GitHub, Railway automatically:

1. **Pulls** latest code
2. **Installs** dependencies (`npm install`)
3. **Builds** app (`npm run build`) 
   - TypeScript compiled to JavaScript
   - Path aliases transformed to relative imports
   - `.js` extensions added for ES modules
4. **Release phase** (Procfile): Runs migrations (`npx prisma migrate deploy`)
5. **Starts app** (`npm start`)
6. **Health checks** - Railway verifies app is running
7. **Auto-scales** - increases resources if needed

---

## 🆘 Troubleshooting

### Error: "Can't reach database server at localhost:5432"

**Cause:** PostgreSQL database not connected to Railway project

**Fix:**
1. Railway Dashboard → Your Project
2. Click **"+ New"** → Select **PostgreSQL**
3. Wait for database to be provisioned
4. Redeploy (push empty commit: `git commit --allow-empty -m "redeploy"`)

### Error: "DATABASE_URL not found"

**Cause:** Database not connected, or variable not visible

**Fix:**
1. Check Variables tab - should show `DATABASE_URL` auto-populated
2. If empty, add PostgreSQL database (see above)
3. Restart deployment

### Error: "Missing environment variables"

**Cause:** `JWT_SECRET` or other required vars not set

**Fix:**
1. Railway Dashboard → Variables
2. Add all required variables
3. Redeploy

### App starts but crashes immediately

**Check logs:**
1. Railway Logs tab
2. Look for errors
3. Common issues:
   - Database connection failed → Add PostgreSQL
   - Missing JWT_SECRET → Set in Variables
   - Wrong CORS_ORIGIN → Update to match your frontend

### Migrations failed

**Fix:**
1. Check Railway Logs for specific error
2. Common cause: Database structure issue
3. Solution: 
   - Delete database and recreate (data loss!)
   - Or: Manually fix schema in Railway PostgreSQL console

---

## 📊 Monitoring

### View Logs
- Railway Dashboard → **Logs** tab
- Real-time error tracking
- Database query logs

### Metrics
- Railway Dashboard → **Metrics** tab
- CPU usage
- Memory usage
- Disk space

### Custom Domain (Optional)
- Railway Dashboard → **Settings** → **Domains**
- Add your custom domain
- Configure CORS_ORIGIN to match

---

## 🔐 Security Best Practices

1. **Never** commit `.env.production` - it's in `.gitignore`
2. **Always** use strong JWT_SECRET (32+ characters)
3. **Restrict** CORS_ORIGIN to your frontend domain only
4. **Use** Railway's automatic SSL/TLS (included)
5. **Monitor** Railway logs for unauthorized access attempts

---

## 🚂 Redeploy After Code Changes

### Simple Redeployment
```bash
git add .
git commit -m "Your changes"
git push origin main
# Railway auto-deploys!
```

### Force Redeploy (without code changes)
```bash
git commit --allow-empty -m "Force redeploy"
git push origin main
```

### Rollback to Previous Build
1. Railway Dashboard → Deployments
2. Find previous successful deployment
3. Click "Rollback"
4. App restarts with old code

---

## 📞 Need Help?

Railway Support: [railway.app/support](https://railway.app/support)

Common docs:
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Railway Databases](https://docs.railway.app/databases/overview)
- [Railway Deployments](https://docs.railway.app/deploy/deployments)

---

## 🎯 Final Verification

After successful deployment, test all endpoints:

```bash
# Health check
curl https://your-app-*.railway.app/api/health

# API docs (Swagger)
curl https://your-app-*.railway.app/api/docs

# Try a test request
curl -X GET https://your-app-*.railway.app/api/users
```

✅ **Congratulations! Your FinTrackr backend is live on Railway!**
