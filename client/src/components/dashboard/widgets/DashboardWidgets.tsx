import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  LineChart as LineChartIcon,
  Shield,
  TrendingUp,
  Users
} from "lucide-react";


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
      <CardTitle className="text-sm font-medium text-gray-700">
        {title}
      </CardTitle>
      {Icon && <Icon className="h-4 w-4 text-gray-600" />}
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {trend && (
            <span className={`text-xs ${trend.value >= 0 ? 'text-gray-700 bg-gray-100 px-2 py-1 rounded-full' : 'text-red-600 bg-red-100 px-2 py-1 rounded-full'}`}>
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </span>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const DisputeActivityWidget = ({ data, className }: { data: { total: number; trend?: { value: number; label: string } }; className?: string }) => (
  <WidgetCard
    title="Dispute Activity"
    value={data.total || 0}
    trend={data.trend}
    icon={AlertCircle}
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
      <CardTitle className="text-sm font-medium text-gray-700">Top Customers</CardTitle>
      <TrendingUp className="h-4 w-4 text-gray-600" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {data.customers.map((customer) => (
          <div key={customer.id} className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{customer.name}</p>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            </div>
            <div className="text-sm font-medium text-gray-900">${customer.spend.toLocaleString()}</div>
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