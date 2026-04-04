# 💰 Finance Dashboard Frontend

A modern, responsive React dashboard application for personal finance management built with Vite, Tailwind CSS, and Recharts.

## 🚀 Features

- **Authentication**
  - JWT-based login system
  - Secure token storage in localStorage
  - Role-based redirect (Admin, Analyst, Viewer)
  - Automatic logout on session expiration

- **Dashboard**
  - Summary cards showing Total Income, Expenses, and Net Balance
  - Pie chart for category-wise spending breakdown
  - Bar chart for monthly income/expense trends
  - Recent transactions list

- **Records Management**
  - View all financial records in a table
  - Create new income/expense records
  - Edit existing records
  - Delete records with confirmation
  - Advanced filtering (type, date range, category)
  - Pagination support

- **User Interface**
  - Clean and modern design with gradient backgrounds
  - Responsive layout (mobile, tablet, desktop)
  - Sidebar navigation (collapsible on mobile)
  - Interactive charts and data visualization
  - Loading states and error handling

## 📋 Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: React Hooks & Context API

## 📁 Project Structure

```
finance-dashboard-frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── Login.jsx              # Login form component
│   │   ├── common/
│   │   │   ├── Navbar.jsx             # Top navigation bar
│   │   │   ├── Sidebar.jsx            # Side navigation menu
│   │   │   └── ProtectedRoute.jsx     # Route protection component
│   │   ├── dashboard/
│   │   │   ├── SummaryCard.jsx        # Summary statistic card
│   │   │   └── Charts.jsx             # Recharts visualizations
│   │   ├── records/
│   │   │   └── RecordForm.jsx         # Form for adding/editing records
│   │   └── layouts/
│   │       └── MainLayout.jsx         # Main layout wrapper
│   ├── contexts/
│   │   └── AuthContext.jsx            # Authentication context
│   ├── pages/
│   │   ├── Dashboard.jsx              # Dashboard page
│   │   └── Records.jsx                # Records management page
│   ├── services/
│   │   └── api.js                     # API integration with Axios
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx                        # Main app component
│   ├── main.jsx                       # React entry point
│   └── index.css                      # Global styles
├── index.html                         # HTML entry point
├── vite.config.js                     # Vite configuration
├── tailwind.config.js                 # Tailwind CSS configuration
├── postcss.config.js                  # PostCSS configuration
├── package.json                       # Dependencies and scripts
└── README.md                          # This file
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 16+ and npm installed
- Backend server running on `http://localhost:3000`

### Installation Steps

1. **Navigate to the project directory**
```bash
cd finance-dashboard-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 🔑 API Integration

The application connects to the backend API at `http://localhost:3000/api` with the following endpoints:

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get current user profile

### Records
- `GET /api/records` - List all records (with filters)
- `POST /api/records` - Create new record
- `GET /api/records/:id` - Get specific record
- `PUT /api/records/:id` - Update record
- `DELETE /api/records/:id` - Delete record

### Dashboard
- `GET /api/records/dashboard/summary` - Get summary data
- `GET /api/records/dashboard/trends` - Get monthly trends
- `GET /api/records/dashboard/breakdown` - Get category breakdown

## 👤 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Analyst | analyst@example.com | analyst123 |
| Viewer | viewer@example.com | viewer123 |

## 🎨 Features Explanation

### 1. Authentication Flow
- Users log in with email and password
- JWT token is stored in localStorage
- Token is automatically attached to all API requests
- Expired tokens trigger automatic logout and redirect to login

### 2. Dashboard Page
- Displays financial summary with three main metrics
- Charts update in real-time based on database records
- Recent transactions show the latest 5 transactions
- All data is fetched from backend APIs

### 3. Records Management
- Full CRUD operations for financial records
- Advanced filtering by type, date range
- Modal form for adding/editing records
- Inline actions (edit/delete) in the table
- Confirmation dialog before deleting records

### 4. Responsive Design
- Mobile-first approach with Tailwind CSS
- Collapsible sidebar on mobile devices
- Responsive grid layouts for cards and charts
- Touch-friendly buttons and controls

## 🔐 Security Features

- JWT-based authentication
- Protected routes requiring authentication
- Role-based access control
- Secure token storage
- Automatic token refresh on 401 errors
- CORS-enabled API communication

## 📊 State Management

- **Authentication**: Context API (AuthContext)
- **Component State**: React Hooks (useState, useEffect)
- **API Calls**: Cached with loading states
- **Error Handling**: Try-catch blocks with user feedback

## 🎯 Future Enhancements

- [ ] Budget tracking and goals
- [ ] Export reports (PDF/CSV)
- [ ] Multi-currency support
- [ ] Dark mode theme
- [ ] Advanced analytics and insights
- [ ] Bill reminders and due dates
- [ ] Investment tracking
- [ ] Recurring transactions

## 📝 Component Architecture

### Authentication Context
Manages global authentication state including:
- User data
- JWT token
- Loading state
- Login/logout functions

### API Service (Axios)
- Centralized API calls
- Automatic token injection
- Error handling
- Request/response interceptors

### Protected Routes
- Checks authentication status
- Validates user role
- Redirects unauthorized access

### Main Layout
- Combines Navbar and Sidebar
- Manages mobile sidebar toggle
- Provides responsive container

## 🐛 Troubleshooting

### Backend Connection Error
- Ensure backend is running on `http://localhost:3000`
- Check network connectivity
- Verify CORS settings in backend

### Login Issues
- Verify credentials are correct
- Check backend database has seed data
- Clear localStorage and refresh page

### Chart Not Loading
- Ensure backend API returns data in correct format
- Check browser console for API errors
- Verify date ranges in filter

## 📄 License

This project is part of the Finance Dashboard Application.

## 👨‍💻 Development

- Follows React best practices
- Component-based architecture
- Proper error handling
- Loading states for better UX
- Responsive design patterns
- Clean and readable code

## 🚀 Deployment

### Vercel
```bash
npm run build
vercel deploy
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Traditional Server
```bash
npm run build
# Deploy the 'dist' folder to your server
```

---

**Built with ❤️ for modern finance management**
