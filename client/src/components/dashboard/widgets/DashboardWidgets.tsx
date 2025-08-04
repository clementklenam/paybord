import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, AlertTriangle, Shield, CheckCircle, LineChart as LineChartIcon } from "lucide-react";

// Helper to safely render any value
function safeRender(val: any) {
  if (val == null) return '';
  if (typeof val === 'object') {
    // Don't stringify React elements
    if (val.$$typeof) return null;
    return JSON.stringify(val);
  }
  return val;
}

interface NetVolumeWidgetProps {
  data: {
    amount: number;
    trend: Array<{ name: string; value: number }>;
    lastUpdated: string;
  };
}

interface NewCustomersWidgetProps {
  data: {
    count: number;
    previousPeriod: number;
    trend: Array<{ name: string; value: number }>;
    lastUpdated: string;
  };
}

const WidgetCard = ({
  title,
  value,
  trend,
  icon: Icon,
  className
}: {
  title: string;
  value: string | number;
  trend?: { value: number; label: string };
  icon: React.ElementType;
  className?: string;
}) => (
  <Card className={`bg-gradient-to-br from-gray-50/50 to-gray-100/30 hover:from-gray-100/50 hover:to-gray-200/40 transition-all border-gray-200 hover:border-gray-300 ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-[#232323]">{title}</CardTitle>
      <Icon className="h-4 w-4 text-[#232323]" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-[#232323]">{safeRender(value)}</div>
      {trend && (
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs font-bold px-2 py-1 rounded-full shadow ${trend.value >= 0 ? 'text-green-700 bg-green-200' : 'text-red-700 bg-red-200'}`}>{trend.value >= 0 ? '+' : ''}{safeRender(trend.value)}% {safeRender(trend.label)}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

export const DisputeActivityWidget = ({ data, className }: { data: { total: number; trend?: { value: number; label: string } }; className?: string }) => (
  <WidgetCard
    title="Dispute Activity"
    value={data.total || 0}
    trend={data.trend}
    icon={AlertTriangle}
    className={className}
  />
);

export const DisputeCountWidget = ({ data, className }: { data: { count: number; trend?: { value: number; label: string } }; className?: string }) => (
  <WidgetCard
    title="Dispute Count"
    value={data.count || 0}
    trend={data.trend}
    icon={AlertTriangle}
    className={className}
  />
);

export const DisputedPaymentsWidget = ({ data, className }: { data: { amount: number; trend?: { value: number; label: string } }; className?: string }) => (
  <WidgetCard
    title="Disputed Payments"
    value={data.amount ? `$${data.amount.toLocaleString()}` : '$0'}
    trend={data.trend}
    icon={AlertTriangle}
    className={className}
  />
);

export const NetVolumeSalesWidget = ({ data, className }: NetVolumeWidgetProps & { className?: string }) => (
  <WidgetCard
    title="Net Volume Sales"
    value={data.amount ? `$${data.amount.toLocaleString()}` : '$0'}
    trend={undefined}
    icon={DollarSign}
    className={className}
  />
);

export const CustomersWidget = ({ data, className }: { data: { total: number; trend?: { value: number; label: string } }; className?: string }) => (
  <WidgetCard
    title="Customers"
    value={data.total || 0}
    trend={data.trend}
    icon={Users}
    className={className}
  />
);

export const NewCustomersWidget = ({ data, className }: NewCustomersWidgetProps & { className?: string }) => (
  <WidgetCard
    title="New Customers"
    value={data.count || 0}
    trend={undefined}
    icon={Users}
    className={className}
  />
);

export const SpendPerCustomerWidget = ({ data, className }: { data: { amount: number; trend?: { value: number; label: string } }; className?: string }) => (
  <WidgetCard
    title="Spend per Customer"
    value={data.amount ? `$${data.amount.toLocaleString()}` : '$0'}
    trend={data.trend}
    icon={LineChartIcon}
    className={className}
  />
);

interface TopCustomersWidgetData {
  customers: Array<{ id: string; name: string; email: string; spend: number }>;
}
export const TopCustomersWidget = ({ data, className }: { data: TopCustomersWidgetData; className?: string }) => (
  <Card className={`bg-gradient-to-br from-gray-50/50 to-gray-100/30 hover:from-gray-100/50 hover:to-gray-200/40 transition-all border-gray-200 hover:border-gray-300 ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-[#232323]">Top Customers</CardTitle>
      <TrendingUp className="h-4 w-4 text-[#232323]" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {data.customers.map((customer) => (
          <div key={customer.id} className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-[#232323]">{safeRender(customer.name)}</p>
              <p className="text-sm text-[#232323]">{safeRender(customer.email)}</p>
            </div>
            <div className="text-sm font-medium text-[#232323]">${safeRender(customer.spend?.toLocaleString() || '0')}</div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const HighRiskPaymentsWidget = ({ data, className }: { data: { count: number; trend?: { value: number; label: string } }; className?: string }) => (
  <WidgetCard
    title="High Risk Payments"
    value={data.count || 0}
    trend={data.trend}
    icon={Shield}
    className={className}
  />
);

export const SuccessfulPaymentsWidget = ({ data, className }: { data: { count: number; trend?: { value: number; label: string } }; className?: string }) => (
  <WidgetCard
    title="Successful Payments"
    value={data.count || 0}
    trend={data.trend}
    icon={CheckCircle}
    className={className}
  />
);