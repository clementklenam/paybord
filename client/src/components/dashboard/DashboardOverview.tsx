import {useState, useEffect, useCallback} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Plus, TrendingUp, TrendingDown, DollarSign, Users} from "lucide-react";
import {Card} from "@/components/ui/card";
import {useToast} from "@/components/ui/use-toast";
import {usePaymentContext} from "@/contexts/PaymentContext";
import {
  AddWidgetDialog,
  PaymentOverviewWidget,
  GrossVolumeWidget,
  NetVolumeWidget,
  FailedPaymentsWidget,
  NewCustomersWidget,
  TopCustomersWidget,
} from "./widgets";
import {getPaymentAnalytics, PaymentAnalytics} from "@/services/analytics.service";

// Helper to guarantee a number
function safeNumber(val: unknown): number {
  return typeof val === 'number' ? val : 0;
}

function DashboardOverview() {
  const [timeRange, setTimeRange] = useState("last7days");
  const [isAddingWidget, setIsAddingWidget] = useState(false);
  const [customWidgets, setCustomWidgets] = useState<Array<{ id: string; type: string }>>([]);
  const [analytics, setAnalytics] = useState<PaymentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { subscribeToPaymentEvents, notifyPaymentSuccess } = usePaymentContext();

  // Fetch real payment analytics - memoized with useCallback
  const fetchAnalytics = useCallback(async () => {
    try {
      console.log('[DashboardOverview] fetchAnalytics called with timeRange:', timeRange);
      setLoading(true);
      const response = await getPaymentAnalytics(timeRange);
      console.log('[DashboardOverview] Analytics response:', response);
      if (response.success) {
        console.log('[DashboardOverview] Setting analytics data:', response.data);
        setAnalytics(response.data);
      } else {
        console.error('[DashboardOverview] Analytics response not successful:', response);
      }
    } catch (error) {
      console.error('[DashboardOverview] Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load payment analytics. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [timeRange, toast]);

  useEffect(() => {
    console.log('[DashboardOverview] Time range changed to:', timeRange);
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Subscribe to payment events to refresh dashboard
  useEffect(() => {
    const unsubscribe = subscribeToPaymentEvents(() => {
      console.log('[DashboardOverview] Payment event received, refreshing analytics...');
      fetchAnalytics();
    });

    // Also check for payment events periodically (every 2 seconds)
    const interval = setInterval(() => {
      try {
        const eventData = localStorage.getItem('paymesa_payment_event');
        if (eventData) {
          const event = JSON.parse(eventData);
          const now = Date.now();
          // Only process events that are less than 10 seconds old
          if (now - event.timestamp < 10000) {
            console.log('[DashboardOverview] Found recent payment event during periodic check, refreshing analytics...');
            fetchAnalytics();
            localStorage.removeItem('paymesa_payment_event');
          }
        }
      } catch (error) {
        console.error('[DashboardOverview] Error in periodic payment check:', error);
      }
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [subscribeToPaymentEvents, fetchAnalytics]);

  const handleAddWidget = (widgetType: string) => {
    const newWidget = {
      id: `${widgetType}-${Date.now()}`,
      type: widgetType,
    };
    setCustomWidgets([...customWidgets, newWidget]);
    setIsAddingWidget(false);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  // Test function to simulate a payment
  const testPaymentNotification = () => {
    console.log('[DashboardOverview] Testing payment notification...');
    console.log('[DashboardOverview] Current analytics before refresh:', analytics);
    console.log('[DashboardOverview] Current timeRange:', timeRange);
    
    // Force a manual refresh first
    fetchAnalytics();
    
    // Then trigger the payment notification
    notifyPaymentSuccess();
    
    toast({
      title: "Test Payment",
      description: "Payment notification sent. Check console for debug info.",
      variant: "default"
    });
  };

  const handleTimeRangeChange = (newTimeRange: string) => {
    console.log('[DashboardOverview] Time range changing from', timeRange, 'to', newTimeRange);
    setTimeRange(newTimeRange);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section 1: Today */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4 text-gray-900">Today</h2>
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-yellow-500/10 hover:from-green-500/20 hover:to-yellow-500/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Gross Volume</h3>
                <div className="mt-2">
                  <p className="text-2xl font-semibold text-gray-900">
                    {analytics ? formatCurrency(safeNumber(analytics.grossVolume.amount)) : '$0.00'}
                  </p>
                  {analytics && (analytics.grossVolume.growth ?? 0) !== 0 && (
                    <div className="flex items-center mt-1">
                      {(analytics.grossVolume.growth ?? 0) > 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1 text-red-600" />
                      )}
                      <span className={`text-xs ${(analytics.grossVolume.growth ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(analytics.grossVolume.growth ?? 0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className={`p-3 rounded-full ${(analytics?.grossVolume.growth ?? 0) > 0 ? 'bg-green-100' : (analytics?.grossVolume.growth ?? 0) < 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                <DollarSign className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Net Revenue</h3>
                <div className="mt-2">
                  <p className="text-2xl font-semibold text-gray-900">
                    {analytics ? formatCurrency(safeNumber(analytics.netVolume.amount)) : '$0.00'}
                  </p>
                  {analytics && (analytics.netVolume.growth ?? 0) !== 0 && (
                    <div className="flex items-center mt-1">
                      {(analytics.netVolume.growth ?? 0) > 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1 text-red-600" />
                      )}
                      <span className={`text-xs ${(analytics.netVolume.growth ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(analytics.netVolume.growth ?? 0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className={`p-3 rounded-full ${(analytics?.netVolume.growth ?? 0) > 0 ? 'bg-green-100' : (analytics?.netVolume.growth ?? 0) < 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                <TrendingUp className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">New Customers</h3>
                <div className="mt-2">
                  <p className="text-2xl font-semibold text-gray-900">
                    {analytics ? analytics.newCustomers.count : 0}
                  </p>
                  {analytics && (analytics.newCustomers.growth ?? 0) !== 0 && (
                    <div className="flex items-center mt-1">
                      {(analytics.newCustomers.growth ?? 0) > 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1 text-red-600" />
                      )}
                      <span className={`text-xs ${(analytics.newCustomers.growth ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(analytics.newCustomers.growth ?? 0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className={`p-3 rounded-full ${(analytics?.newCustomers.growth ?? 0) > 0 ? 'bg-green-100' : (analytics?.newCustomers.growth ?? 0) < 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                <Users className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Section 2: Your overview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Your Overview</h2>
            <div className="flex items-center gap-2 mt-2">
              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger className="w-[140px] h-8 text-sm border-gray-300 focus:border-[#1e8449] focus:ring-[#1e8449]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 days</SelectItem>
                  <SelectItem value="last30days">Last 30 days</SelectItem>
                  <SelectItem value="thisMonth">This month</SelectItem>
                  <SelectItem value="lastMonth">Last month</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">compared to Previous period</span>
            </div>
          </div>
          <Button 
            onClick={testPaymentNotification}
            variant="outline" 
            size="sm"
            className="text-xs"
          >
            Test Payment Notification
          </Button>
        </div>
        
        {analytics && (
          <div className="grid grid-cols-3 gap-4">
            <GrossVolumeWidget data={{
              today: safeNumber(analytics.grossVolume.amount),
              yesterday: safeNumber(analytics.grossVolume.previousAmount),
              lastUpdated: new Date(analytics.lastUpdated).toLocaleTimeString(),
              chart: analytics.grossVolume.chart
            }} />
            
            <PaymentOverviewWidget data={{
              total: analytics.totalTransactions,
              trend: analytics.grossVolume.chart,
              growth: safeNumber(analytics.grossVolume.growth)
            }} />
            
            <NetVolumeWidget data={{
              amount: safeNumber(analytics.netVolume.amount),
              trend: analytics.netVolume.chart,
              lastUpdated: new Date(analytics.lastUpdated).toLocaleTimeString()
            }} />
            
            <NewCustomersWidget data={{
              count: safeNumber(analytics.newCustomers.count),
              previousPeriod: safeNumber(analytics.newCustomers.previousCount),
              trend: analytics.newCustomers.chart,
              lastUpdated: new Date(analytics.lastUpdated).toLocaleTimeString()
            }} />
            
            <FailedPaymentsWidget />
            
            <TopCustomersWidget
              customers={analytics.topCustomers}
              currency={'GHS'}
            />
          </div>
        )}
      </section>

      {/* Section 3: Additional Metrics */}
      {analytics && (
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4 text-gray-900">Additional Metrics</h2>
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Total Transactions</h3>
              <p className="text-2xl font-semibold text-gray-900 mt-2">{analytics.totalTransactions}</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Average Order Value</h3>
              <p className="text-2xl font-semibold text-gray-900 mt-2">{formatCurrency(analytics.averageOrderValue)}</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Failed Payments</h3>
              <p className="text-2xl font-semibold text-gray-900 mt-2">{analytics.failedPayments.count}</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Success Rate</h3>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {analytics.totalTransactions + analytics.failedPayments.count > 0 
                  ? `${((analytics.totalTransactions / (analytics.totalTransactions + analytics.failedPayments.count)) * 100).toFixed(1)}%`
                  : '0%'
                }
              </p>
            </Card>
          </div>
        </section>
      )}

      {/* Section 4: Custom Widgets */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Custom Widgets</h2>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-[#1e8449] text-[#1e8449] hover:bg-[#1e8449]/5"
            onClick={() => setIsAddingWidget(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add widget
          </Button>
        </div>
        <AddWidgetDialog
          open={isAddingWidget}
          onClose={() => setIsAddingWidget(false)}
          onAddWidget={handleAddWidget}
          existingWidgets={customWidgets}
        />
      </section>
    </div>
  );
}

export default DashboardOverview;
