import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Calendar, 
  RefreshCw, 
  AlertCircle,
  Wallet,
  Clock,
  Shield,
  Download,
  Settings,
  BarChart3,
  Users,
  CreditCard,
  Banknote,
  Zap
} from "lucide-react";
import balanceService from "@/services/balance.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { usePaymentContext } from "@/contexts/PaymentContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { TransactionHistory } from "@/components/balances/TransactionHistory";
import TransactionService, { Transaction } from "@/services/transaction.service";
import { ShopifyHeader } from "@/components/dashboard/ShopifyHeader";
import { ShopifyStatsCard } from "@/components/dashboard/ShopifyStatsCard";

// Local type for TransactionHistory
interface TransactionHistoryItem {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  created: string;
  description: string;
}

export default function BalancesPage() {
  const [activeView, setActiveView] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  const { subscribeToPaymentEvents } = usePaymentContext();
  const { currency, currencySymbol, isLoading: currencyLoading } = useCurrency();

  // Demo data for fallback if API fails
  const demoBalanceData = {
    available: 12450.75,
    pending: 3270.50,
    reserved: 1500.00,
    currency: currency,
    nextPayout: {
      amount: 10000.00,
      date: "May 15, 2025"
    },
    lastPayout: {
      amount: 8750.25,
      date: "May 1, 2025",
      status: "completed"
    },
    lastUpdated: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  };

  // Balance data state - start as null, only set real data when loaded
  const [balanceData, setBalanceData] = useState<any>(null);

  // Transaction history state
  const [transactions, setTransactions] = useState<TransactionHistoryItem[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const transactionService = new TransactionService();

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Fetch balance data from the backend
  const fetchBalanceData = async () => {
    try {
      setRefreshing(true);
      const data = await balanceService.getBalanceAndPayout();

      // Check if we have valid data
      if (data && typeof data === 'object' && 'availableBalance' in data) {
        // Set real data from backend
        setBalanceData({
          available: data.availableBalance,
          pending: data.pendingBalance,
          reserved: data.reservedBalance,
          currency: data.currency || currency,
          nextPayout: {
            amount: data.nextPayout?.amount || 0,
            date: data.nextPayout?.date || ''
          },
          lastPayout: {
            amount: data.lastPayout?.amount || 0,
            date: data.lastPayout?.date || '',
            status: data.lastPayout?.status || ''
          },
          lastUpdated: data.lastUpdated || new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        });

        setError(null);

        // Log successful data fetch
        console.log('Successfully loaded real balance data from backend');
      } else {
        // Invalid data structure
        throw new Error('Invalid data structure received from API');
      }
    } catch (err: any) {
      console.error('Error fetching balance data:', err);
      setError(`Failed to load real data: ${err.message || 'Unknown error'}. Using demo data instead.`);
      setBalanceData(demoBalanceData); // Only use demo data if API fails
      // Show toast notification
      toast({
        title: "Using Demo Data",
        description: "Could not connect to the backend. Showing demo data instead.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh balance data
  const handleRefresh = () => {
    fetchBalanceData();
  };

  // Load balance data on component mount
  useEffect(() => {
    fetchBalanceData();
  }, []);

  // Subscribe to payment events to refresh balance data
  useEffect(() => {
    const unsubscribe = subscribeToPaymentEvents(() => {
      console.log('[BalancesPage] Payment event received, refreshing balance data...');
      fetchBalanceData();
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
            console.log('[BalancesPage] Found recent payment event during periodic check, refreshing balance data...');
            fetchBalanceData();
            localStorage.removeItem('paymesa_payment_event');
          }
        }
      } catch (error) {
        console.error('[BalancesPage] Error in periodic payment check:', error);
      }
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [subscribeToPaymentEvents]);

  useEffect(() => {
    async function fetchTransactions() {
      setTransactionsLoading(true);
      try {
        const response = await transactionService.getTransactions({ limit: 20 });
        // Map to TransactionHistory type
        const mapped: TransactionHistoryItem[] = response.data.map((t: any) => ({
          id: t.transactionId || t._id || t.id || t.created,
          type: t.paymentMethod || 'charge', // fallback if type missing
          amount: t.amount,
          currency: t.currency,
          status: t.status,
          created: t.date || t.created || new Date().toISOString(),
          description: t.description || '',
        }));
        setTransactions(mapped);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setTransactionsLoading(false);
      }
    }
    if (activeView === 'transactions') {
      fetchTransactions();
    }
  }, [activeView]);

  if (loading || !balanceData) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Shopify-style Header */}
        <ShopifyHeader 
          title="Balances"
          subtitle="Manage your funds, view transaction history, and schedule payouts"
          actions={
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                size="sm"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={handleRefresh} 
                disabled={loading || refreshing}
              >
                {refreshing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </>
                )}
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          }
        />

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mb-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mx-6 mb-6">
          <Tabs value={activeView} onValueChange={setActiveView}>
            <TabsList className="grid w-full sm:w-auto grid-cols-4 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300">Overview</TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300">Transactions</TabsTrigger>
              <TabsTrigger value="payouts" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300">Payouts</TabsTrigger>
              <TabsTrigger value="reserves" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300">Reserves</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                {/* Key Metrics - Shopify Style */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ShopifyStatsCard
                    title="Available Balance"
                    value={formatCurrency(balanceData.available)}
                    change={5.2}
                    changeLabel="vs last period"
                    icon={<Wallet className="h-5 w-5" />}
                    trend="up"
                  />
                  
                  <ShopifyStatsCard
                    title="Pending Balance"
                    value={formatCurrency(balanceData.pending)}
                    change={-2.1}
                    changeLabel="2-5 business days"
                    icon={<Clock className="h-5 w-5" />}
                    trend="down"
                  />
                  
                  <ShopifyStatsCard
                    title="Reserved Balance"
                    value={formatCurrency(balanceData.reserved)}
                    change={0}
                    changeLabel="Security reserve"
                    icon={<Shield className="h-5 w-5" />}
                    trend="neutral"
                  />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Payout Information */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Payout Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            Next Scheduled Payout
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {loading ? (
                            <div className="space-y-3">
                              <Skeleton className="h-8 w-2/3" />
                              <Skeleton className="h-4 w-1/2" />
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-baseline justify-between">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                  {formatCurrency(balanceData.nextPayout.amount)}
                                </h3>
                                <Button variant="outline" size="sm" className="text-xs">
                                  Modify
                                </Button>
                              </div>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>{balanceData.nextPayout.date}</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Last Payout
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {loading ? (
                            <div className="space-y-3">
                              <Skeleton className="h-8 w-2/3" />
                              <Skeleton className="h-4 w-1/2" />
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-baseline justify-between">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                  {formatCurrency(balanceData.lastPayout.amount)}
                                </h3>
                                <Button variant="outline" size="sm" className="text-xs">
                                  Details
                                </Button>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  <span>{balanceData.lastPayout.date}</span>
                                </div>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300">
                                  Completed
                                </span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700">
                            <DollarSign className="h-6 w-6 text-emerald-500" />
                            <span className="text-sm font-medium">Initiate Payout</span>
                          </Button>
                          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-700">
                            <Calendar className="h-6 w-6 text-blue-500" />
                            <span className="text-sm font-medium">Schedule Payouts</span>
                          </Button>
                          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-700">
                            <Download className="h-6 w-6 text-purple-500" />
                            <span className="text-sm font-medium">View Statements</span>
                          </Button>
                          <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-3 hover:bg-amber-50 dark:hover:bg-amber-900/20 border-amber-200 dark:border-amber-700">
                            <Shield className="h-6 w-6 text-amber-500" />
                            <span className="text-sm font-medium">Manage Reserves</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Balance Summary */}
                  <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">Balance Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-700 dark:text-blue-300">Total Available</span>
                            <span className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                              {formatCurrency(balanceData.available)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-700 dark:text-blue-300">Pending</span>
                            <span className="text-sm text-blue-600 dark:text-blue-400">
                              {formatCurrency(balanceData.pending)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-700 dark:text-blue-300">Reserved</span>
                            <span className="text-sm text-blue-600 dark:text-blue-400">
                              {formatCurrency(balanceData.reserved)}
                            </span>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-blue-200 dark:border-blue-700">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Balance</span>
                            <span className="text-xl font-bold text-blue-900 dark:text-blue-100">
                              {formatCurrency(balanceData.available + balanceData.pending + balanceData.reserved)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Payment received</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                            </div>
                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">+{formatCurrency(1250)}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Payout scheduled</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                            </div>
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">-{formatCurrency(5000)}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Reserve updated</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">3 hours ago</p>
                            </div>
                            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">+{formatCurrency(500)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="mt-6">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600"></div>
                        <span className="text-gray-600 dark:text-gray-400">Loading transactions...</span>
                      </div>
                    </div>
                  ) : (
                    <TransactionHistory transactions={transactions} currency={currency} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payouts" className="mt-6">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Payout Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Settings className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Payout Settings</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Configure your payout preferences and schedules.</p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Zap className="mr-2 h-4 w-4" />
                      Configure Payouts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reserves" className="mt-6">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Reserve Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Shield className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Reserve Management</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Manage your security reserves and dispute funds.</p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Shield className="mr-2 h-4 w-4" />
                      Manage Reserves
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
