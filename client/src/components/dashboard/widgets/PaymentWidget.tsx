import {Card, CardContent, CardHeader, CardTitle} from "../../ui/card";
import {CreditCard} from "lucide-react";
import {formatCurrency} from "@/lib/utils/date";

interface PaymentWidgetProps {
  data: {
    totalPayments: number;
    successRate: number;
    averageAmount: number;
  };
}

function PaymentWidget({ data }: PaymentWidgetProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          Payments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold">{data.totalPayments}</p>
            <p className="text-sm text-muted-foreground">Total Payments</p>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">{data.successRate}%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
            <div>
              <p className="text-sm font-medium">{formatCurrency(data.averageAmount)}</p>
              <p className="text-sm text-muted-foreground">Average Amount</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PaymentWidget;
