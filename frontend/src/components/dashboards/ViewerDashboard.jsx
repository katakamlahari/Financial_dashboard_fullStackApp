import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, Eye } from 'lucide-react';
import SummaryCard from '../dashboard/SummaryCard';
import { TrendsChart, CategoryChart } from '../dashboard/Charts';
import { dashboardAPI } from '../../services/api';
import { formatCurrency } from '../../utils/formatUtils';
import {
  transformMonthlyTrends,
  transformCategoryBreakdown,
} from '../../utils/chartData';

export const ViewerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    summary: null,
    trends: [],
    categories: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summary, trends, breakdown] = await Promise.all([
        dashboardAPI.getSummary(),
        dashboardAPI.getMonthlyTrends({ months: 6 }),
        dashboardAPI.getCategoryBreakdown(),
      ]);

      const summaryData = summary.data?.data || {};
      const trendsData = Array.isArray(trends.data?.data) ? trends.data.data : [];
      const breakdownData = Array.isArray(breakdown.data?.data) ? breakdown.data.data : [];

      setData({
        summary: summaryData,
        trends: transformMonthlyTrends(trendsData),
        categories: transformCategoryBreakdown(breakdownData),
      });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg border border-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-2 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Read-only view of your financial data
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Income"
          amount={data.summary?.totalIncome || 0}
          icon={TrendingUp}
          color="#10b981"
          isLoading={loading}
        />
        <SummaryCard
          title="Total Expenses"
          amount={data.summary?.totalExpense || 0}
          icon={TrendingDown}
          color="#ef4444"
          isLoading={loading}
        />
        <SummaryCard
          title="Net Balance"
          amount={data.summary?.netBalance || 0}
          icon={Wallet}
          color="#667eea"
          isLoading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendsChart data={data.trends} isLoading={loading} />
        <CategoryChart data={data.categories} isLoading={loading} />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            📋 Financial Overview
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Income</span>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(data.summary?.totalIncome || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Expenses</span>
              <span className="text-2xl font-bold text-red-600">
                {formatCurrency(data.summary?.totalExpense || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-gray-700 font-medium">Net Balance</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(data.summary?.netBalance || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          ℹ️ This is a read-only view. To manage your financial records, please
          contact your administrator.
        </p>
      </div>
    </div>
  );
};

export default ViewerDashboard;
