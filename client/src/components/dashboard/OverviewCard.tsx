import {DashboardChart} from "@/components/ui/dashboard-chart";
import {TrendingUp, TrendingDown} from "lucide-react";

interface OverviewCardProps {
  title: string;
  value: string;
  previousValue: string;
  data: Array<{ name: string; value: number }>;
  lastUpdated: string;
}

export function OverviewCard({ title, value, previousValue, data, lastUpdated }: OverviewCardProps) {
  // Calculate percentage change
  const currentValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
  const prevValue = parseFloat(previousValue.replace(/[^0-9.-]+/g, ""));
  
  const percentChange = prevValue === 0 
    ? (currentValue > 0 ? 100 : 0) 
    : ((currentValue - prevValue) / prevValue) * 100;
  
  const isPositive = percentChange >= 0;

  // Ensure we have valid data for the chart
  let chartData = data && data.length > 0 ? data : [
    { name: 'No Data', value: 0 }
  ];
  // Pad the data if only one point exists
  if (chartData.length === 1) {
    chartData = [
      { name: 'Start', value: 0 },
      ...chartData
    ];
  }
  console.log('[DEBUG] OverviewCard chartData:', chartData, 'title:', title);

  // Set chart color based on trend
  const chartColor = isPositive ? '#10B981' : '#EF4444';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white mb-1">{title}</p>
          <div className="flex items-baseline space-x-3">
            <p className="text-2xl font-semibold text-white">{value}</p>
            <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
              isPositive 
                ? 'text-green-400 bg-green-900/20' 
                : 'text-red-400 bg-red-900/20'
            }`}>
              {isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {isPositive ? '+' : ''}{percentChange.toFixed(1)}%
            </div>
          </div>
          <p className="text-xs text-white mt-1">Previous: {previousValue}</p>
        </div>
      </div>
      
      <div className="h-[140px] bg-white rounded-lg p-3 border border-white">
        <DashboardChart 
          data={chartData} 
          color={chartColor}
          currency="GHS"
          title={title}
        />
      </div>
      
      <p className="text-xs text-white">Last updated: {lastUpdated}</p>
    </div>
  );
}
