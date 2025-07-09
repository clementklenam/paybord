import { Card } from "@/components/ui/card";
import { LineChart } from "@/components/ui/line-chart";

interface GrossVolumeData {
  today: number;
  yesterday: number;
  lastUpdated: string;
  chart: Array<{
    name: string;
    value: number;
  }>;
}

interface GrossVolumeWidgetProps {
  data: GrossVolumeData;
}

export function GrossVolumeWidget({ data }: GrossVolumeWidgetProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Gross volume</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold">${data.today.toLocaleString()}</p>
              {data.yesterday > 0 && (
                <p className="text-sm text-muted-foreground">
                  Yesterday ${data.yesterday.toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Updated {data.lastUpdated}
          </div>
        </div>
        <div className="h-[80px]">
          <LineChart data={data.chart} />
        </div>
      </div>
    </Card>
  );
}
