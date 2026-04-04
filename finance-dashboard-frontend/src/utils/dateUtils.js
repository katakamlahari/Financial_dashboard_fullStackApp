/**
 * Date utility functions for proper ISO format handling
 */

export const normalizeDate = (date) => {
  if (!date) return null;
  
  try {
    if (typeof date === 'string') {
      // Handle ISO string
      return new Date(date);
    }
    if (date instanceof Date) {
      return date;
    }
    return null;
  } catch (e) {
    console.error('Date normalization error:', e);
    return null;
  }
};

export const toISOString = (date) => {
  const normalized = normalizeDate(date);
  return normalized ? normalized.toISOString() : null;
};

export const formatDate = (date, format = 'DD/MM/YYYY') => {
  const normalized = normalizeDate(date);
  if (!normalized) return 'Invalid Date';

  const day = normalized.getDate().toString().padStart(2, '0');
  const month = (normalized.getMonth() + 1).toString().padStart(2, '0');
  const year = normalized.getFullYear();

  if (format === 'DD/MM/YYYY') return `${day}/${month}/${year}`;
  if (format === 'MM/DD/YYYY') return `${month}/${day}/${year}`;
  if (format === 'YYYY-MM-DD') return `${year}-${month}-${day}`;
  
  return `${day}/${month}/${year}`;
};

export const formatDateTime = (date) => {
  const normalized = normalizeDate(date);
  if (!normalized) return 'Invalid Date';

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return normalized.toLocaleDateString('en-US', options);
};

export const formatMonthYear = (date) => {
  const normalized = normalizeDate(date);
  if (!normalized) return 'Invalid Date';

  const options = { year: 'numeric', month: 'long' };
  return normalized.toLocaleDateString('en-US', options);
};

export const getMonthName = (monthIndex) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex] || 'Invalid Month';
};

export const getTimeAgo = (date) => {
  const normalized = normalizeDate(date);
  if (!normalized) return 'Invalid Date';

  const now = new Date();
  const seconds = Math.floor((now - normalized) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return formatDate(normalized);
};

export const isSameDay = (date1, date2) => {
  const d1 = normalizeDate(date1);
  const d2 = normalizeDate(date2);
  
  if (!d1 || !d2) return false;
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const isSameMonth = (date1, date2) => {
  const d1 = normalizeDate(date1);
  const d2 = normalizeDate(date2);
  
  if (!d1 || !d2) return false;
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth()
  );
};

export const getStartOfMonth = (date) => {
  const normalized = normalizeDate(date);
  if (!normalized) return null;
  
  return new Date(normalized.getFullYear(), normalized.getMonth(), 1);
};

export const getEndOfMonth = (date) => {
  const normalized = normalizeDate(date);
  if (!normalized) return null;
  
  return new Date(normalized.getFullYear(), normalized.getMonth() + 1, 0);
};

export const getMonthsDifference = (date1, date2) => {
  const d1 = normalizeDate(date1);
  const d2 = normalizeDate(date2);
  
  if (!d1 || !d2) return 0;
  
  return (
    (d2.getFullYear() - d1.getFullYear()) * 12 +
    (d2.getMonth() - d1.getMonth())
  );
};

export const addMonths = (date, months) => {
  const normalized = normalizeDate(date);
  if (!normalized) return null;
  
  const result = new Date(normalized);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const groupByMonth = (records) => {
  if (!Array.isArray(records)) return {};
  
  const grouped = {};
  
  records.forEach(record => {
    const date = normalizeDate(record.date);
    if (!date) return;
    
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push(record);
  });
  
  return grouped;
};

export const groupByWeek = (records) => {
  if (!Array.isArray(records)) return {};
  
  const grouped = {};
  
  records.forEach(record => {
    const date = normalizeDate(record.date);
    if (!date) return;
    
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    const weekKey = formatDate(startOfWeek, 'YYYY-MM-DD');
    
    if (!grouped[weekKey]) {
      grouped[weekKey] = [];
    }
    grouped[weekKey].push(record);
  });
  
  return grouped;
};

export default {
  normalizeDate,
  toISOString,
  formatDate,
  formatDateTime,
  formatMonthYear,
  getMonthName,
  getTimeAgo,
  isSameDay,
  isSameMonth,
  getStartOfMonth,
  getEndOfMonth,
  getMonthsDifference,
  addMonths,
  groupByMonth,
  groupByWeek,
};
