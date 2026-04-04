import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, TrendingUpIcon } from 'lucide-react';
import SummaryCard from '../dashboard/SummaryCard';
import { TrendsChart, CategoryChart } from '../dashboard/Charts';
import { LineChartComponent, AreaChartComponent } from '../charts/AdvancedCharts';
import { dashboardAPI, recordsAPI } from '../../services/api';
import { formatCurrency } from '../../utils/formatUtils';
import {
  transformMonthlyTrends,
  transformCategoryBreakdown,
  calculateWeeklyTrends,
  calculateCashFlow,
} from '../../utils/chartData';

export const AnalystDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    summary: null,
    trends: [],
    categories: [],
    weeklyTrends: [],
    cashFlow: [],
    topCategory: null,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summary, trends, breakdown, allRecords] = await Promise.all([
        dashboardAPI.getSummary(),
        dashboardAPI.getMonthlyTrends({ months: 6 }),
        dashboardAPI.getCategoryBreakdown(),
        recordsAPI.getAll({ limit: 1000, page: 1 }),
      ]);

      const summaryData = summary.data?.data || {};
      const trendsData = Array.isArray(trends.data?.data) ? trends.data.data : [];
      const breakdownData = Array.isArray(breakdown.data?.data) ? breakdown.data.data : [];
      const recordsData = Array.isArray(allRecords.data?.data?.data) ? allRecords.data.data.data : [];
      const categories = transformCategoryBreakdown(breakdownData);
      const topCategory = categories.length > 0 ? categories[0] : null;

      setData({
        summary: summaryData,
        trends: transformMonthlyTrends(trendsData),
        categories,
        weeklyTrends: calculateWeeklyTrends(recordsData),
        cashFlow: calculateCashFlow(recordsData),
        topCategory,
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
        <h1 className="text-3xl font-bold text-gray-900">Analyst Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Detailed financial analysis and insights
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

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartComponent
          title="Weekly Spending Trends"
          data={data.weeklyTrends}
          isLoading={loading}
        />
        <AreaChartComponent
          title="Cash Flow Analysis"
          data={data.cashFlow}
          isLoading={loading}
        />
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUpIcon className="w-5 h-5 text-blue-600" />
            Top Spending Category
          </h3>
          {data.topCategory ? (
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(data.topCategory.total)}
              </p>
              <p className="text-gray-600 mt-2">{data.topCategory.category}</p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${(
                      data.topCategory.total /
                      (Math.max(
                        ...data.categories.map((c) => c.total),
                        1
                      ) || 1)
                    ) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No spending data available</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Financial Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Income to Expense Ratio</span>
              <span className="font-semibold">
                {data.summary?.totalExpense > 0
                  ? (
                      (data.summary?.totalIncome || 0) /
                      (data.summary?.totalExpense || 1)
                    ).toFixed(2)
                  : '∞'}
                :1
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Monthly Income</span>
              <span className="font-semibold">
                {formatCurrency((data.summary?.totalIncome || 0) / 12)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Monthly Expense</span>
              <span className="font-semibold">
                {formatCurrency((data.summary?.totalExpense || 0) / 12)}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t">
              <span className="text-gray-600">Savings Rate</span>
              <span className="font-semibold text-green-600">
                {data.summary?.totalIncome > 0
                  ? (
                      ((data.summary?.netBalance || 0) /
                        (data.summary?.totalIncome || 1)) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalystDashboard;
