import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  DollarSign, 
  RefreshCw
} from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

interface SubscriptionAnalytics {
  totalSubscriptionRevenue: number;
  totalSubscriptions: number;
  uniqueSubscriptionCustomers: number;
  averageSubscriptionValue: number;
  paymentMethodBreakdown: Record<string, number>;
  currencyBreakdown: Record<string, number>;
  dailyBreakdown: Record<string, { revenue: number; count: number }>;
  recentTransactions: Array<{
    id: string;
    amount: number;
    currency: string;
    customerName: string;
    customerEmail: string;
    paymentMethod: string;
    createdAt: string;
    metadata: any;
  }>;
}

interface SubscriptionAnalyticsCardProps {
  timeRange?: string;
}

export default function SubscriptionAnalyticsCard({ timeRange = 'last7days' }: SubscriptionAnalyticsCardProps) {
  const [analytics, setAnalytics] = useState<SubscriptionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/analytics/subscription-analytics?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscription analytics');
      }

      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching subscription analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading Subscription Analytics...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Subscription Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchAnalytics} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Subscription Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">No subscription data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'mobile_money':
        return <Users className="h-4 w-4" />;
      case 'bank_transfer':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card':
        return 'Card';
      case 'mobile_money':
        return 'Mobile Money';
      case 'bank_transfer':
        return 'Bank Transfer';
      default:
        return method.charAt(0).toUpperCase() + method.slice(1);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Subscription Analytics
          </div>
          <Button onClick={fetchAnalytics} variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(analytics.totalSubscriptionRevenue, 'GHS')}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Subscriptions</p>
                <p className="text-2xl font-bold text-green-900">
                  {analytics.totalSubscriptions}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Unique Customers</p>
                <p className="text-2xl font-bold text-purple-900">
                  {analytics.uniqueSubscriptionCustomers}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Payment Method Breakdown */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Payment Methods</h3>
          <div className="space-y-2">
            {Object.entries(analytics.paymentMethodBreakdown).map(([method, count]) => (
              <div key={method} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {getPaymentMethodIcon(method)}
                  <span className="font-medium">{getPaymentMethodLabel(method)}</span>
                </div>
                <Badge variant="secondary">{count} payments</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Recent Subscription Payments</h3>
          <div className="space-y-2">
            {analytics.recentTransactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    {getPaymentMethodIcon(transaction.paymentMethod)}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.customerName || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {getPaymentMethodLabel(transaction.paymentMethod)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Currency Breakdown */}
        {Object.keys(analytics.currencyBreakdown).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Revenue by Currency</h3>
            <div className="space-y-2">
              {Object.entries(analytics.currencyBreakdown).map(([currency, amount]) => (
                <div key={currency} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{currency}</span>
                  <span className="font-semibold">{formatCurrency(amount, currency)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 