# 🏗️ Finance Dashboard - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                              │
│              (http://localhost:5173)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP/WebSocket
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              REACT FRONTEND (Vite)                           │
│         (finance-dashboard-frontend)                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Pages                                              │    │
│  │  ├── Login.jsx         (Authentication)            │    │
│  │  ├── Dashboard.jsx     (Charts & Summary)          │    │
│  │  └── Records.jsx       (CRUD Operations)           │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Components                                         │    │
│  │  ├── Auth (Login)                                  │    │
│  │  ├── Common (Navbar, Sidebar, ProtectedRoute)     │    │
│  │  ├── Dashboard (SummaryCard, Charts)              │    │
│  │  ├── Records (RecordForm)                         │    │
│  │  └── Layouts (MainLayout)                         │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  State Management                                   │    │
│  │  ├── AuthContext (JWT, User Data)                 │    │
│  │  ├── React Hooks (useState, useEffect)            │    │
│  │  └── localStorage (Persistence)                   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Services                                           │    │
│  │  ├── api.js (Axios Configuration)                 │    │
│  │  ├── authAPI (Login, Register, Profile)           │    │
│  │  ├── recordsAPI (CRUD Operations)                 │    │
│  │  └── dashboardAPI (Analytics, Charts)             │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Dependencies: React, React-Router, Axios, Recharts        │
│  Styling: Tailwind CSS                                     │
│  Icons: Lucide React                                       │
└─────────────────────────────────────────────────────────────┘
                       │
                       │ REST API (JSON)
                       │ Authorization: Bearer JWT
                       ↓
┌─────────────────────────────────────────────────────────────┐
│         EXPRESS.JS BACKEND (Node.js)                        │
│         (Finance Dashboard - port 3000)                     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Routes                                             │    │
│  │  ├── /api/users/    (Authentication)              │    │
│  │  ├── /api/records/  (Financial Records)           │    │
│  │  └── /api/dashboard/ (Analytics)                  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Middleware                                         │    │
│  │  ├── auth.middleware (JWT Verification)           │    │
│  │  ├── validation.middleware (Zod Schema)           │    │
│  │  └── error.middleware (Error Handling)            │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Controllers                                        │    │
│  │  ├── user.controller (Auth Logic)                 │    │
│  │  └── record.controller (Records Logic)            │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Services                                           │    │
│  │  ├── user.service (User Business Logic)           │    │
│  │  └── record.service (Records Business Logic)      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Data Access (Repositories)                        │    │
│  │  ├── user.repository (User CRUD)                  │    │
│  │  └── record.repository (Records CRUD)             │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Utils                                              │    │
│  │  ├── jwt.ts (Token Generation/Verification)       │    │
│  │  ├── errors.ts (Custom Error Classes)             │    │
│  │  ├── logger.ts (Logging)                          │    │
│  │  └── database.ts (Prisma Client)                  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Dependencies: Express, Prisma, JWT, Zod, bcryptjs         │
│  Architecture Pattern: Clean Architecture                  │
└─────────────────────────────────────────────────────────────┘
                       │
                       │ SQL Queries (Prisma ORM)
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                   SQLITE DATABASE                           │
│               (file:./dev.db)                               │
│                                                              │
│  Tables:                                                    │
│  ├── users                                                  │
│  │   ├── id (UUID)                                         │
│  │   ├── email (Unique)                                    │
│  │   ├── password (Hashed with bcryptjs)                  │
│  │   ├── firstName                                         │
│  │   ├── lastName                                          │
│  │   ├── role (ADMIN, ANALYST, VIEWER)                     │
│  │   └── isActive                                          │
│  │                                                          │
│  └── financialRecords                                      │
│      ├── id (UUID)                                         │
│      ├── amount (Decimal)                                  │
│      ├── type (INCOME, EXPENSE)                            │
│      ├── category (String)                                 │
│      ├── date (DateTime)                                   │
│      ├── notes (Optional)                                  │
│      ├── createdBy (Foreign Key → users.id)                │
│      └── deletedAt (Soft Delete)                           │
│                                                              │
│  Indexes:                                                    │
│  ├── idx_users_email                                       │
│  ├── idx_financialRecords_createdBy                        │
│  └── idx_financialRecords_date                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
LOGIN FLOW
──────────
User Input (Email/Password)
    ↓
React Login Component
    ↓
Axios POST /api/users/login
    ↓
Backend user.controller
    ↓
user.service.login()
    ↓
user.repository.findByEmail()
    ↓
SQLite Query: SELECT * FROM users WHERE email = ?
    ↓
Password Compare (bcrypt)
    ↓
Generate JWT Token
    ↓
AuthContext.login() (Store token & user)
    ↓
Redirect to Dashboard
    ↓
localStorage.setItem('token', jwt)
    ↓
Automatic redirect on route change


DASHBOARD DATA FLOW
───────────────────
User visits /dashboard
    ↓
useEffect() triggered
    ↓
dashboardAPI.getSummary()
    ↓
Axios GET /api/records/dashboard/summary
    ↓
Authorization: Bearer {JWT}
    ↓
Backend record.controller.getDashboardSummary()
    ↓
record.service.getDashboardSummary()
    ↓
Parallel queries to record.repository:
├── getTotalIncome(userId)
├── getTotalExpense(userId)
├── getCategoryTotals(userId)
└── getRecentTransactions(userId)
    ↓
SQLite Queries executed
    ↓
Results aggregated
    ↓
Response sent to frontend
    ↓
setDashboardData() updates state
    ↓
Charts re-render with new data


RECORD CREATION FLOW
────────────────────
User fills form (amount, type, category, date, notes)
    ↓
Submit button clicked
    ↓
handleCreateOrUpdate() called
    ↓
recordsAPI.create(formData)
    ↓
Axios POST /api/records
    ↓
Authorization: Bearer {JWT}
    ↓
Backend receives request
    ↓
Validation middleware (Zod schema)
    ↓
record.controller.createRecord()
    ↓
record.service.createRecord()
    ↓
record.repository.create()
    ↓
sqliteQuery: INSERT INTO financialRecords (...)
    ↓
New record ID returned
    ↓
fetchRecords() called to refresh table
    ↓
Table re-renders with new data
    ↓
Modal form closes
```

---

## Authentication Flow

```
┌─────────────┐
│   Login     │
│   Form      │
└──────┬──────┘
       │
       ├──> Email & Password Input
       │
       ├──> POST /api/users/login
       │
       ├──> Backend Verification
       │    ├─ Find user by email
       │    ├─ Compare password (bcrypt)
       │    └─ Generate JWT Token
       │
       ├──> JWT Returned to Frontend
       │
       ├──> AuthContext.login()
       │    ├─ Store user data in state
       │    ├─ Store token in state
       │    └─ Save to localStorage
       │
       ├──> Token Added to Headers
       │    └─ Authorization: Bearer {JWT}
       │
       └──> Redirect to Dashboard
            (ProtectedRoute allows access)
```

---

## Component Hierarchy

```
App.jsx
├── BrowserRouter
│   └── AuthProvider
│       ├── ProtectedRoute
│       │   └── MainLayout
│       │       ├── Navbar
│       │       │   └── User Profile & Logout
│       │       ├── Sidebar
│       │       │   └── Navigation Links
│       │       └── Main Content Area
│       │           ├── DashboardPage
│       │           │   ├── SummaryCard (x3)
│       │           │   │   ├── TrendingUp Icon
│       │           │   │   ├── Amount Display
│       │           │   │   └── Trend Indicator
│       │           │   ├── TrendsChart
│       │           │   │   └── BarChart (Recharts)
│       │           │   ├── CategoryChart
│       │           │   │   └── PieChart (Recharts)
│       │           │   └── Recent Transactions Table
│       │           │
│       │           └── RecordsPage
│       │               ├── Filter Section
│       │               ├── Add Record Button
│       │               ├── Records Table
│       │               │   ├── Date Column
│       │               │   ├── Category Column
│       │               │   ├── Type Badge
│       │               │   ├── Amount Column
│       │               │   └── Actions (Edit/Delete)
│       │               └── RecordForm Modal
│       │                   ├── Type Selector
│       │                   ├── Category Select
│       │                   ├── Amount Input
│       │                   ├── Date Input
│       │                   └── Notes Textarea
│       │
│       └── Login
│           ├── Email Input
│           ├── Password Input
│           └── Submit Button
```

---

## File Relationships

```
API Calls:
api.js
├── Used by: Dashboard.jsx, Records.jsx, Login.jsx
└── Makes requests to Backend endpoints

Context:
AuthContext.jsx
├── Provides: useAuth() hook
└── Used by: Components, ProtectedRoute, API interceptors

Components:
├── Layout: MainLayout (combines Navbar + Sidebar)
├── Pages: Dashboard, Records (use MainLayout)
├── Shared: SummaryCard, Charts (used across pages)
└── Forms: RecordForm (modal component)

State Management:
├── Global: AuthContext (user, token)
├── Local: useState in components (forms, filters)
└── Persistence: localStorage (token storage)
```

---

## API Request/Response Examples

### Login Request
```json
POST /api/users/login
{
  "email": "admin@example.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "cmniyvkzd0000gvq7ml7oz04b",
      "email": "admin@example.com",
      "firstName": "Admin",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Dashboard Summary
```json
GET /api/records/dashboard/summary
Authorization: Bearer {JWT}

Response:
{
  "success": true,
  "data": {
    "totalIncome": 15000,
    "totalExpense": 5000,
    "netBalance": 10000,
    "categoryTotals": [...],
    "recentTransactions": [...]
  }
}
```

### Records List
```json
GET /api/records?type=EXPENSE&page=1&limit=10
Authorization: Bearer {JWT}

Response:
{
  "success": true,
  "data": [
    {
      "id": "rec123",
      "amount": 50.00,
      "type": "EXPENSE",
      "category": "Food",
      "date": "2026-04-03",
      "notes": "Lunch"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

## Deployment Architecture

```
Production Deployment
─────────────────────

┌──────────────────────────────────────────────────────────┐
│                  Domain: yoursite.com                    │
└────────────┬─────────────────────────────────┬───────────┘
             │                                 │
             ↓                                 ↓
    ┌─────────────────┐          ┌─────────────────────┐
    │ Vercel/Netlify  │          │  Your Server/VPS    │
    │                 │          │                     │
    │ Frontend (React)│          │ Backend (Express)   │
    │ - React app     │          │ - Node.js server    │
    │ - CDN delivery  │          │ - PostgreSQL/SQLite │
    │ - Automatic SSL │          │ - Docker container  │
    └─────────────────┘          └─────────────────────┘
             │                         │
             └────────── HTTPS ────────┘
```

---

## Performance Optimization

```
Frontend Optimizations:
├── Code splitting with Vite
├── Lazy loading of routes
├── Memoized components (React.memo)
├── Optimized re-renders (useCallback)
├── Image optimization
├── CSS minification
└── Production build size: ~150KB gzipped

Backend Optimizations:
├── Database indexes on frequently queried columns
├── Query optimization with Prisma
├── Connection pooling
├── Request caching
├── Response compression (gzip)
└── Error handling and logging
```

---

## Security Measures

```
Frontend:
├── JWT stored in localStorage
├── Protected routes with authentication check
├── Role-based access control
├── XSS prevention (React escapes content)
└── HTTPS in production

Backend:
├── Password hashing with bcryptjs
├── JWT token validation
├── SQL injection prevention (Prisma ORM)
├── CORS configuration
├── Rate limiting ready
├── Input validation with Zod
└── Error message sanitization
```

---

This architecture provides:
✅ Scalability
✅ Maintainability
✅ Security
✅ Performance
✅ User Experience
