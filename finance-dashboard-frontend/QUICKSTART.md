# 🚀 Finance Dashboard - Quick Start Guide

## ⚡ Start the Application (3 Steps)

### Step 1: Start Backend Server
```bash
cd "c:\Users\Harsha\OneDrive\Desktop\Finance Dashboard"
npm run dev
```
✅ Backend running at: http://localhost:3000

### Step 2: Start Frontend Server (New Terminal)
```bash
cd "c:\Users\Harsha\OneDrive\Desktop\finance-dashboard-frontend"
npm run dev
```
✅ Frontend running at: http://localhost:5173

### Step 3: Open Dashboard
Visit your browser: **http://localhost:5173**

---

## 🔑 Login Credentials

Choose any account to test:

```
👨‍💼 Admin
admin@example.com
admin123

👨‍📊 Analyst
analyst@example.com
analyst123

👁️ Viewer
viewer@example.com
viewer123
```

---

## 📋 What You Can Do

### Dashboard Page
- View total income, expenses, and net balance
- See category-wise spending breakdown (pie chart)
- Check monthly income/expense trends (bar chart)
- View recent transactions

### Records Page
- ➕ Create new income/expense records
- ✏️ Edit existing records
- 🗑️ Delete records
- 🔍 Filter by type, date range
- 📊 View all records in a table

---

## 📁 Project Folders

```
Desktop/
├── Finance Dashboard/          ← Backend (Express.js, SQLite)
│   └── Running on port 3000
│
└── finance-dashboard-frontend/ ← Frontend (React, Vite)
    └── Running on port 5173
```

---

## 🎨 Features

✨ **Modern UI**
- Beautiful gradient design
- Responsive on all devices
- Smooth animations

🔐 **Secure**
- JWT authentication
- Protected routes
- Auto logout on expiration

📊 **Beautiful Charts**
- Pie charts for categories
- Bar charts for trends
- Interactive visualizations

📱 **Mobile Responsive**
- Works on desktop, tablet, mobile
- Collapsible sidebar
- Touch-friendly buttons

---

## ⚙️ Available Commands

### Backend
```bash
npm run dev      # Start dev server
npm run build    # Build TypeScript
npm start        # Start production server
npm run migrate  # Run Prisma migrations
npm run seed     # Seed database
npm run studio   # Open Prisma Studio
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🔗 API Endpoints

| Feature | Endpoint |
|---------|----------|
| Login | POST `/api/users/login` |
| View Records | GET `/api/records` |
| Create Record | POST `/api/records` |
| Dashboard | GET `/api/records/dashboard/summary` |
| Charts | GET `/api/records/dashboard/trends` |

---

## 🆘 Need Help?

### Backend not connecting
- Check backend is running: http://localhost:3000/health
- Clear browser cache
- Restart both servers

### Login failed
- Verify email and password are correct
- Check backend database has seed data (`npm run seed`)

### Charts not showing
- Ensure you have some records in database
- Check network tab in browser dev tools

---

## 📚 Learn More

- **Backend Docs**: `/Finance Dashboard/README.md`
- **Frontend Docs**: `/finance-dashboard-frontend/README.md`
- **Setup Info**: `/Finance Dashboard/SETUP_COMPLETE.md`
- **Project Details**: `/finance-dashboard-frontend/PROJECT_COMPLETE.md`

---

## 🎯 Next Steps

1. ✅ Start both servers
2. ✅ Login with demo account
3. ✅ Explore the dashboard
4. ✅ Create some financial records
5. ✅ Check charts and analytics
6. ✅ Test record filtering

---

**Happy using! 🎉**

*Dashboard URL: http://localhost:5173*  
*API URL: http://localhost:3000*
