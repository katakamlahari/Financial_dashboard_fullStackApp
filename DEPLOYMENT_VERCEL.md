# Complete Vercel Deployment Guide for Finance Dashboard

## Overview

This guide covers deploying both the backend (Node.js API) and frontend (React) to Vercel with complete step-by-step instructions.

---

## Part 1: Backend Deployment (Node.js API on Vercel)

### Prerequisites

- Vercel account (free at https://vercel.com)
- GitHub account with the code pushed
- Node.js basics understanding

### Step 1: Create `vercel.json` Configuration

Create a `vercel.json` file in the **root directory** (where package.json is):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 2: Update `package.json` Build Configuration

Modify your `package.json` to include build script:

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "build": "tsc && npm run migrate:prod",
    "migrate:prod": "prisma migrate deploy",
    "seed": "npx prisma db seed"
  }
}
```

### Step 3: Create TypeScript Build Output

Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 4: Push Code to GitHub

```bash
cd c:\Users\Harsha\OneDrive\Desktop\Finance Dashboard
git add vercel.json package.json tsconfig.json
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### Step 5: Deploy Backend on Vercel

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard

2. **Click "Add New..." → "Project"**

3. **Import GitHub Repository:**
   - Select your repository: `Financial_dashboard_fullStackApp`
   - Vercel will auto-detect Node.js project

4. **Configure Project:**
   - **Project Name:** `financial-dashboard-api`
   - **Framework Preset:** Node.js
   - **Root Directory:** `./` (or leave empty)

5. **Add Environment Variables** (Critical):

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | `file:./prisma/prod.db` |
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | `aB7$kL2@mN8#pQ5!xY9&zC3*vW4+rS6-tU1^hJ0%dF4=` |
   | `JWT_EXPIRY` | `7d` |
   | `PORT` | `3000` |
   | `LOG_LEVEL` | `info` |
   | `CORS_ORIGIN` | `https://your-frontend.vercel.app` |

   **To add variables in Vercel:**
   - Go to Project Settings
   - Click "Environment Variables"
   - Add each variable
   - For production: select "Production" environment

6. **Deploy:**
   - Click "Deploy" button
   - Wait for deployment to complete (5-10 minutes)
   - You'll get a URL like: `https://financial-dashboard-api.vercel.app`

7. **Test Backend API:**
   ```
   https://financial-dashboard-api.vercel.app/api/records
   ```

---

## Part 2: Frontend Deployment (React on Vercel)

### Step 1: Update API Configuration

Edit `frontend/src/services/api.js`:

Replace:
```javascript
const API_BASE_URL = 'http://localhost:3000';
```

With:
```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000';
```

### Step 2: Create `vercel.json` in Frontend

Create `frontend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@api_url"
  }
}
```

### Step 3: Update `frontend/package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

### Step 4: Push Frontend Code

```bash
cd c:\Users\Harsha\OneDrive\Desktop\Finance Dashboard
git add frontend/
git commit -m "Update frontend for Vercel deployment with API configuration"
git push origin main
```

### Step 5: Deploy Frontend on Vercel

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard

2. **Click "Add New..." → "Project"**

3. **Import Same Repository** (if deploying from same repo):
   - GitHub will ask which folder to select
   - Select: `frontend` folder
   - **OR** import the frontend folder separately

