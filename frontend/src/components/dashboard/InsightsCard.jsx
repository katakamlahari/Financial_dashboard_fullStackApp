import React from 'react';
import { AlertCircle, TrendingUp, Target, Zap } from 'lucide-react';
import { formatCurrency, getCategoryIcon } from '../../utils/formatUtils';

export const InsightsCard = ({ insights = {}, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 dark:from-blue-900 to-indigo-50 dark:to-indigo-900 rounded-lg shadow-md p-6 border border-blue-200 dark:border-blue-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Smart Insights</h3>
        <div className="space-y-3">
          <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-full"></div>
          <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-full"></div>
          <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const {
    highestSpendingCategory,
    averageDailySpending = 0,
    currentMonthExpense = 0,
    currentMonthIncome = 0,
    monthOverMonthChange = { expense: 0, income: 0 },
    expensesExceedIncome = false,
    savingsRate = 0,
  } = insights;

  return (
    <div className="bg-gradient-to-br from-blue-50 dark:from-blue-900 to-indigo-50 dark:to-indigo-900 rounded-lg shadow-md p-6 border border-blue-200 dark:border-blue-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Smart Insights</h3>

      <div className="space-y-4">
        {/* Alert if expenses exceed income */}
        {expensesExceedIncome && (
          <div className="flex gap-3 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900 dark:text-red-200 text-sm">⚠️ Alert</p>
              <p className="text-red-700 dark:text-red-300 text-xs">
                Your expenses exceed income this month!
              </p>
            </div>
          </div>
        )}

        {/* Top spending category */}
        {highestSpendingCategory && (
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-lg">
                {getCategoryIcon(highestSpendingCategory.name)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Top Category</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {highestSpendingCategory.name}
                </p>
              </div>
            </div>
            <p className="font-semibold text-orange-600 dark:text-orange-400">
              {formatCurrency(highestSpendingCategory.amount)}
            </p>
          </div>
        )}

        {/* Average daily spending */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Daily Average</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Average spending per day</p>
            </div>
          </div>
          <p className="font-semibold text-blue-600 dark:text-blue-400">
            {formatCurrency(averageDailySpending)}/day
          </p>
        </div>

        {/* Savings Rate */}
        {savingsRate !== undefined && (
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Savings Rate</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Percentage of income saved</p>
              </div>
            </div>
            <p className={`font-semibold ${
              savingsRate > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {savingsRate}%
            </p>
          </div>
        )}

        {/* Month over Month comparison */}
        {monthOverMonthChange && (
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Expense Change</p>
              <p className={`font-semibold text-sm ${
                monthOverMonthChange.expense > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
              }`}>
                {monthOverMonthChange.expense > 0 ? '+' : ''}{monthOverMonthChange.expense}%
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Income Change</p>
              <p className={`font-semibold text-sm ${
                monthOverMonthChange.income > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {monthOverMonthChange.income > 0 ? '+' : ''}{monthOverMonthChange.income}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsCard;
