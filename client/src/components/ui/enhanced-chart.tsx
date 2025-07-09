import React from 'react';
import { 
  Line, 
  LineChart as RechartsLineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Area,
  AreaChart,
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface EnhancedChartProps {
  data: DataPoint[];
  type?: 'line' | 'area' | 'bar' | 'pie';
  height?: number;
  color?: string;
  showGrid?: boolean;
  showAxis?: boolean;
  animate?: boolean;
  className?: string;
  currency?: string;
  title?: string;
}

const COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1',
  teal: '#14B8A6',
};

export function EnhancedChart({ 
  data, 
  type = 'line', 
  height = 200, 
  color = 'primary',
  showGrid = true,
  showAxis = true,
  animate = true,
  className = '',
  currency = 'GHS',
  title
}: EnhancedChartProps) {
  const chartColor = COLORS[color as keyof typeof COLORS] || COLORS.primary;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <div className="space-y-2">
            {title && (
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {currency} {entry.value?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderLineChart = () => (
    <RechartsLineChart data={data}>
      {showGrid && (
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" />
      )}
      {showAxis && (
        <>
          <XAxis
            dataKey="name"
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#6B7280' }}
            className="dark:text-gray-400"
          />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#6B7280' }}
            tickFormatter={(value) => `${currency} ${value.toLocaleString()}`}
            className="dark:text-gray-400"
          />
        </>
      )}
      <Tooltip content={<CustomTooltip />} />
      <Line
        type="monotone"
        dataKey="value"
        stroke={chartColor}
        strokeWidth={3}
        dot={{ fill: chartColor, strokeWidth: 2, r: 4 }}
        activeDot={{ r: 6, stroke: chartColor, strokeWidth: 2 }}
        animationDuration={animate ? 1000 : 0}
      />
    </RechartsLineChart>
  );

  const renderAreaChart = () => (
    <AreaChart data={data}>
      {showGrid && (
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      )}
      {showAxis && (
        <>
          <XAxis
            dataKey="name"
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#6B7280' }}
          />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#6B7280' }}
            tickFormatter={(value) => `${currency} ${value.toLocaleString()}`}
          />
        </>
      )}
      <Tooltip content={<CustomTooltip />} />
      <Area
        type="monotone"
        dataKey="value"
        stroke={chartColor}
        fill={`${chartColor}20`}
        strokeWidth={2}
        animationDuration={animate ? 1000 : 0}
      />
    </AreaChart>
  );

  const renderBarChart = () => (
    <BarChart data={data}>
      {showGrid && (
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      )}
      {showAxis && (
        <>
          <XAxis
            dataKey="name"
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#6B7280' }}
          />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#6B7280' }}
            tickFormatter={(value) => `${currency} ${value.toLocaleString()}`}
          />
        </>
      )}
      <Tooltip content={<CustomTooltip />} />
      <Bar
        dataKey="value"
        fill={chartColor}
        radius={[4, 4, 0, 0]}
        animationDuration={animate ? 1000 : 0}
      />
    </BarChart>
  );

  const renderPieChart = () => (
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={5}
        dataKey="value"
        animationDuration={animate ? 1000 : 0}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
    </PieChart>
  );

  const renderChart = () => {
    switch (type) {
      case 'area':
        return renderAreaChart();
      case 'bar':
        return renderBarChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderLineChart();
    }
  };

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
} 