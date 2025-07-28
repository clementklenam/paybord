import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Users} from "lucide-react";

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

export const NewCustomersWidget = ({ data, className }) => (
  <Card className={`border-white text-[#232323] ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-semibold text-[#232323]">
        New Customers
      </CardTitle>
      <Users className="h-4 w-4 text-[#232323]" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-extrabold text-[#232323] drop-shadow-lg">{data.count || 0}</div>
        </div>
      </div>
    </CardContent>
  </Card>
);
