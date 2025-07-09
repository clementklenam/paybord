import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  trend: number | null;
  icon?: React.ReactNode;
  gradient?: string;
}

export function DashboardCard({ title, value, description, trend, icon, gradient }: DashboardCardProps) {
  return (
    <Card className={`overflow-hidden bg-gradient-to-br ${gradient || 'from-white to-gray-50/50'} border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {icon && (
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  {icon}
                </div>
              )}
              <p className="text-sm font-medium text-white/90">{title}</p>
            </div>
            {trend !== null && (
              <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                trend >= 0 
                  ? 'text-green-100 bg-green-500/20' 
                  : 'text-red-100 bg-red-500/20'
              }`}>
                {trend >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(trend).toFixed(1)}%
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-xs text-white/70">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
