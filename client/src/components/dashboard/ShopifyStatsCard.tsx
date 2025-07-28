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
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-400';
  };

  const getTrendBgColor = () => {
    if (trend === 'up') return 'bg-green-100';
    if (trend === 'down') return 'bg-red-100';
    return 'bg-gray-100';
  };

  return (
    <div className="bg-white rounded-xl border border-[#FFD700] p-6 shadow hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-[#FFD700]/20 rounded-xl">
          <div className="text-[#FFD700] transform transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendBgColor()} ${getTrendColor()}`}> 
          {getTrendIcon()}
          <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-[#232323]">{value}</p>
        <p className="text-xs text-gray-400">{changeLabel}</p>
      </div>
    </div>
  );
} 