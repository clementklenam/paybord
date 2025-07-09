import { Card } from "@/components/ui/card";
import { LineChart } from "@/components/ui/line-chart";

interface NewCustomersData {
  count: number;
  previousPeriod: number;
  trend: Array<{
    name: string;
    value: number;
  }>;
  lastUpdated: string;
}

interface NewCustomersWidgetProps {
  data: NewCustomersData;
}

export function NewCustomersWidget({ data }: NewCustomersWidgetProps) {
  const growthPercentage = data.previousPeriod > 0
    ? ((data.count - data.previousPeriod) / data.previousPeriod) * 100
    : 0;

  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">New customers</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold">{data.count}</p>
              {growthPercentage !== 0 && (
                <p className={`text-sm ${growthPercentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {growthPercentage > 0 ? '+' : ''}{growthPercentage.toFixed(1)}%
                </p>
              )}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Updated {data.lastUpdated}
          </div>
        </div>
        <div className="h-[80px]">
          <LineChart data={data.trend} />
        </div>
      </div>
    </Card>
  );
}
