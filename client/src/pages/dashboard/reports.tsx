import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { usePaymentContext } from "@/contexts/PaymentContext";
import {
  Search,
  Download,
  Filter,
  Calendar,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Info,
  RefreshCw,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import analyticsService, { getPaymentAnalytics, PaymentAnalytics, getProductAnalytics, ProductAnalytics, getCustomerAnalytics, CustomerAnalytics } from "@/services/analytics.service";
import { africanColors } from "@/lib/african-colors";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("last30days");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<PaymentAnalytics | null>(null);
  const [productAnalytics, setProductAnalytics] = useState<ProductAnalytics | null>(null);
  const [productLoading, setProductLoading] = useState(false);
  const [customerAnalytics, setCustomerAnalytics] = useState<CustomerAnalytics | null>(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const { subscribeToPaymentEvents } = usePaymentContext();

  // Function to fetch analytics data
  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPaymentAnalytics(dateRange);
      setAnalytics(res.data);
    } catch (err) {
      setError("Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch product analytics data
  const fetchProductAnalytics = async () => {
    setProductLoading(true);
    try {
      const res = await getProductAnalytics(dateRange);
      setProductAnalytics(res.data);
    } catch (err) {
      console.error("Failed to load product analytics:", err);
    } finally {
      setProductLoading(false);
    }
  };

  // Function to fetch customer analytics data
  const fetchCustomerAnalytics = async () => {
    setCustomerLoading(true);
    try {
      const res = await getCustomerAnalytics(dateRange);
      setCustomerAnalytics(res.data);
    } catch (err) {
      console.error("Failed to load customer analytics:", err);
    } finally {
      setCustomerLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchProductAnalytics();
    fetchCustomerAnalytics();
  }, [dateRange]);

  // Subscribe to payment events to refresh analytics data
  useEffect(() => {
    const unsubscribe = subscribeToPaymentEvents(() => {
      console.log('[ReportsPage] Payment event received, refreshing analytics...');
      fetchAnalytics();
      fetchProductAnalytics();
      fetchCustomerAnalytics();
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
            console.log('[ReportsPage] Found recent payment event during periodic check, refreshing analytics...');
            fetchAnalytics();
            fetchProductAnalytics();
            fetchCustomerAnalytics();
            localStorage.removeItem('paymesa_payment_event');
          }
        }
      } catch (error) {
        console.error('[ReportsPage] Error in periodic payment check:', error);
      }
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [subscribeToPaymentEvents]);

  // Extract currency from analytics response, fallback to 'GHS'
  const currency = (analytics?.grossVolume as any)?.currency || 'GHS';

  // Debug: Print raw analytics data to help trace inconsistencies
  useEffect(() => {
    if (analytics) {
       
      console.log('[ReportsPage] Raw analytics data:', analytics);
    }
  }, [analytics]);

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };
  
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
  const getTrendIndicator = (value: number) => {
    if (value > 0) {
      return <div className="flex items-center text-green-600"><ArrowUp className="h-4 w-4 mr-1" />{formatPercentage(value)}</div>;
    } else if (value < 0) {
      return <div className="flex items-center text-red-600"><ArrowDown className="h-4 w-4 mr-1" />{formatPercentage(Math.abs(value))}</div>;
    } else {
      return <div className="text-gray-500">0%</div>;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Info className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Failed to load reports</h3>
            <p className="text-gray-500 max-w-md">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-black hover:bg-gray-800">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No analytics data available</h3>
            <p className="text-gray-500">Start processing payments to see your reports here.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Use base unit for all analytics values
  const grossVolumeBase = analytics.grossVolume.amount;
  const averageOrderValueBase = analytics.averageOrderValue;
  const failedPaymentsBase = analytics.failedPayments.amount;
  const chartBase = analytics.grossVolume.chart;
  const topCustomersBase = analytics.topCustomers;

  // Use payment methods data as-is
  const paymentMethodsBase = (analytics as any).paymentMethods || [];
  const paymentMethodsTotalBase = paymentMethodsBase.reduce((sum: number, pm: unknown) => sum + pm.amount, 0);

  return (
    <DashboardLayout>
      {/* Professional Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-8 mb-8 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics & Reports</h1>
          <p className="text-base text-gray-500 mt-2 max-w-2xl">Comprehensive insights into your business performance, payment trends, and customer behavior.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-900 dark:text-gray-100">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <SelectValue placeholder="Select date range" />
              </div>
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-900 dark:text-gray-100">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="thisMonth">This month</SelectItem>
              <SelectItem value="lastMonth">Last month</SelectItem>
              <SelectItem value="thisYear">This year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-gray-200 dark:border-gray-700 text-primary dark:text-primary-400">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline" className="border-gray-200 dark:border-gray-700 text-primary dark:text-primary-400">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Sales</CardTitle>
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(grossVolumeBase, currency)}</div>
              <div className="flex items-center justify-between">
                {getTrendIndicator(analytics.grossVolume.growth ?? 0)}
                <Badge variant="outline" className="border-primary text-primary">Live</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Transactions</CardTitle>
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                <Activity className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{analytics.totalTransactions.toLocaleString()}</div>
              <div className="flex items-center justify-between">
                {getTrendIndicator(0)}
                <Badge variant="outline" className="border-primary text-primary">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Order</CardTitle>
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                <ShoppingCart className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(averageOrderValueBase, currency)}</div>
              <div className="flex items-center justify-between">
                {getTrendIndicator(0)}
                <Badge variant="outline" className="border-primary text-primary">Avg</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Refund Rate</CardTitle>
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                <TrendingDown className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{formatPercentage((analytics.failedPayments.amount / analytics.grossVolume.amount) * 100)}</div>
              <div className="flex items-center justify-between">
                {getTrendIndicator(0)}
                <Badge variant="outline" className="border-primary text-primary">Rate</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Minimal Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex w-full border-b border-gray-200 dark:border-gray-800 mb-6 bg-transparent rounded-none p-0">
          <TabsTrigger value="overview" className="px-4 py-2 text-gray-700 dark:text-gray-200 font-medium border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary dark:data-[state=active]:text-primary-400 rounded-none bg-transparent">Overview</TabsTrigger>
          <TabsTrigger value="sales" className="px-4 py-2 text-gray-700 dark:text-gray-200 font-medium border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary dark:data-[state=active]:text-primary-400 rounded-none bg-transparent">Sales</TabsTrigger>
          <TabsTrigger value="products" className="px-4 py-2 text-gray-700 dark:text-gray-200 font-medium border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary dark:data-[state=active]:text-primary-400 rounded-none bg-transparent">Products</TabsTrigger>
          <TabsTrigger value="customers" className="px-4 py-2 text-gray-700 dark:text-gray-200 font-medium border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary dark:data-[state=active]:text-primary-400 rounded-none bg-transparent">Customers</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm dark:bg-gray-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Revenue Trend</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Track your revenue growth over time</CardDescription>
                  </div>
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-[120px] h-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <SelectValue placeholder="View by" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-900 dark:text-gray-100">
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartBase}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={africanColors.green} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={africanColors.green} stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${currency}${value}`}
                      />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                      <Tooltip
                        formatter={(value) => [`${currency}${value}`, 'Revenue']}
                        labelFormatter={(label) => `Date: ${label}`}
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          borderRadius: '12px', 
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                          color: '#111',
                        }}
                        wrapperStyle={{ backgroundColor: 'var(--tw-bg-opacity, #111)' }}
                        itemStyle={{ color: '#111' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={africanColors.green}
                        strokeWidth={3}
                        fill="url(#colorRevenue)"
                        activeDot={{ r: 8, stroke: africanColors.green, strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm dark:bg-gray-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Payment Methods</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Distribution of payment methods used</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 dark:text-gray-300 dark:hover:bg-gray-800">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {paymentMethodsBase && paymentMethodsBase.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={220}>
                          <RechartsPieChart>
                            <Pie
                              data={paymentMethodsBase}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              innerRadius={50}
                              paddingAngle={5}
                              fill="#8884d8"
                              dataKey="amount"
                              nameKey="method"
                              label={({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`}
                            >
                              {(paymentMethodsBase as any).map((_: unknown, index: number) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={index === 0 ? africanColors.green : index === 1 ? africanColors.yellow : index === 2 ? africanColors.red : africanColors.black} 
                                />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => [formatCurrency(Number(value), currency), 'Amount']}
                              contentStyle={{ 
                                backgroundColor: '#fff', 
                                borderRadius: '12px', 
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                color: '#111',
                              }}
                              wrapperStyle={{ backgroundColor: 'var(--tw-bg-opacity, #111)' }}
                              itemStyle={{ color: '#111' }}
                            />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-4 flex flex-col justify-center">
                        {paymentMethodsBase.map((item: unknown, index: number) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-3" 
                                  style={{ 
                                    backgroundColor: index === 0 ? africanColors.green : index === 1 ? africanColors.yellow : index === 2 ? africanColors.red : africanColors.black 
                                  }}
                                ></div>
                                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{item.method}</div>
                              </div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(item.amount, currency)}</div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                              <div>{item.count} payments</div>
                              <div>{((item.amount / paymentMethodsTotalBase) * 100).toFixed(1)}%</div>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-300" 
                                style={{ 
                                  width: `${((item.amount / paymentMethodsTotalBase) * 100).toFixed(1)}%`,
                                  backgroundColor: index === 0 ? africanColors.green : index === 1 ? africanColors.yellow : index === 2 ? africanColors.red : africanColors.black
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
                    <div className="text-center space-y-2">
                      <PieChart className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                      <p>No payment method analytics available.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Products</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Best performing products by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                {productLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        </div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                ) : productAnalytics && productAnalytics.topProducts.length > 0 ? (
                  <div className="space-y-3">
                    {productAnalytics.topProducts.slice(0, 5).map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center space-x-3">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-8 h-8 rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.nextElementSibling) {
                                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div className={`w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold ${product.image ? 'hidden' : 'flex'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{product.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{product.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">{formatCurrency(product.revenue, product.currency)}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{product.sales} sales</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
                    <div className="text-center space-y-2">
                      <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                      <p>Product analytics data is not yet available.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm dark:bg-gray-900 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Customers</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Customers with highest spending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-y-auto" style={{ maxHeight: 340 }}>
                  <div className="space-y-4">
                    {topCustomersBase.map((customer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{customer.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{customer.transactions} transactions</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(customer.spend, currency)}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Total spent</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="border-0 shadow-sm dark:bg-gray-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sales Analysis</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Detailed breakdown of your sales performance</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select defaultValue="revenue">
                      <SelectTrigger className="w-[150px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <SelectValue placeholder="Metric" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-900 dark:text-gray-100">
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="orders">Orders</SelectItem>
                        <SelectItem value="average">Average Order</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Filter className="h-4 w-4 mr-2" />
                      <span>Filter</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartBase}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${currency}${value}`}
                      />
                      <Tooltip
                        formatter={(value) => [`${currency}${Number(value).toFixed(2)}`, 'Revenue']}
                        labelFormatter={(label) => `Date: ${label}`}
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          borderRadius: '12px', 
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                          color: '#111',
                        }}
                        wrapperStyle={{ backgroundColor: 'var(--tw-bg-opacity, #111)' }}
                        itemStyle={{ color: '#111' }}
                      />
                      <Legend />
                      <Bar dataKey="value" name="Revenue" fill={africanColors.green} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <Separator className="my-6" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(grossVolumeBase, currency)}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Last updated 5 minutes ago</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Transactions</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analytics.totalTransactions.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Average {formatCurrency(averageOrderValueBase, currency)} per order</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Refunds</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(failedPaymentsBase, currency)}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total amount refunded</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm dark:bg-gray-900 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Daily Revenue Breakdown</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Day-by-day revenue analysis with growth indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700" style={{ maxHeight: 340, overflowY: 'auto' }}>
                  <table className="min-w-full text-sm">
                    <thead className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-md">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Date</th>
                        <th className="px-6 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">Revenue</th>
                        <th className="px-6 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartBase.map((day, index) => {
                        const prev = index > 0 ? chartBase[index-1].value : null;
                        const change = prev !== null ? ((day.value - prev) / prev) * 100 : null;
                        let badgeColor = "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
                        if (change !== null && change > 0) badgeColor = "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
                        if (change !== null && change < 0) badgeColor = "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
                        return (
                          <tr key={index} className={
                            `group border-l-4 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} border-l-[6px] border-l-[${africanColors.green}] hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors`
                          }>
                            <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{day.name}</td>
                            <td className="px-6 py-3 text-right text-lg font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">{formatCurrency(day.value, currency)}</td>
                            <td className="px-6 py-3 text-right whitespace-nowrap">
                              {change !== null ? (
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
                                  {change > 0 && <ArrowUp className="h-3 w-3 mr-1" />}
                                  {change < 0 && <ArrowDown className="h-3 w-3 mr-1" />}
                                  {change === 0 && <ArrowUpDown className="h-3 w-3 mr-1" />}
                                  {formatPercentage(Math.abs(change))}
                                </span>
                              ) : (
                                <span className="text-gray-400 dark:text-gray-500">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          {productLoading ? (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Product Analytics</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Loading product performance data...</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : productAnalytics && productAnalytics.totalProducts > 0 ? (
            <>
              {/* Product Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-0 shadow-sm dark:bg-gray-900">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{productAnalytics.totalProducts}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm dark:bg-gray-900">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(productAnalytics.totalRevenue, currency)}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm dark:bg-gray-900">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Price</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(productAnalytics.averagePrice, currency)}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm dark:bg-gray-900">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{productAnalytics.productCategories.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Products */}
              <Card className="border-0 shadow-sm dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Performing Products</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Products with highest revenue in {dateRange}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productAnalytics.topProducts.map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center space-x-4">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.nextElementSibling) {
                                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold ${product.image ? 'hidden' : 'flex'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{product.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-400 dark:text-gray-500">{product.transactions} transactions</span>
                              <span className="text-xs text-gray-400 dark:text-gray-500">{product.sales} sales</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(product.revenue, product.currency)}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Avg: {formatCurrency(product.averageOrderValue, product.currency)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Product Categories */}
              <Card className="border-0 shadow-sm dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Product Categories Performance</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Revenue breakdown by product category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {productAnalytics.productCategories.map((category, index) => (
                        <div key={category.name} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ 
                                backgroundColor: index === 0 ? africanColors.green : 
                                               index === 1 ? africanColors.yellow : 
                                               index === 2 ? africanColors.red : africanColors.black 
                              }}
                            ></div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">{category.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{category.products} products</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(category.revenue, currency)}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{category.sales} sales</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center">
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={productAnalytics.productCategories}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            innerRadius={60}
                            paddingAngle={5}
                            fill="#8884d8"
                            dataKey="revenue"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {productAnalytics.productCategories.map((_, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={index === 0 ? africanColors.green : 
                                       index === 1 ? africanColors.yellow : 
                                       index === 2 ? africanColors.red : africanColors.black} 
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [formatCurrency(Number(value), currency), 'Revenue']}
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              borderRadius: '12px', 
                              border: '1px solid #e2e8f0',
                              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                              color: '#111',
                            }}
                            wrapperStyle={{ backgroundColor: 'var(--tw-bg-opacity, #111)' }}
                            itemStyle={{ color: '#111' }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Gallery */}
              <Card className="border-0 shadow-sm dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Product Gallery</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Visual overview of your products with performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productAnalytics.products.map((product) => (
                      <div key={product.id} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3 mb-3">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-16 h-16 rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.nextElementSibling) {
                                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold ${product.image ? 'hidden' : 'flex'}`}>
                            {product.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{product.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Price:</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(product.price, product.currency)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(product.revenue, product.currency)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Sales:</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{product.sales}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Transactions:</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{product.transactions}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-0 shadow-sm dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Product Analytics</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Detailed insights into your product performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
                  <div className="text-center space-y-2">
                    <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                    <p>Product analytics are not yet available.</p>
                    <p className="text-sm">Start adding products to see detailed analytics here.</p>
                  </div>
                </div>                </CardContent>
              </Card>
          )}
        </TabsContent>
        
        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          {customerLoading ? (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Customer Insights</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Loading customer analytics data...</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : customerAnalytics && customerAnalytics.totalCustomers > 0 ? (
            <>
              {/* Customer Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 shadow-sm dark:bg-gray-900">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{customerAnalytics.totalCustomers}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm dark:bg-gray-900">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New Customers</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{customerAnalytics.newCustomers}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm dark:bg-gray-900">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Customer Value</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(customerAnalytics.averageCustomerValue, currency)}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm dark:bg-gray-900">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Retention Rate</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatPercentage(customerAnalytics.customerRetentionRate)}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Customer Growth Chart */}
              {customerAnalytics.customerGrowth.length > 0 && (
                <Card className="border-0 shadow-sm dark:bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Customer Growth</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Daily customer acquisition and revenue trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={customerAnalytics.customerGrowth}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#888888" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          />
                          <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            yAxisId="left"
                          />
                          <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            yAxisId="right"
                            orientation="right"
                            tickFormatter={(value) => `${currency}${value}`}
                          />
                          <Tooltip
                            formatter={(value, name) => [
                              name === 'customers' ? value : formatCurrency(Number(value), currency),
                              name === 'customers' ? 'Customers' : 'Revenue'
                            ]}
                            labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              borderRadius: '12px', 
                              border: '1px solid #e2e8f0',
                              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="customers" 
                            name="Customers" 
                            stroke={'#3b82f6'} 
                            fill={'#3b82f6'} 
                            fillOpacity={0.3}
                            yAxisId="left"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            name="Revenue" 
                            stroke={africanColors.green} 
                            fill={africanColors.green} 
                            fillOpacity={0.3}
                            yAxisId="right"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Top Customers */}
              <Card className="border-0 shadow-sm dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Customers</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Customers with highest spending in {dateRange}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                    {customerAnalytics.topCustomers.map((customer) => (
                      <div key={customer.email} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {customer.rank}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{customer.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-400 dark:text-gray-500">{customer.transactionCount} transactions</span>
                              {customer.isNewCustomer && (
                                <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">New</Badge>
                              )}
                              {customer.isReturningCustomer && (
                                <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Returning</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(customer.totalSpend, currency)}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total spent</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Avg: {formatCurrency(customer.averageOrderValue, currency)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Segments */}
              <Card className="border-0 shadow-sm dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Customer Segments</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Breakdown of customers by value segments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Segments List */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Segment Distribution</h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Total: {customerAnalytics.customerSegments.reduce((sum, segment) => sum + segment.count, 0)} customers</span>
                      </div>
                      {customerAnalytics.customerSegments.map((segment, index) => (
                        <div key={segment.name} className="group relative bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <div 
                                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
                                  style={{ 
                                    backgroundColor: segment.color === 'green' ? '#dcfce7' : 
                                                   segment.color === 'yellow' ? '#fef3c7' : 
                                                   '#fee2e2',
                                    ...(document.documentElement.classList.contains('dark') && {
                                      backgroundColor: segment.color === 'green' ? '#064e3b' : 
                                                     segment.color === 'yellow' ? '#78350f' : 
                                                     '#7f1d1d'
                                    })
                                  }}
                                >
                                  <div 
                                    className="w-6 h-6 rounded-full"
                                    style={{ 
                                      backgroundColor: segment.color === 'green' ? africanColors.green : 
                                                     segment.color === 'yellow' ? africanColors.yellow : 
                                                     africanColors.red
                                    }}
                                  ></div>
                                </div>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center">
                                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{index + 1}</span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{segment.name}</h4>
                                  <Badge 
                                    className="text-xs"
                                    style={{ 
                                      backgroundColor: segment.color === 'green' ? '#dcfce7' : 
                                                     segment.color === 'yellow' ? '#fef3c7' : 
                                                     '#fee2e2',
                                      color: segment.color === 'green' ? '#166534' : 
                                             segment.color === 'yellow' ? '#92400e' : 
                                             '#991b1b',
                                      ...(document.documentElement.classList.contains('dark') && {
                                        backgroundColor: segment.color === 'green' ? '#064e3b' : 
                                                       segment.color === 'yellow' ? '#78350f' : 
                                                       '#7f1d1d',
                                        color: segment.color === 'green' ? '#4ade80' : 
                                               segment.color === 'yellow' ? '#fbbf24' : 
                                               '#f87171'
                                      })
                                    }}
                                  >
                                    {segment.color === 'green' ? 'High Value' : 
                                     segment.color === 'yellow' ? 'Medium Value' : 'Low Value'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{segment.count} customers</p>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full transition-all duration-300"
                                    style={{ 
                                      width: `${segment.percentage}%`,
                                      backgroundColor: segment.color === 'green' ? africanColors.green : 
                                                     segment.color === 'yellow' ? africanColors.yellow : 
                                                     africanColors.red
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatPercentage(segment.percentage)}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">of total</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pie Chart */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative">
                        <ResponsiveContainer width={280} height={280}>
                          <RechartsPieChart>
                            <Pie
                              data={customerAnalytics.customerSegments}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={110}
                              innerRadius={70}
                              paddingAngle={8}
                              fill="#8884d8"
                              dataKey="count"
                              nameKey="name"
                              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                            >
                              {customerAnalytics.customerSegments.map((segment) => (
                                <Cell 
                                  key={`cell-${segment.name}`} 
                                  fill={segment.color === 'green' ? africanColors.green : 
                                         segment.color === 'yellow' ? africanColors.yellow : 
                                         africanColors.red} 
                                />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value, name) => [value, 'Customers']}
                              contentStyle={{ 
                                backgroundColor: '#fff', 
                                borderRadius: '12px', 
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                color: '#111',
                              }}
                              wrapperStyle={{ backgroundColor: 'var(--tw-bg-opacity, #111)' }}
                              itemStyle={{ color: '#111' }}
                            />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center">
                              <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Total</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {customerAnalytics.customerSegments.reduce((sum, segment) => sum + segment.count, 0)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Legend */}
                      <div className="mt-6 w-full">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">Segment Legend</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {customerAnalytics.customerSegments.map((segment) => (
                            <div key={segment.name} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ 
                                    backgroundColor: segment.color === 'green' ? africanColors.green : 
                                                   segment.color === 'yellow' ? africanColors.yellow : 
                                                   africanColors.red
                                  }}
                                ></div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{segment.name}</span>
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{segment.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-0 shadow-sm dark:bg-gray-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Customer Insights</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Analyze customer behavior and spending patterns</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-[250px]">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        placeholder="Search customers..." 
                        className="pl-10 w-full border-gray-200 dark:border-gray-700 focus:border-gray-300"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Filter className="h-4 w-4 mr-2" />
                      <span>Filter</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                  <div className="text-center space-y-2">
                    <Users className="w-12 h-12 mx-auto text-gray-300" />
                    <p>No customer insights analytics available.</p>
                    <p className="text-sm">Customer analytics will appear here as you process more payments.</p>
                  </div>
                </div>                </CardContent>
              </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Need help with reports?
            <a href="#" className="text-primary hover:underline ml-1 font-medium">View documentation</a>
            or
            <a href="#" className="text-primary hover:underline ml-1 font-medium">contact support</a>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
