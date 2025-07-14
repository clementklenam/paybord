import {useState, useEffect} from "react";
import {DashboardLayout} from "@/components/dashboard/DashboardLayout";
import {Button} from "@/components/ui/button";
import {Plus, RefreshCw, Users, DollarSign, CreditCard, Calendar, ArrowUpRight} from "lucide-react";
import analyticsService from "@/services/analytics.service";
import {useToast} from "@/components/ui/use-toast";
import {useCurrency} from "@/contexts/CurrencyContext";
import {usePaymentContext} from "@/contexts/PaymentContext";
import {BusinessRegistrationCheck} from "@/components/business/BusinessRegistrationCheck";

// Import dashboard components
import {TimeRangeSelector} from "@/components/dashboard/TimeRangeSelector";
import {OverviewCard} from "@/components/dashboard/OverviewCard";
import {TopCustomersCard} from "@/components/dashboard/TopCustomersCard";
import {AddWidgetDialog} from "@/components/dashboard/AddWidgetDialog";
import {ShopifyStatsCard} from "@/components/dashboard/ShopifyStatsCard";
import {ShopifyHeader} from "@/components/dashboard/ShopifyHeader";
import {PaymentSourcesWidget} from "@/components/dashboard/widgets/PaymentSourcesWidget";

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("last7days");
  const [isAddingWidget, setIsAddingWidget] = useState(false);
  const [customWidgets, setCustomWidgets] = useState<Array<{ id: string; type: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<unknown>(null);
  const { toast } = useToast();
  const { currency } = useCurrency();
  const { subscribeToPaymentEvents } = usePaymentContext();

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Force clear any cached data
      if ('caches' in window) {
        try {
          await caches.delete('analytics-cache');
        } catch (e) {
          console.log('Cache clearing not supported');
        }
      }
      
      const data = await analyticsService.getDashboardOverview(timeRange);
      console.log('Dashboard data received:', data);
      console.log('Top customers data:', data?.overview?.topCustomers);
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error loading dashboard data",
        description: "There was a problem loading your dashboard data. Please try again later.",
        variant: "destructive"
      });
      // Fall back to empty data structure if API call fails
      setDashboardData({
        today: {
          grossVolume: { amount: 0, lastUpdated: "", trend: 0, currency: "GHS" },
          balance: { amount: 0, type: "GHS", trend: 0 },
          nextPayout: { amount: 0, date: "", currency: "GHS" }
        },
        overview: {
          grossVolume: { total: 0, previousPeriod: 0, trend: [], lastUpdated: "" },
          netVolume: { total: 0, previousPeriod: 0, trend: [], lastUpdated: "" },
          newCustomers: { total: 0, previousPeriod: 0, trend: [], lastUpdated: "" },
          failedPayments: { total: 0, previousPeriod: 0, trend: [], lastUpdated: "" },
          topCustomers: []
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch dashboard data when component mounts or timeRange changes
  useEffect(() => {
    fetchDashboardData();
  }, [timeRange, toast]);

  // Auto-refresh for "today" time range to ensure real-time updates
  useEffect(() => {
    if (timeRange === 'today') {
      // Refresh every 30 seconds for "today" time range
      const autoRefreshInterval = setInterval(() => {
        console.log('[DashboardPage] Auto-refreshing dashboard for today time range...');
        fetchDashboardData();
      }, 30000); // 30 seconds

      return () => clearInterval(autoRefreshInterval);
    }
  }, [timeRange, fetchDashboardData]);

  // Subscribe to payment events for real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToPaymentEvents(() => {
      console.log('[DashboardPage] Payment event received, refreshing dashboard...');
      fetchDashboardData();
    });

    // Check for payment events periodically
    // For "today" time range, check more frequently (every 1 second)
    // For other time ranges, check every 2 seconds
    const intervalTime = timeRange === 'today' ? 1000 : 2000;
    
    const interval = setInterval(() => {
      try {
        const eventData = localStorage.getItem('paymesa_payment_event');
        if (eventData) {
          const event = JSON.parse(eventData);
          const now = Date.now();
          // Only process events that are less than 10 seconds old
          if (now - event.timestamp < 10000) {
            console.log('[DashboardPage] Found recent payment event during periodic check, refreshing dashboard...');
            fetchDashboardData();
            localStorage.removeItem('paymesa_payment_event');
          }
        }
      } catch (error) {
        console.error('[DashboardPage] Error in periodic payment check:', error);
      }
    }, intervalTime);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [subscribeToPaymentEvents, fetchDashboardData, timeRange]);
  
  const handleAddWidget = (widgetType: string) => {
    const newWidget = {
      id: `${widgetType}-${Date.now()}`,
      type: widgetType,
    };
    setCustomWidgets([...customWidgets, newWidget]);
  };
  
  return (
    <DashboardLayout>
      <BusinessRegistrationCheck>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Shopify-style Header */}
          <ShopifyHeader 
            title="Dashboard"
            subtitle="Track your business performance"
            actions={
              <div className="flex items-center gap-3">
                <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
                <Button 
                  onClick={() => setIsAddingWidget(true)} 
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add widget
                </Button>
                <Button 
                  onClick={fetchDashboardData}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> 
                  {isLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            }
          />
          
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600"></div>
                <span className="text-gray-600 dark:text-gray-400">Loading dashboard data...</span>
              </div>
            </div>
          )}
          
          {!isLoading && dashboardData && (
            <div className="space-y-6">
              {/* Key Metrics - Shopify Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ShopifyStatsCard
                  title="Total sales"
                  value={`${dashboardData.today.grossVolume.currency || 'GHS'} ${dashboardData.today.grossVolume.amount.toFixed(2)}`}
                  change={dashboardData.today.grossVolume.trend || 0}
                  changeLabel="vs last period"
                  icon={<DollarSign className="h-5 w-5" />}
                  trend="up"
                />
                
                <ShopifyStatsCard
                  title="Available balance"
                  value={`${dashboardData.today.balance.type || 'GHS'} ${dashboardData.today.balance.amount.toFixed(2)}`}
                  change={dashboardData.today.balance.trend || 0}
                  changeLabel="vs last period"
                  icon={<CreditCard className="h-5 w-5" />}
                  trend="up"
                />
                
                <ShopifyStatsCard
                  title="Next payout"
                  value={`${dashboardData.today.nextPayout?.currency || 'GHS'} ${dashboardData.today.nextPayout?.amount.toFixed(2) || '0.00'}`}
                  change={0}
                  changeLabel={`Estimated for ${dashboardData.today.nextPayout?.date || 'N/A'}`}
                  icon={<Calendar className="h-5 w-5" />}
                  trend="neutral"
                />
                
                <ShopifyStatsCard
                  title="New customers"
                  value={dashboardData.overview.newCustomers.total.toString()}
                  change={0}
                  changeLabel="this period"
                  icon={<Users className="h-5 w-5" />}
                  trend="up"
                />
              </div>

              {/* Charts Section - Shopify Style */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Revenue overview</h3>
                      <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                        View report
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                    <OverviewCard
                      title="Gross Volume"
                      value={`${dashboardData.overview.grossVolume.currency || 'GHS'} ${dashboardData.overview.grossVolume.total.toFixed(2)}`}
                      previousValue={`${dashboardData.overview.grossVolume.currency || 'GHS'} ${dashboardData.overview.grossVolume.previousPeriod.toFixed(2)}`}
                      data={dashboardData.overview.grossVolume.trend}
                      lastUpdated={dashboardData.overview.grossVolume.lastUpdated}
                    />
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Net revenue</h3>
                      <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                        View report
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                    <OverviewCard
                      title="Net Volume"
                      value={`${dashboardData.overview.netVolume.currency || 'GHS'} ${dashboardData.overview.netVolume.total.toFixed(2)}`}
                      previousValue={`${dashboardData.overview.netVolume.currency || 'GHS'} ${dashboardData.overview.netVolume.previousPeriod.toFixed(2)}`}
                      data={dashboardData.overview.netVolume.trend}
                      lastUpdated={dashboardData.overview.netVolume.lastUpdated}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Section - Shopify Style */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Customer growth</h3>
                      <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                        View all customers
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                    <OverviewCard
                      title="New Customers"
                      value={dashboardData.overview.newCustomers.total.toString()}
                      previousValue={dashboardData.overview.newCustomers.previousPeriod.toString()}
                      data={dashboardData.overview.newCustomers.trend}
                      lastUpdated={dashboardData.overview.newCustomers.lastUpdated}
                    />
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top customers</h3>
                      <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                        View all
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                    <TopCustomersCard
                      customers={dashboardData.overview.topCustomers}
                      currency={currency}
                    />
                  </div>
                </div>
              </div>

              {/* Failed Payments Section - Shopify Style */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Payment issues</h3>
                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                      View all issues
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                  <OverviewCard
                    title="Failed Payments"
                    value={dashboardData.overview.failedPayments?.total.toString() || '0'}
                    previousValue={dashboardData.overview.failedPayments?.previousPeriod.toString() || '0'}
                    data={dashboardData.overview.failedPayments?.trend || []}
                    lastUpdated={dashboardData.overview.failedPayments?.lastUpdated || ''}
                  />
                </div>
              </div>

              {/* Payment Sources Section - Shopify Style */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Payment Sources</h3>
                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                      View all transactions
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                  <PaymentSourcesWidget />
                </div>
              </div>
            </div>
          )}

          {!isLoading && dashboardData && customWidgets.map((widget) => (
            <div key={widget.id} className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="p-6">
                {widget.type === "grossVolume" && (
                  <OverviewCard
                    title="Gross Volume"
                    value={`${dashboardData.overview.grossVolume.currency || 'GHS'} ${dashboardData.overview.grossVolume.total.toFixed(2)}`}
                    previousValue={`${dashboardData.overview.grossVolume.currency || 'GHS'} ${dashboardData.overview.grossVolume.previousPeriod.toFixed(2)}`}
                    data={dashboardData.overview.grossVolume.trend}
                    lastUpdated={dashboardData.overview.grossVolume.lastUpdated}
                  />
                )}
                {widget.type === "netVolume" && (
                  <OverviewCard
                    title="Net Volume"
                    value={`${dashboardData.overview.netVolume.currency || 'GHS'} ${dashboardData.overview.netVolume.total.toFixed(2)}`}
                    previousValue={`${dashboardData.overview.netVolume.currency || 'GHS'} ${dashboardData.overview.netVolume.previousPeriod.toFixed(2)}`}
                    data={dashboardData.overview.netVolume.trend}
                    lastUpdated={dashboardData.overview.netVolume.lastUpdated}
                  />
                )}
                {widget.type === "paymentSources" && (
                  <PaymentSourcesWidget />
                )}
              </div>
            </div>
          ))}

          <AddWidgetDialog 
            open={isAddingWidget} 
            onOpenChange={setIsAddingWidget} 
            onAddWidget={handleAddWidget} 
          />
        </div>
      </BusinessRegistrationCheck>
    </DashboardLayout>
  );
} 