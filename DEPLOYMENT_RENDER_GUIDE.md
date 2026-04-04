# Render Deployment Configuration

## Environment Variables for Production (Render)

Add these environment variables to your Render service:

```
DATABASE_URL=file:./prisma/prod.db
NODE_ENV=production
JWT_SECRET=aB7$kL2@mN8#pQ5!xY9&zC3*vW4+rS6-tU1^hJ0%dF4=
JWT_EXPIRY=7d
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=https://financial-dashboard.onrender.com
```

## Step-by-Step Deployment Guide

### 1. Backend Deployment (Render)

**Create Backend Service:**
- Go to https://dashboard.render.com
- Click "New +"
- Select "Web Service"
- Connect your GitHub repository
- Select the branch (main)

**Configure Service:**
- **Name:** financial-dashboard-api
- **Environment:** Node
- **Build Command:** `npm install && npx prisma migrate deploy && npx prisma db seed`
- **Start Command:** `npm start` (or `npm run dev` for development)

**Environment Variables:**
```
DATABASE_URL=file:./prisma/prod.db
NODE_ENV=production
JWT_SECRET=aB7$kL2@mN8#pQ5!xY9&zC3*vW4+rS6-tU1^hJ0%dF4=
JWT_EXPIRY=7d
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=https://your-frontend-domain.onrender.com
```

**Important Notes:**
- Render will assign a URL like: `https://financial-dashboard-api.onrender.com`
- File-based SQLite DB works fine for small projects
- For production with concurrent users, consider PostgreSQL add-on

### 2. Frontend Deployment (Render or Vercel)

**Option A: Render**
- Create another Web Service
- Set Build Command: `npm install && npm run build`
- Set Start Command: `npm run preview` or use Static Site
- Deploy with distfolder

**Option B: Vercel (Recommended)**
- Import from GitHub
- Set Backend API URL in environment: `VITE_API_URL=https://financial-dashboard-api.onrender.com`

### 3. Update CORS_ORIGIN

After deployment, update the backend's CORS_ORIGIN to match your frontend URL:
```
CORS_ORIGIN=https://your-frontend-app.vercel.app
```
or
```
CORS_ORIGIN=https://your-frontend-app.onrender.com
```

---

## Generated JWT Secret (Use One of These)

| Number | Secret |
|--------|--------|
| 1 | `aB7$kL2@mN8#pQ5!xY9&zC3*vW4+rS6-tU1^hJ0%dF4=` |
| 2 | `x9K@pL5#mN2$vW8!zC4&hJ6*rS1-tU3+qF7%dX0^aB=` |
| 3 | `c3M$vP7@nL9#sT2&yF8*wR4-qC6+zJ1%hK5^bD0=xV` |

Choose one and copy it to the JWT_SECRET field.

---

## Database Configuration

### SQLite (File-based - Current Setup)
```
DATABASE_URL=file:./prisma/prod.db
```
- Works well for single instances
- Data persists on Render filesystem
- Good for MVP/small apps

### PostgreSQL (Recommended for Production)
```
DATABASE_URL=postgresql://user:password@host:5432/finance_dashboard
```
- Scalable & multi-instance ready
- Render provides PostgreSQL add-ons
- Better for production apps

---

## API Endpoints After Deployment

**Base URL:** `https://financial-dashboard-api.onrender.com`

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token

### Records
- `GET /api/records` - Get all records (paginated)
- `POST /api/records` - Create new record
- `GET /api/records/:id` - Get record by ID
- `PUT /api/records/:id` - Update record
- `DELETE /api/records/:id` - Delete record
- `POST /api/records/bulk-delete` - Delete multiple records

### Dashboard
- `GET /api/records/dashboard/summary` - Summary statistics
- `GET /api/records/dashboard/monthly-trends` - Trend analysis
- `GET /api/records/dashboard/category-breakdown` - Category insights
- `GET /api/records/dashboard/insights` - Smart insights

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `POST /api/auth/change-password` - Change password

---

## Deployment Checklist

- [ ] Push code to GitHub
- [ ] Create Render account
- [ ] Deploy backend service
- [ ] Set all environment variables
- [ ] Test API endpoints
- [ ] Deploy frontend
- [ ] Update CORS_ORIGIN if needed
- [ ] Test full application flow
- [ ] Monitor logs for errors

---

## Troubleshooting

**Database Connection Error:**
- Ensure DATABASE_URL is correct
- Check migrations ran: `npx prisma migrate deploy`
- Verify file permissions in Render

**CORS Error:**
- Update CORS_ORIGIN to match frontend URL
- Restart backend service

**JWT Authentication Error:**
- Ensure JWT_SECRET matches between deployments
- Check token expiry: JWT_EXPIRY=7d

**Port Already in Use:**
- Render handles port assignment automatically
- Default port 3000 is fine for Render

---

## Production Best Practices

1. **Use strong JWT_SECRET**: Generate random 32+ character string
2. **Enable HTTPS**: Render provides free SSL certificates
3. **Monitor logs**: Check Render dashboard for errors
4. **Regular backups**: For SQLite, use external storage
5. **Update dependencies**: Keep packages up-to-date
6. **Environment separation**: Never commit .env files

