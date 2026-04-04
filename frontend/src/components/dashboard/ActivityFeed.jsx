import React from 'react';
import { formatDateTime, getTimeAgo } from '../../utils/dateUtils';
import { formatCurrency, getCategoryIcon } from '../../utils/formatUtils';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const ActivityFeed = ({ transactions = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 pb-4 border-b dark:border-gray-700">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const sortedTransactions = Array.isArray(transactions)
    ? [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];

  if (sortedTransactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-0">
        {sortedTransactions.slice(0, 5).map((transaction, index) => (
          <div
            key={transaction.id || index}
            className="flex items-center gap-4 py-4 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                transaction.type === 'INCOME'
                  ? 'bg-green-100 dark:bg-green-900'
                  : 'bg-red-100 dark:bg-red-900'
              }`}
            >
              {getCategoryIcon(transaction.category)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white text-sm">
                {transaction.category}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                {getTimeAgo(transaction.date)}
              </p>
              {transaction.notes && (
                <p className="text-gray-500 dark:text-gray-400 text-xs truncate">
                  {transaction.notes}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {transaction.type === 'INCOME' ? (
                <ArrowDownLeft className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
              <span
                className={`font-semibold text-sm ${
                  transaction.type === 'INCOME'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {transaction.type === 'INCOME' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-primary font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
        View All Transactions →
      </button>
    </div>
  );
};

export default ActivityFeed;
