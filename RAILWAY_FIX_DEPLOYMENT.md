# 🚂 Railway Deployment - FinTrackr Fix Guide

## Current Issue

**Error:** 
```
Prisma schema validation error: A datasource must not use the env() function in the provider argument.
```

**Root Cause:** The deployment is using an older cached version of the code.

---

## ✅ Solution: Redeploy with Latest Code

### Step 1: Clear Railway Build Cache

1. Go to [Railway Dashboard](https://railway.app)
2. Select your **FinTrackr** project
3. Click on the **Backend Service**
4. Navigate to **Settings** → **Build**
5. Click **"Disable"** and then **"Enable"** to clear the build cache

### Step 2: Trigger New Deployment

**Option A: Via Railway Dashboard**
1. Go to **Deployments** tab
2. Click **"Deploy"** button to manually trigger a new build

**Option B: Via Git Push**
```bash
git push origin main --force
```

### Step 3: Verify Environment Variables

Railway Dashboard → Backend Service → **Variables**

Ensure these variables are set:
```
NODE_ENV=production
PORT=3000
JWT_SECRET=your-generated-secret-key
JWT_EXPIRY=7d
CORS_ORIGIN=https://your-frontend-domain.com
```

**DATABASE_URL** is automatically provided by Railway PostgreSQL plugin

---

## ✨ Updated Code

The repository now has the correct **Prisma schema**:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Not** this (deprecated):
```prisma
datasource db {
  provider = env("DATABASE_PROVIDER")  ❌ NOT ALLOWED
  url      = env("DATABASE_URL")
}
```

---

## 🔍 Latest Commit

**Commit:** `a45911b`  
**Message:** `chore: rebrand to FinTrackr, update TypeScript config, fix migrations`

### Changes Included:
- ✅ Fixed Prisma schema (hardcoded PostgreSQL provider)
- ✅ Updated TypeScript config (no deprecation warnings)
- ✅ Rebranded to FinTrackr
- ✅ Removed old SQLite migrations

---

## 📋 Deployment Checklist

- [ ] Confirm latest code is on `main` branch: `a45911b`
- [ ] Clear Railway build cache
- [ ] Trigger new deployment
- [ ] Verify DATABASE_URL exists in Railway PostgreSQL plugin
- [ ] Check build logs for success
- [ ] Test API at `https://your-backend.railway.app/api-docs`

---

## 🐛 If Deployment Still Fails

### Check Railway Logs:
1. Backend Service → **Logs** tab
2. Look for the specific error message

### Common Issues:

| Error | Fix |
|-------|-----|
| `DATABASE_URL not found` | Add PostgreSQL plugin to Railway project |
| `Port already in use` | Change PORT env var or restart service |
| `npm install timeout` | Increase timeout in Railway settings |
| `Prisma generate failed` | Clear cache and rebuild |

### Reset Deployment:

```bash
# From your local machine
cd "Finance Dashboard"
git status  # Verify clean state
git push origin main
```

Then in Railway: Click **Deploy** to rebuild

---

## 🚀 Verification After Deployment

Once deployed, verify with:

```bash
# Check API health
curl https://your-backend.railway.app/api-docs

# Check logs
# Railway Dashboard → Backend → Logs
```

Expected output: Swagger API documentation page

---

## 📞 Railway Support

If issues persist:
1. Visit [Railway Help](https://docs.railway.app)
2. Check [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
3. Contact Railway Support via Dashboard

---

**Last Updated:** April 4, 2026  
**Project:** FinTrackr  
**Status:** Ready for deployment
