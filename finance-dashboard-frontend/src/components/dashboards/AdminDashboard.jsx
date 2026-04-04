import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, PieChart, BarChart3 } from 'lucide-react';
import KPICard from '../dashboard/KPICard';
import ActivityFeed from '../dashboard/ActivityFeed';
import InsightsCard from '../dashboard/InsightsCard';
import { TrendsChart, CategoryChart } from '../dashboard/Charts';
import { dashboardAPI, recordsAPI } from '../../services/api';
import { transformMonthlyTrends, transformCategoryBreakdown } from '../../utils/chartData';

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    summary: null,
    trends: [],
    categories: [],
    insights: null,
    recentTransactions: [],
  });

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [summary, trends, breakdown, insights, allRecords] = await Promise.all([
        dashboardAPI.getSummary(),
        dashboardAPI.getMonthlyTrends({ months: 12 }),
        dashboardAPI.getCategoryBreakdown(),
        dashboardAPI.getInsights(),
        recordsAPI.getAll({ limit: 1000, page: 1 }),
      ]);

      console.log('Dashboard API Response:', { summary, trends, breakdown, insights, allRecords });

      const summaryData = summary.data?.data || {};
      const trendsData = Array.isArray(trends.data?.data) ? trends.data.data : [];
      const categoriesData = Array.isArray(breakdown.data?.data) ? breakdown.data.data : [];
      const insightsData = insights.data?.data || {};
      const recordsArray = Array.isArray(allRecords.data?.data?.data) ? allRecords.data.data.data : [];

      console.log('Processed Dashboard Data:', { summaryData, trendsData, categoriesData, insightsData, recordsArray });

      setData({
        summary: summaryData,
        trends: transformMonthlyTrends(trendsData),
        categories: transformCategoryBreakdown(categoriesData),
        insights: insightsData,
        recentTransactions: recordsArray,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to load dashboard';
      console.error('Dashboard Error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMonthChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const previousMonthExpense = data.insights?.lastMonthExpense || 0;
  const previousMonthIncome = data.insights?.lastMonthIncome || 0;
  const expenseChange = getMonthChange(data.insights?.currentMonthExpense || 0, previousMonthExpense);
  const incomeChange = getMonthChange(data.insights?.currentMonthIncome || 0, previousMonthIncome);
  const savingsChange = (data.insights?.currentMonthIncome || 0) - (data.insights?.currentMonthExpense || 0);

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg border border-red-200">
        <h2 className="font-bold mb-2">⚠️ Error Loading Dashboard</h2>
        <p>{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Complete system overview and financial analytics</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition text-sm font-medium"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Income"
          amount={data.insights?.currentMonthIncome || 0}
          icon={TrendingUp}
          color="#10b981"
          trend={incomeChange}
          trendLabel="last month"
          subtitle="This Month"
          isLoading={loading}
        />
        <KPICard
          title="Total Expenses"
          amount={data.insights?.currentMonthExpense || 0}
          icon={TrendingDown}
          color="#ef4444"
          trend={expenseChange}
          trendLabel="last month"
          subtitle="This Month"
          isLoading={loading}
          alert={data.insights?.expensesExceedIncome ? "Expenses exceed income!" : null}
        />
        <KPICard
          title="Net Balance"
          amount={savingsChange}
          icon={TrendingUp}
          color="#667eea"
          subtitle="Income - Expenses"
          isLoading={loading}
        />
        <KPICard
          title="Savings Rate"
          amount={`${data.insights?.savingsRate || 0}%`}
          icon={BarChart3}
          color="#f59e0b"
          subtitle="Percentage Saved"
          isLoading={loading}
        />
      </div>

      {/* Insights & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrendsChart data={data.trends} isLoading={loading} />
              <CategoryChart data={data.categories} isLoading={loading} />
            </div>

            {/* Category Breakdown with Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                Detailed Category Breakdown
              </h3>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : data.categories.length > 0 ? (
                <div className="space-y-2">
                  {data.categories.slice(0, 8).map((cat, idx) => {
                    const maxAmount = Math.max(...data.categories.map(c => c.total));
                    const percentage = (cat.total / maxAmount) * 100;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                            <span className="text-sm font-bold text-gray-900">₹{cat.total.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar with Insights and Activity */}
        <div className="space-y-6">
          <InsightsCard insights={data.insights} isLoading={loading} />
          <ActivityFeed transactions={data.recentTransactions} isLoading={loading} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
