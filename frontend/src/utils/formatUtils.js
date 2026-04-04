/**
 * Currency and formatting utilities
 */

// Get global currency preference from localStorage
const getGlobalCurrency = () => {
  return localStorage.getItem('currency') || 'INR';
};

export const formatCurrency = (amount, currency = null) => {
  if (amount === null || amount === undefined) return '₹0.00';
  
  const num = parseFloat(amount);
  if (isNaN(num)) return '₹0.00';
  
  const currencyCode = currency || getGlobalCurrency();
  const isINR = currencyCode === 'INR';
  const symbol = isINR ? '₹' : '$';
  const locale = isINR ? 'en-IN' : 'en-US';

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: isINR ? 'INR' : 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(num);
};

export const formatCurrencyShort = (amount, currency = null) => {
  if (amount === null || amount === undefined) return '₹0';
  
  const num = parseFloat(amount);
  if (isNaN(num)) return '₹0';
  
  const currencyCode = currency || getGlobalCurrency();
  const symbol = currencyCode === 'INR' ? '₹' : '$';

  if (Math.abs(num) >= 1000000) {
    return `${symbol}${(num / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(num) >= 1000) {
    return `${symbol}${(num / 1000).toFixed(1)}K`;
  }
  return `${symbol}${num.toFixed(0)}`;
};

export const parseAmount = (value) => {
  if (!value) return 0;
  
  const num = parseFloat(value.toString().replace(/[^0-9.-]/g, ''));
  return isNaN(num) ? 0 : num;
};

export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  
  const num = parseFloat(value);
  if (isNaN(num)) return '0%';
  
  return `${num.toFixed(decimals)}%`;
};

export const getChangeIndicator = (current, previous) => {
  if (!previous || previous === 0) {
    return { icon: '→', color: 'gray', percent: 0 };
  }
  
  const change = ((current - previous) / previous) * 100;
  
  if (change > 0) {
    return { icon: '↑', color: 'red', percent: Math.round(change) };
  }
  if (change < 0) {
    return { icon: '↓', color: 'green', percent: Math.round(Math.abs(change)) };
  }
  return { icon: '→', color: 'gray', percent: 0 };
};

export const getCategoryIcon = (category) => {
  const icons = {
    'Salary': '💼',
    'Freelance': '💻',
    'Bonus': '🎁',
    'Food': '🍕',
    'Transport': '🚗',
    'Entertainment': '🎬',
    'Utilities': '⚡',
    'Shopping': '🛍️',
    'Healthcare': '🏥',
    'Education': '📚',
    'Rent': '🏠',
    'Insurance': '🛡️',
    'Other': '💰',
  };
  
  return icons[category] || '💰';
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export default {
  formatCurrency,
  formatCurrencyShort,
  parseAmount,
  formatPercent,
  getChangeIndicator,
  getCategoryIcon,
  truncateText,
};
