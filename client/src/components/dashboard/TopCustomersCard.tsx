import {Users, Crown} from "lucide-react";
import {useCurrency} from "@/contexts/CurrencyContext";
import {formatCurrency} from "@/lib/utils";

interface Customer {
  name: string;
  spend: number;
}

interface TopCustomersCardProps {
  customers: Customer[];
  currency?: string;
}

export function TopCustomersCard({ customers, currency: propCurrency }: TopCustomersCardProps) {
  const { currency: contextCurrency } = useCurrency();
  const currency = propCurrency || contextCurrency;
  
  console.log('[DEBUG] TopCustomersCard currency:', currency);
  console.log('TopCustomersCard received customers:', customers);
  console.log('Customers length:', customers?.length);
  console.log('Customers type:', typeof customers);
  
  return (
    <div className="space-y-4">
      {!customers || customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[180px] bg-white rounded-lg border border-gray-200">
          <Users className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">No customer data available</p>
                      <p className="text-xs text-gray-500 mt-1">Debug: {JSON.stringify(customers)}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {customers.map((customer, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center">
                    <span className="text-xs font-medium text-black">{customer.name.charAt(0)}</span>
                  </div>
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1">
                      <Crown className="h-3 w-3 text-[#FFD700]" />
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                  <p className="text-xs text-gray-500">#{index + 1} customer</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">{formatCurrency(customer.spend, currency)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
