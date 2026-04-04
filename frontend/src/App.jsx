import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layouts/MainLayout';
import Login from './components/auth/Login';
import DashboardPage from './pages/Dashboard';
import RecordsPage from './pages/Records';
import SettingsPage from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/records"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <RecordsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SettingsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Not Found */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-6">Page not found</p>
                  <a
                    href="/dashboard"
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
                  >
                    Go to Dashboard
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
