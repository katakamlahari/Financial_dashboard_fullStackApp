import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const THEME_COLORS = {
  blue: {
    name: 'Blue',
    primary: '#667eea',
    secondary: '#5568d3',
    light: '#e0e7ff',
    dark: '#312e81',
  },
  purple: {
    name: 'Purple',
    primary: '#a855f7',
    secondary: '#9333ea',
    light: '#f3e8ff',
    dark: '#4c1d95',
  },
  green: {
    name: 'Green',
    primary: '#10b981',
    secondary: '#059669',
    light: '#d1fae5',
    dark: '#065f46',
  },
  red: {
    name: 'Red',
    primary: '#ef4444',
    secondary: '#dc2626',
    light: '#fee2e2',
    dark: '#7f1d1d',
  },
  orange: {
    name: 'Orange',
    primary: '#f97316',
    secondary: '#ea580c',
    light: '#ffedd5',
    dark: '#7c2d12',
  },
  pink: {
    name: 'Pink',
    primary: '#ec4899',
    secondary: '#db2777',
    light: '#fce7f3',
    dark: '#831843',
  },
  teal: {
    name: 'Teal',
    primary: '#14b8a6',
    secondary: '#0d9488',
    light: '#ccfbf1',
    dark: '#134e4a',
  },
  indigo: {
    name: 'Indigo',
    primary: '#6366f1',
    secondary: '#4f46e5',
    light: '#e0e7ff',
    dark: '#312e81',
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme-color') || 'blue';
  });

  const currentTheme = THEME_COLORS[theme];

  useEffect(() => {
    localStorage.setItem('theme-color', theme);
    // Apply CSS variables
    const root = document.documentElement;
    root.style.setProperty('--color-primary', currentTheme.primary);
    root.style.setProperty('--color-secondary', currentTheme.secondary);
    root.style.setProperty('--color-light', currentTheme.light);
    root.style.setProperty('--color-dark', currentTheme.dark);
  }, [theme, currentTheme]);

  const changeTheme = (newTheme) => {
    if (THEME_COLORS[newTheme]) {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
