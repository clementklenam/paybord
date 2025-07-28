import {useState, useEffect} from "react";
import {DashboardLayout} from "@/components/dashboard/DashboardLayout";
import {Button} from "@/components/ui/button";
import {Plus, RefreshCw, Users, DollarSign, CreditCard, Calendar, ArrowUpRight} from "lucide-react";
import analyticsService from "@/services/analytics.service";
import {useToast} from "@/components/ui/use-toast";
import {useCurrency} from "@/contexts/CurrencyContext";
import {usePaymentContext} from "@/contexts/PaymentContext";

// Import dashboard components
import {TimeRangeSelector} from "@/components/dashboard/TimeRangeSelector";
import {OverviewCard} from "@/components/dashboard/OverviewCard";
import {TopCustomersCard} from "@/components/dashboard/TopCustomersCard";
import {AddWidgetDialog} from "@/components/dashboard/AddWidgetDialog";
import {ShopifyStatsCard} from "@/components/dashboard/ShopifyStatsCard";
import {ShopifyHeader} from "@/components/dashboard/ShopifyHeader";
import {PaymentSourcesWidget} from "@/components/dashboard/widgets/PaymentSourcesWidget";

// Type definitions for dashboard data
interface DashboardData {
  today: {
    grossVolume: { amount: number; lastUpdated: string; trend: number; currency: string };
    balance: { amount: number; type: string; trend: number };
    nextPayout: { amount: number; date: string; currency: string };
  };
  overview: {
    grossVolume: { total: number; previousPeriod: number; trend: Array<{ name: string; value: number }>; lastUpdated: string; currency: string };
    netVolume: { total: number; previousPeriod: number; trend: Array<{ name: string; value: number }>; lastUpdated: string; currency: string };
    newCustomers: { total: number; previousPeriod: number; trend: Array<{ name: string; value: number }>; lastUpdated: string };
    failedPayments: { total: number; previousPeriod: number; trend: Array<{ name: string; value: number }>; lastUpdated: string };
    topCustomers: Array<{ name: string; spend: number }>;
  };
}

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("last7days");
  const [isAddingWidget, setIsAddingWidget] = useState(false);
  const [customWidgets, setCustomWidgets] = useState<Array<{ id: string; type: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
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
      console.log('Top customers data:', (data as any)?.overview?.topCustomers);
      setDashboardData(data as DashboardData);
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
          grossVolume: { total: 0, previousPeriod: 0, trend: [{ name: "Jan", value: 0 }], lastUpdated: "", currency: "GHS" },
          netVolume: { total: 0, previousPeriod: 0, trend: [{ name: "Jan", value: 0 }], lastUpdated: "", currency: "GHS" },
          newCustomers: { total: 0, previousPeriod: 0, trend: [{ name: "Jan", value: 0 }], lastUpdated: "" },
          failedPayments: { total: 0, previousPeriod: 0, trend: [{ name: "Jan", value: 0 }], lastUpdated: "" },
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
      <div className="min-h-screen bg-white">
          {/* Verification Banner */}
          <div className="bg-gradient-to-r from-[#FFD700] via-[#FFC700] to-[#FFD700] border-b-4 border-[#2d5a5a] shadow-lg">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 text-[#2d5a5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1a1a1a]">Account Verification Required</h3>
                    <p className="text-[#1a1a1a]/80 text-sm">Complete your account verification to unlock all features and start accepting payments</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all duration-200 font-semibold"
                  >
                    Verify Later
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-[#2d5a5a] hover:bg-[#3a6b6b] text-white shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
                  >
                    Verify Now
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Shopify-style Header */}
          <ShopifyHeader 
            title="Dashboard"
            subtitle="Track your business performance"
            actions={
              <div className="flex items-center gap-4">
                <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
                <Button 
                  onClick={() => setIsAddingWidget(true)} 
                  variant="outline"
                  size="sm"
                  className="border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a]/5 transition-all duration-200"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add widget
                </Button>
                <Button 
                  onClick={fetchDashboardData}
                  size="sm"
                  className="bg-[#FFD700] hover:bg-[#FFC700] text-black transition-all duration-200"
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
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#1a1a1a]/20 border-t-[#FFD700]"></div>
                <div className="text-center">
                  <span className="text-[#1a1a1a] font-medium">Loading dashboard data...</span>
                  <p className="text-gray-500 text-sm mt-1">Please wait while we fetch your latest metrics</p>
                </div>
              </div>
            </div>
          )}
          
          {!isLoading && dashboardData && (
            <div className="space-y-8 p-6">
              {/* Key Metrics - Shopify Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ShopifyStatsCard
                  title="Total sales"
                  value={`${dashboardData.today.grossVolume.currency || 'GHS'} ${dashboardData.today.grossVolume.amount.toFixed(2)}`}
                  change={dashboardData.today.grossVolume.trend || 0}
                  changeLabel="vs last period"
                  icon={<DollarSign className="h-5 w-5" />}
                  trend="up"
                  color="yellow"
                />
                
                <ShopifyStatsCard
                  title="Available balance"
                  value={`${dashboardData.today.balance.type || 'GHS'} ${dashboardData.today.balance.amount.toFixed(2)}`}
                  change={dashboardData.today.balance.trend || 0}
                  changeLabel="vs last period"
                  icon={<CreditCard className="h-5 w-5" />}
                  trend="up"
                  color="blue"
                />
                
                <ShopifyStatsCard
                  title="Next payout"
                  value={`${dashboardData.today.nextPayout?.currency || 'GHS'} ${dashboardData.today.nextPayout?.amount.toFixed(2) || '0.00'}`}
                  change={0}
                  changeLabel={`Estimated for ${dashboardData.today.nextPayout?.date || 'N/A'}`}
                  icon={<Calendar className="h-5 w-5" />}
                  trend="neutral"
                  color="green"
                />
                
                <ShopifyStatsCard
                  title="New customers"
                  value={dashboardData.overview.newCustomers.total.toString()}
                  change={0}
                  changeLabel="this period"
                  icon={<Users className="h-5 w-5" />}
                  trend="up"
                  color="purple"
                />
              </div>

              {/* Charts Section - Shopify Style */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Revenue overview</h3>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
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
                
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Net revenue</h3>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Customer growth</h3>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
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
                
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Top customers</h3>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
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
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Payment issues</h3>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
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
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Payment Sources</h3>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    View all transactions
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                <PaymentSourcesWidget />
              </div>
            </div>
          )}

          {!isLoading && dashboardData && customWidgets.map((widget) => (
            <div key={widget.id} className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm">
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
    </DashboardLayout>
  );
} 