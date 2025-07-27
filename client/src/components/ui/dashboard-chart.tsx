import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
}

interface DashboardChartProps {
  data: DataPoint[];
  color?: string;
  currency?: string;
  title?: string;
}

export function DashboardChart({ 
  data, 
  color = '#10B981', 
  currency = 'GHS',
  title 
}: DashboardChartProps) {
  // Ensure we have valid data
  const chartData = data && data.length > 0 ? data : [
    { name: 'No Data', value: 0 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2">
          <div className="space-y-1">
            {title && (
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{title}</p>
            )}
            <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {currency} {payload[0].value?.toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="name" 
          hide={true}
        />
        <YAxis 
          hide={true}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          fill={`url(#gradient-${color})`}
          strokeWidth={2}
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
} 