4. **Project Settings:**
   - **Project Name:** `financial-dashboard`
   - **Framework:** Vite
   - **Root Directory:** `frontend/` (if backend is root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Add Environment Variables:**
   
   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | `https://financial-dashboard-api.vercel.app` |
   | `VITE_APP_NAME` | `Finance Dashboard` |

   **Important:** Use your actual backend Vercel URL from Step 1

6. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - You'll get a URL like: `https://financial-dashboard.vercel.app`

---

## Part 3: Connect Frontend & Backend

### Update Backend CORS

1. **Go to backend project** in Vercel Dashboard
2. **Settings → Environment Variables**
3. **Update `CORS_ORIGIN`:**
   ```
   https://financial-dashboard.vercel.app
   ```
4. **Redeploy backend:** Click "Deployments" → Last deployment → "Redeploy"

### Test Connection

1. Open frontend: `https://financial-dashboard.vercel.app`
2. Try to login/register
3. Check browser console for errors
4. Visit `https://financial-dashboard-api.vercel.app/api/records` and verify API responds

---

## Complete Environment Variables

### Backend (Vercel)
```
DATABASE_URL=file:./prisma/prod.db
NODE_ENV=production
JWT_SECRET=aB7$kL2@mN8#pQ5!xY9&zC3*vW4+rS6-tU1^hJ0%dF4=
JWT_EXPIRY=7d
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=https://financial-dashboard.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://financial-dashboard-api.vercel.app
VITE_APP_NAME=Finance Dashboard
```

---

## Troubleshooting

### Issue: "Cannot find module" Error

**Solution:**
- Ensure all dependencies are in `package.json`
- Run `npm install` locally first
- Check `node_modules` exists locally
- Push to GitHub and redeploy

### Issue: CORS Error

**Solution:**
- Update `CORS_ORIGIN` in backend to match frontend URL
- Ensure backend is deployed with new env variables
- Wait 2-3 minutes for new version to propagate
- Clear browser cache

### Issue: Database Error

**Solution:**
- Check `DATABASE_URL` is correct
- Run: `npx prisma migrate deploy` locally
- Verify migrations exist in `prisma/migrations/`
- For SQLite, ensure file path is writable

### Issue: JWT Token Invalid

**Solution:**
- Check `JWT_SECRET` matches between environments
- Ensure `JWT_EXPIRY` value is correct (e.g., "7d")
- Clear browser localStorage and re-login

### Issue: 502 Bad Gateway

**Solution:**
- Check backend logs in Vercel
- Verify environment variables are set
- Check build didn't fail
- Restart deployment

---

## Deployment Verification Checklist

**Backend:**
- [ ] `vercel.json` created
- [ ] Environment variables set
- [ ] Deployment successful (no build errors)
- [ ] API responds at `/api/records`
- [ ] Database migrations ran

**Frontend:**
- [ ] `VITE_API_URL` set to backend URL
- [ ] Build command correct
- [ ] Deployment successful
- [ ] Can load dashboard
- [ ] Can make API calls

**Connection:**
- [ ] Backend CORS updated
- [ ] Frontend can call backend
- [ ] Login/Register works
- [ ] Data displays correctly
- [ ] No console errors

---

## Production URLs

After deployment:

| Component | URL |
|-----------|-----|
| **Frontend** | `https://financial-dashboard.vercel.app` |
| **Backend API** | `https://financial-dashboard-api.vercel.app` |
| **API Docs** | `https://financial-dashboard-api.vercel.app/api-docs` |

---

## Production Best Practices

1. **JWT Secret:**
   - Generate strong random string: `openssl rand -base64 32`
   - Store securely in Vercel secrets
   - Never commit to GitHub

2. **CORS:**
   - Always specify exact frontend domain
   - Never use `*` in production

3. **Logging:**
   - Monitor Vercel logs regularly
   - Set up email alerts for errors
   - Keep `LOG_LEVEL=info` in production

4. **Database:**
   - Use `file:./prisma/prod.db` for small projects
   - Migrate to PostgreSQL for scale
   - Regular backups recommended

5. **Version Control:**
   - Don't commit `.env` files
   - Use `.env.local` for local development
   - Always `.gitignore` sensitive files

---

## Next Steps After Deployment

1. **Monitor Performance:**
   - Check Vercel Analytics dashboard
   - Monitor API response times
   - Watch for memory usage spikes

2. **Set Up Error Tracking:**
   - Use Sentry (optional)
   - Monitor Vercel logs
   - Set up email notifications

3. **Regular Updates:**
   - Keep dependencies updated
   - Monitor security advisories
   - Test updates locally first

4. **Scaling (When Needed):**
   - Migrate from SQLite to PostgreSQL
   - Add Redis for caching
   - Implement CDN for static files

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Vite Docs:** https://vitejs.dev
- **Node.js Docs:** https://nodejs.org/docs/
- **Prisma Docs:** https://www.prisma.io/docs/
- **GitHub:** https://github.com/katakamlahari/Financial_dashboard_fullStackApp

