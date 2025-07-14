import {Card} from "@/components/ui/card";
import {LineChart} from "@/components/ui/line-chart";

interface PaymentOverviewData {
  total: number;
  trend: Array<{
    name: string;
    value: number;
  }>;
  growth: number;
}

interface PaymentOverviewWidgetProps {
  data: PaymentOverviewData;
}

export function PaymentOverviewWidget({ data }: PaymentOverviewWidgetProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Payments</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold">${data.total.toLocaleString()}</p>
              {data.growth !== 0 && (
                <p className={`text-sm ${data.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {data.growth > 0 ? '+' : ''}{data.growth.toFixed(1)}%
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="h-[80px]">
          <LineChart data={data.trend} />
        </div>
      </div>
    </Card>
  );
}
