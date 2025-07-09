import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowDown, ArrowUp } from "lucide-react";

interface DisputeCategory {
  name: string;
  count: number;
  color: string;
}

interface DisputeCountData {
  totalActive: number;
  trend: {
    percentage: number;
    label: string;
  };
  categories: DisputeCategory[];
  lastUpdated: string;
}

const mockData: DisputeCountData = {
  totalActive: 42,
  trend: {
    percentage: -5,
    label: "vs last month"
  },
  categories: [
    { name: "Fraud", count: 15, color: "text-[#1e8449]" },
    { name: "Product Issues", count: 18, color: "text-[#f1c40f]" },
    { name: "Service Quality", count: 9, color: "text-gray-800" }
  ],
  lastUpdated: "2025-04-10"
};


  const data = mockData;

  return (
    <Card className="bg-gradient-to-br from-green-500/10 to-yellow-500/10 hover:from-green-500/20 hover:to-yellow-500/20 transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Active Disputes
        </CardTitle>
        <AlertTriangle className="h-4 w-4 text-[#1e8449]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total Active Disputes */}
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold">{data.totalActive}</div>
              <div className="flex items-center gap-1 text-sm">
                {data.trend.percentage >= 0 ? (
                  <ArrowUp className="h-3 w-3 text-[#1e8449]" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-[#f1c40f]" />
                )}
                <span className={data.trend.percentage >= 0 ? "text-[#1e8449]" : "text-[#f1c40f]"}>
                  {Math.abs(data.trend.percentage)}%
                </span>
                <span className="text-muted-foreground">{data.trend.label}</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Last updated: {data.lastUpdated}
            </div>
          </div>

          {/* Categories Breakdown */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Categories</div>
            <div className="space-y-1">
              {data.categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${category.color}`} />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <span className="text-sm font-medium">{category.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 rounded-full bg-background overflow-hidden">
            <div className="flex h-full">
              {data.categories.map((category) => {
                const width = (category.count / data.totalActive) * 100;
                return (
                  <div
                    key={category.name}
                    className={`${category.color} bg-current transition-all`}
                    style={{ width: `${width}%` }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
