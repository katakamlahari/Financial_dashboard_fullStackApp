import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency, formatPercent, getChangeIndicator } from '../../utils/formatUtils';

export const KPICard = ({ 
  title, 
  amount, 
  icon: Icon, 
  color = '#667eea',
  trend,
  trendLabel,
  isLoading,
  subtitle,
  alert,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: color }}>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    );
  }

  const getTrendColor = () => {
    if (!trend) return 'text-gray-600';
    return trend > 0 ? 'text-red-600' : 'text-green-600';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 hover:shadow-lg transition" style={{ borderColor: color }}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {formatCurrency(amount)}
            </h3>
            {subtitle && <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{subtitle}</p>}
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        </div>

        {trend !== undefined && (
          <div className="flex items-center gap-2 mt-4 text-sm">
            <div className={`flex items-center gap-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{Math.abs(trend)}% {trend > 0 ? 'increase' : 'decrease'}</span>
            </div>
            {trendLabel && <span className="text-gray-600">vs {trendLabel}</span>}
          </div>
        )}

        {alert && (
          <div className="mt-4 p-2 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded text-red-700 dark:text-red-200 text-xs">
            ⚠️ {alert}
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
