import {useState, useEffect} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {ExternalLink, Store, Link as LinkIcon} from "lucide-react";
import {useCurrency} from "@/contexts/CurrencyContext";
import {getAuthHeader} from "@/services/auth-header";
import axios from "axios";

// For Vite-based React apps, use import.meta.env instead of process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Transaction {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  paymentType?: string;
  storefrontName?: string;
  paymentLinkTitle?: string;
  description?: string;
}

interface PaymentSourcesWidgetProps {
  className?: string;
}

export function PaymentSourcesWidget({ className }: PaymentSourcesWidgetProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currency } = useCurrency();

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/payments?limit=10`, {
        headers: getAuthHeader(),
      });
      
      if (response.status !== 200) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = response.data as { data: Transaction[] };
      console.log('Payment sources widget - transactions:', data);
      setTransactions(data.data || []);
    } catch (err) {
      console.error('Error fetching transactions for payment sources widget:', err);
      setError('Failed to load payment sources');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatAmount = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'GHS',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSourceIcon = (paymentType?: string) => {
    switch (paymentType) {
      case 'storefront_purchase':
        return <Store className="h-4 w-4 text-blue-600" />;
      case 'payment_link':
        return <LinkIcon className="h-4 w-4 text-green-600" />;
      default:
        return <ExternalLink className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSourceLabel = (paymentType?: string) => {
    switch (paymentType) {
      case 'storefront_purchase':
        return 'Storefront';
      case 'payment_link':
        return 'Payment Link';
      default:
        return 'Other';
    }
  };

  const getSourceName = (transaction: Transaction) => {
    if (transaction.paymentType === 'storefront_purchase' && transaction.storefrontName) {
      return transaction.storefrontName;
    }
    if (transaction.paymentType === 'payment_link' && transaction.paymentLinkTitle) {
      return transaction.paymentLinkTitle;
    }
    return transaction.description || 'Unknown Source';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Payment Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-80 overflow-y-auto pr-2 pb-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-between p-3 animate-pulse ${
                  i === 0 ? 'rounded-t-lg' : ''
                } ${
                  i === 4 ? 'rounded-b-lg' : ''
                } ${
                  i !== 4 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Payment Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={fetchTransactions} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Payment Sources
          </CardTitle>
          <Button onClick={fetchTransactions} variant="ghost" size="sm">
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <ExternalLink className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent transactions found</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto pr-2 pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
            {transactions.map((transaction, index) => (
              <div
                key={transaction._id}
                className={`flex items-center justify-between p-3 transition-colors ${
                  index === 0 ? 'rounded-t-lg' : ''
                } ${
                  index === transactions.length - 1 ? 'rounded-b-lg' : ''
                } ${
                  index !== transactions.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                } hover:bg-gray-50 dark:hover:bg-gray-800/50`}
              >
                <div className="flex items-center gap-3">
                  {getSourceIcon(transaction.paymentType)}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {getSourceName(transaction)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {getSourceLabel(transaction.paymentType)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatDate(transaction.createdAt)}</span>
                      <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">
                    {formatAmount(transaction.amount, transaction.currency)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {transactions.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" className="w-full">
              View All Transactions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 