import React, { useState } from 'react';
import { User, Lock, LogOut, Globe, Calendar, Palette, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme, THEME_COLORS } from '../contexts/ThemeContext';
import { useToast } from '../hooks/useToast';
import { authAPI } from '../services/api';
import ToastContainer from '../components/common/Toast';

export const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { theme: currentTheme, changeTheme } = useTheme();
  const { toasts, addToast, removeToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({
    currency: localStorage.getItem('currency') || 'INR',
    dateFormat: localStorage.getItem('dateFormat') || 'DD/MM/YYYY',
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(
        err.response?.data?.error?.message || 'Failed to update profile',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      addToast('Password changed successfully!', 'success');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      addToast(
        err.response?.data?.error?.message || 'Failed to change password',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
    addToast(`Theme changed to ${THEME_COLORS[newTheme].name}`, 'success');
  };
  
  const handleCurrencyChange = (newCurrency) => {
    setPreferences({ ...preferences, currency: newCurrency });
    localStorage.setItem('currency', newCurrency);
    addToast(`Currency changed to ${newCurrency}`, 'success');
  };

  const handlePreferencesChange = (key, value) => {
    setPreferences({ ...preferences, [key]: value });
    localStorage.setItem(`pref_${key}`, value);
    addToast(`${key} updated to ${value}`, 'success');
  };

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'success');
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account, preferences, and security</p>
      </div>

      {/* User Info Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-2 border-white">
            <User className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-blue-100 text-sm mt-1">{user?.email}</p>
            <div className="mt-3 flex gap-2">
              <span className="inline-block px-3 py-1 bg-blue-400/30 text-white rounded-full text-xs font-medium border border-blue-200">
                👤 {user?.role}
              </span>
              {user?.isActive && (
                <span className="inline-block px-3 py-1 bg-green-400/30 text-white rounded-full text-xs font-medium border border-green-200 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Active
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md border-b">
        <div className="flex gap-0">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'security', label: 'Security', icon: Lock },
            { id: 'preferences', label: 'Preferences', icon: Globe },
            { id: 'permissions', label: 'Permissions', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Update Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Update Profile
            </h2>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="First name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
              >
                {loading ? 'Updating...' : 'Save Profile'}
              </button>
            </form>
          </div>

          {/* Profile Info */}
          <div className="bg-gray-50 rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-medium text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Account Status:</span>
                <span className={`font-medium ${user?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium text-gray-900">{user?.role}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Last Login:</span>
                <span className="font-medium text-gray-900">Today</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Change Password Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-600" />
              Change Password
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="••••••••"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition font-medium"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Security Tips */}
          <div className="bg-yellow-50 rounded-lg shadow-md p-6 border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">🔒 Security Tips</h3>
            <ul className="space-y-3 text-sm text-yellow-800">
              <li className="flex gap-2">
                <span className="text-lg">✓</span>
                <span>Use a strong password with uppercase, lowercase, numbers, and symbols</span>
              </li>
              <li className="flex gap-2">
                <span className="text-lg">✓</span>
                <span>Never share your password with anyone</span>
              </li>
              <li className="flex gap-2">
                <span className="text-lg">✓</span>
                <span>Change your password periodically (every 3 months)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-lg">✓</span>
                <span>Always log out when using shared computers</span>
              </li>
              <li className="flex gap-2">
                <span className="text-lg">✓</span>
                <span>Enable two-factor authentication if available</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Display Preferences */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-600" />
              Display Preferences
            </h2>

            <div className="space-y-5">
              {/* Currency Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Currency
                </label>
                <select
                  value={preferences.currency}
                  onChange={(e) => handlePreferencesChange('currency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="INR">₹ Indian Rupee (INR)</option>
                  <option value="USD">$ US Dollar (USD)</option>
                  <option value="EUR">€ Euro (EUR)</option>
                  <option value="GBP">£ British Pound (GBP)</option>
                </select>
              </div>

              {/* Date Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format
                </label>
                <select
                  value={preferences.dateFormat}
                  onChange={(e) => handlePreferencesChange('dateFormat', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              {/* Theme Selection - Color Palette */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Color Theme
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(THEME_COLORS).map(([key, color]) => (
                    <button
                      key={key}
                      onClick={() => handleThemeChange(key)}
                      className={`flex flex-col items-center gap-2 px-3 py-3 rounded-lg border-2 transition ${
                        currentTheme === key
                          ? 'border-gray-800 ring-2 ring-offset-1 ring-gray-400'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      title={color.name}
                    >
                      <div
                        className="w-8 h-8 rounded-full shadow-md"
                        style={{ backgroundColor: color.primary }}
                      ></div>
                      <span className="text-xs font-medium text-gray-700">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preferences Info */}
            <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">ℹ️ About Preferences</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <p>
                  <strong>Currency:</strong> All monetary values in the dashboard will be displayed in your selected currency.
                </p>
                <p>
                  <strong>Date Format:</strong> All dates throughout the application will follow your preferred format.
                </p>
                <p>
                  <strong>Theme:</strong> Choose between light mode for daytime use and dark mode for comfortable eye usage at night.
                </p>
                <p className="text-xs text-blue-600 mt-4">
                  Your preferences are saved locally in your browser and synced across sessions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Role & Permissions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admin - if applicable */}
            {user?.role === 'ADMIN' && (
              <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Admin Access
                </h3>
                <ul className="space-y-2 text-sm text-green-800">
                  <li>✓ Full system access</li>
                  <li>✓ View all records</li>
                  <li>✓ Manage users</li>
                  <li>✓ System settings</li>
                  <li>✓ Generate reports</li>
                </ul>
              </div>
            )}

            {/* Analyst */}
            {user?.role === 'ANALYST' && (
              <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Analyst Access
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>✓ View all records</li>
                  <li>✓ Create reports</li>
                  <li>✓ Edit own records</li>
                  <li>✓ Access analytics</li>
                </ul>
              </div>
            )}

            {/* Viewer */}
            {user?.role === 'VIEWER' && (
              <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
                <h3 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Viewer Access
                </h3>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li>✓ View own records</li>
                  <li>✓ View dashboard</li>
                  <li>✓ Edit own records</li>
                </ul>
              </div>
            )}

            {/* Common Permissions */}
            <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-4">Common Features</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Create records</li>
                <li>✓ Edit own records</li>
                <li>✓ View dashboard</li>
                <li>✓ Update profile</li>
                <li>✓ Change password</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <p>
              <strong>Need more permissions?</strong> Contact your administrator to upgrade your role and access additional features.
            </p>
          </div>
        </div>
      )}

      {/* Logout Section */}
      <div className="bg-red-50 rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-red-900">Logout</h3>
            <p className="text-red-700 text-sm mt-1">End your current session and return to login</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
