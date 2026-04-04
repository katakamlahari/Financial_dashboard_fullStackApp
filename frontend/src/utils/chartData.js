// Chart data transformation utilities

export const transformMonthlyTrends = (data) => {
  return Array.isArray(data)
    ? data.map((item) => ({
        name: item.month || item.name || '',
        income: item.income || 0,
        expense: item.expense || 0,
        balance: (item.income || 0) - (item.expense || 0),
      }))
    : [];
};

export const transformCategoryBreakdown = (data) => {
  return Array.isArray(data)
    ? data.map((item) => ({
        category: item.category || 'Other',
        total: item.total || 0,
      }))
    : [];
};

export const calculateWeeklyTrends = (records) => {
  if (!Array.isArray(records) || records.length === 0) {
    return [];
  }

  const weeks = {};
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(startOfWeek);
    weekStart.setDate(weekStart.getDate() + i * 7);
    const weekNum = `Week ${i + 1}`;
    weeks[weekNum] = { income: 0, expense: 0 };
  }

  records.forEach((record) => {
    const recordDate = new Date(record.date);
    if (recordDate >= startOfWeek) {
      const daysDiff = Math.floor(
        (recordDate - startOfWeek) / (1000 * 60 * 60 * 24)
      );
      const weekNum = `Week ${Math.floor(daysDiff / 7) + 1}`;

      if (weeks[weekNum]) {
        if (record.type === 'INCOME') {
          weeks[weekNum].income += record.amount;
        } else {
          weeks[weekNum].expense += record.amount;
        }
      }
    }
  });

  return Object.entries(weeks).map(([name, data]) => ({
    name,
    ...data,
  }));
};

export const calculateCashFlow = (records) => {
  if (!Array.isArray(records) || records.length === 0) {
    return [];
  }

  let balance = 0;
  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return sortedRecords.slice(-30).map((record, index) => {
    if (record.type === 'INCOME') {
      balance += record.amount;
    } else {
      balance -= record.amount;
    }

    return {
      name: new Date(record.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      balance,
    };
  });
};

export default {
  transformMonthlyTrends,
  transformCategoryBreakdown,
  calculateWeeklyTrends,
  calculateCashFlow,
};
