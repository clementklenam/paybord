import {Card} from "@/components/ui/card";
import {UserCircle} from "lucide-react";

interface Customer {
  name: string;
  email: string;
  spend: number;
  transactions: number;
}

interface TopCustomersWidgetProps {
  customers?: Customer[];
  currency?: string;
}

export function TopCustomersWidget({ customers = [], currency = 'GHS' }: TopCustomersWidgetProps) {
  console.log('[DEBUG] TopCustomersWidget currency:', currency);
  const getCurrencySymbol = (currency: string) => {
    if (currency === 'USD') return '$';
    if (currency === 'GHS') return '₵';
    return currency;
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-muted-foreground">Top customers</h3>
            </div>
            <div className="mt-4 space-y-3">
              {customers.length === 0 ? (
                <div className="text-center py-4">
                  <UserCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No customer data available</p>
                </div>
              ) : (
                customers.map((customer, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <UserCircle className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{customer.name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">
                        {getCurrencySymbol(currency)}{customer.spend.toFixed(2)} • {customer.transactions} orders
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
