import React from 'react';
import {TrendingUp, TrendingDown, Minus} from "lucide-react";

interface ShopifyStatsCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
  color?: 'yellow' | 'blue' | 'green' | 'purple';
}

export function ShopifyStatsCard({ title, value, change, changeLabel, icon, trend, color = 'yellow' }: ShopifyStatsCardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-gray-400';
  };

  const getTrendBgColor = () => {
    if (trend === 'up') return 'bg-green-900/20';
    if (trend === 'down') return 'bg-red-900/20';
    return 'bg-gray-900/20';
  };

  const getColorClasses = () => {
    switch (color) {
      case 'yellow':
        return {
          iconBg: 'bg-[#FFD700]/20',
          iconColor: 'text-[#FFD700]',
          borderColor: 'border-[#FFD700]/30'
        };
      case 'blue':
        return {
          iconBg: 'bg-blue-500/20',
          iconColor: 'text-blue-500',
          borderColor: 'border-blue-500/30'
        };
      case 'green':
        return {
          iconBg: 'bg-green-500/20',
          iconColor: 'text-green-500',
          borderColor: 'border-green-500/30'
        };
      case 'purple':
        return {
          iconBg: 'bg-purple-500/20',
          iconColor: 'text-purple-500',
          borderColor: 'border-purple-500/30'
        };
      default:
        return {
          iconBg: 'bg-[#FFD700]/20',
          iconColor: 'text-[#FFD700]',
          borderColor: 'border-[#FFD700]/30'
        };
    }
  };

  const colorClasses = getColorClasses();
  
  return (
    <div className={`bg-white rounded-xl border ${colorClasses.borderColor} p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${colorClasses.iconBg} rounded-xl`}>
          <div className={`${colorClasses.iconColor} transform transition-transform duration-300 group-hover:scale-110`}>
            {icon}
          </div>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendBgColor()} ${getTrendColor()}`}>
          {getTrendIcon()}
          <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{changeLabel}</p>
      </div>
    </div>
  );
} 