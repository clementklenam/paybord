import {Card} from "@/components/ui/card";
import {LineChart} from "@/components/ui/line-chart";

interface NetVolumeData {
  amount: number;
  trend: Array<{
    name: string;
    value: number;
  }>;
  lastUpdated: string;
}

interface NetVolumeWidgetProps {
  data: NetVolumeData;
}

export function NetVolumeWidget({ data }: NetVolumeWidgetProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Net volume from sales</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold">${data.amount.toLocaleString()}</p>
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
