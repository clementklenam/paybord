import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  color: string;
}

 title, value, change, changeLabel, icon, color }: StatsCardProps) {
  const isPositive = change >= 0;
  
  return (
    <motion.div
      className="relative group cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${color} rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity`}></div>
      <div className={`relative bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            {icon}
          </div>
          <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
            isPositive 
              ? 'text-green-100 bg-green-500/20' 
              : 'text-red-100 bg-red-500/20'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {Math.abs(change).toFixed(1)}%
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-white/90">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          <p className="text-xs text-white/70">{changeLabel}</p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/30 rounded-full"></div>
      </div>
    </motion.div>
  );
} 