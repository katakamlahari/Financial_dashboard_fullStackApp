import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/formatUtils';

export const SummaryCard = ({ title, amount, icon: Icon, color, trend, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="h-1" style={{ backgroundColor: color }}></div>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-2">
              {formatCurrency(amount || 0)}
            </h3>
          </div>
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-4 text-sm">
            {trend >= 0 ? (
              <>
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600">{trend}% increase</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-red-600">{Math.abs(trend)}% decrease</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
