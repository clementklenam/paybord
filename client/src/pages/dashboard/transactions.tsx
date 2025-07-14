import {useState, useEffect} from "react";
import {DashboardLayout} from "@/components/dashboard/DashboardLayout";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useToast} from "@/components/ui/use-toast";
import TransactionService, { Transaction, TransactionFilters } from "@/services/transaction.service";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {Slider} from "@/components/ui/slider";
import {Dialog, DialogContent, DialogTitle, DialogFooter} from "@/components/ui/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import { 
  Search, 
  Download, 
  Filter, 
  Calendar, 
  ChevronDown, 
  ArrowUpDown,
  CreditCard,
  Smartphone,
  Building,
  Wallet,
  Eye,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  Clock,
  FileText,
  ExternalLink,
  Copy,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  MoreHorizontal,
  Settings,
  Bell,
  Zap,
  Shield,
  Target,
  Award,
  Star,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Flag,
  Archive,
  Trash2,
  Edit3,
  ExternalLink as ExternalLinkIcon,
  Lock,
  Unlock,
  Key,
  Settings as SettingsIcon,
  Bell as BellIcon,
  User as UserIcon,
  Users,
  Building as BuildingIcon,
  Home,
  ShoppingCart,
  Package,
  Truck,
  Plane,
  Ship,
  Car,
  Bike,
  Coffee,
  Gift,
  Award as AwardIcon,
  Trophy,
  Medal,
  Crown,
  Diamond,
  Gem
} from "lucide-react";

// Format currency (define this early!)
const formatCurrency = (amount: number, currency: string = "GHS") => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Main Transactions Page Component
export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("last30days");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isLoading, setIsLoading] = useState(true);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string[]>([]);
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 1000]);
  const [customerFilter, setCustomerFilter] = useState("");
  
  // Transaction data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Toast for notifications
  const { toast } = useToast();
  
  // Initialize transaction service
  const transactionService = new TransactionService();
  
  // Fetch transactions when filters change
  useEffect(() => {
    fetchTransactions();
  }, [currentPage, itemsPerPage, statusFilter, paymentMethodFilter, amountRange, customerFilter, searchQuery, dateRange]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };
  
  // Function to fetch transactions
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      
      // Prepare date filters based on dateRange
      let dateFrom, dateTo;
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      switch (dateRange) {
        case 'today':
          dateFrom = today.toISOString().split('T')[0];
          dateTo = today.toISOString().split('T')[0];
          break;
        case 'yesterday':
          dateFrom = yesterday.toISOString().split('T')[0];
          dateTo = yesterday.toISOString().split('T')[0];
          break;
        case 'last7days': { const last7Days = new Date(today);
          last7Days.setDate(today.getDate() - 7);
          dateFrom = last7Days.toISOString().split('T')[0];
          dateTo = today.toISOString().split('T')[0];
          break;
}
        case 'last30days': { const last30Days = new Date(today);
          last30Days.setDate(today.getDate() - 30);
          dateFrom = last30Days.toISOString().split('T')[0];
          dateTo = today.toISOString().split('T')[0];
          break;
}
        case 'thisMonth':
          dateFrom = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
          dateTo = today.toISOString().split('T')[0];
          break;
        case 'lastMonth': { const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
          dateFrom = firstDayLastMonth.toISOString().split('T')[0];
          dateTo = lastDayLastMonth.toISOString().split('T')[0];
          break;
}
      }
      
      // Prepare filters
      const filters: TransactionFilters = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        status: statusFilter,
        paymentMethod: paymentMethodFilter,
        amountMin: amountRange[0],
        amountMax: amountRange[1],
        customer: customerFilter,
        dateFrom,
        dateTo
      };
      
      // Fetch transactions
      const response = await transactionService.getTransactions(filters);
      
      // Defensive: fallback to empty array/object if undefined
      setTransactions(Array.isArray(response?.data) ? response.data : []);
      setTotalTransactions(response?.pagination?.total ?? 0);
      setTotalPages(response?.pagination?.pages ?? 1);
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error loading transactions",
        description: "There was a problem loading your transactions. Please try again later.",
        variant: "destructive"
      });
      // On error, set to empty to avoid blank page
      setTransactions([]);
      setTotalTransactions(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to view transaction details
  const viewTransactionDetails = async (id: string) => {
    try {
      const transaction = await transactionService.getTransactionById(id);
      setSelectedTransaction(transaction);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      toast({
        title: "Error loading transaction details",
        description: "There was a problem loading the transaction details. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page when applying filters
    fetchTransactions();
  };
  
  // Reset filters
  const resetFilters = () => {
    setStatusFilter([]);
    setPaymentMethodFilter([]);
    setAmountRange([0, 1000]);
    setCustomerFilter("");
    setSearchQuery("");
    setDateRange("last30days");
    setCurrentPage(1);
    fetchTransactions();
  };
  
  // Export transactions
  const exportTransactions = async () => {
    try {
      // Implementation for export functionality
      toast({
        title: "Export started",
        description: "Your transaction data is being prepared for download.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was a problem exporting your transactions.",
        variant: "destructive"
      });
    }
  };

  // Calculate statistics
  const successfulTransactions = transactions.filter(t => t.status === "succeeded");
  const failedTransactions = transactions.filter(t => t.status === "failed");
  const refundedTransactions = transactions.filter(t => t.status === "refunded");

  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const successfulVolume = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
  const refundedVolume = refundedTransactions.reduce((sum, t) => sum + t.amount, 0);

  const formattedTotalVolume = formatCurrency(totalVolume, "GHS");
  const formattedSuccessfulVolume = formatCurrency(successfulVolume, "GHS");
  const formattedRefundedVolume = formatCurrency(refundedVolume, "GHS");

  // Currency context (you might want to get this from your currency context)
  const currency = "GHS";

  useEffect(() => {
    console.log('[DEBUG] Transactions data:', transactions);
    const totalVolume = Array.isArray(transactions) ? transactions.reduce((sum, t) => sum + t.amount, 0) : 0;
    console.log('[DEBUG] Total volume calculation:', { totalVolume, currency });
    const formattedTotalVolume = formatCurrency(totalVolume, currency);
    console.log('[DEBUG] Formatted total volume:', formattedTotalVolume);
  }, [transactions, currency]);

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Success
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800">
            <RefreshCw className="h-3 w-3 mr-1" />
            Refunded
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800">
            <Activity className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case "bank_transfer":
        return <Building className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "mobile_money":
        return <Smartphone className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <Wallet className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <DashboardLayout>
      {/* Enhanced Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Transactions</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor and manage your payment transactions</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 gap-2"
              onClick={exportTransactions}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 gap-2"
              onClick={() => setIsFiltersOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Volume</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{formattedTotalVolume}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{transactions.length} transactions</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Successful</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{formattedSuccessfulVolume}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">{successfulTransactions.length} transactions</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Failed</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">{failedTransactions.length}</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">transactions</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Refunded</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{formattedRefundedVolume}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{refundedTransactions.length} transactions</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <RefreshCw className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search and Filters Bar */}
      <Card className="mb-6 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      applyFilters();
                    }
                  }}
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                />
              </div>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <SelectValue placeholder="Select date range" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 days</SelectItem>
                  <SelectItem value="last30days">Last 30 days</SelectItem>
                  <SelectItem value="thisMonth">This month</SelectItem>
                  <SelectItem value="lastMonth">Last month</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset
              </Button>
              <Button size="sm" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Transactions Table */}
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Transaction History</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Showing {transactions.length} of {totalTransactions} transactions</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-900">
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment Method</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="text-center py-8">
                        <Activity className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">No transactions found</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {searchQuery || statusFilter.length > 0 || paymentMethodFilter.length > 0
                            ? "Try adjusting your search or filters" 
                            : "No transactions available yet"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(transaction.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{formatDate(transaction.createdAt || transaction.created || transaction.date)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{transaction.description}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{transaction.customer}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(transaction.paymentMethod)}
                          <span className="capitalize text-gray-900 dark:text-gray-100">{transaction.paymentMethod.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(transaction.amount, transaction.currency)}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Fee: {formatCurrency(transaction.fee || 0, transaction.currency)}</div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => viewTransactionDetails(transaction.id)} className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Enhanced Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[120px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="10 per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium text-gray-900 dark:text-gray-100">{transactions.length}</span> of{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">{totalTransactions}</span> transactions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || isLoading}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Go to first page</span>
                <ChevronDown className="h-4 w-4 rotate-90" />
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium text-gray-900 dark:text-gray-100">
                Page {currentPage} of {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading || totalPages === 0}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Go to next page</span>
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || isLoading || totalPages === 0}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Go to last page</span>
                <ChevronDown className="h-4 w-4 -rotate-90" />
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters Dialog */}
      <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Filter Transactions</DialogTitle>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Status</Label>
              <div className="grid grid-cols-2 gap-2">
                {["succeeded", "pending", "failed", "refunded"].map((status) => (
                  <div key={status} className="flex items-center gap-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={statusFilter.includes(status)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setStatusFilter([...statusFilter, status]);
                        } else {
                          setStatusFilter(statusFilter.filter((s) => s !== status));
                        }
                      }}
                    />
                    <Label htmlFor={`status-${status}`} className="capitalize">
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-2 gap-2">
                {["card", "bank_transfer", "mobile_money"].map((method) => (
                  <div key={method} className="flex items-center gap-2">
                    <Checkbox
                      id={`method-${method}`}
                      checked={paymentMethodFilter.includes(method)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPaymentMethodFilter([...paymentMethodFilter, method]);
                        } else {
                          setPaymentMethodFilter(paymentMethodFilter.filter((m) => m !== method));
                        }
                      }}
                    />
                    <Label htmlFor={`method-${method}`} className="capitalize">
                      {method.replace('_', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label>Amount Range ({currency})</Label>
              <Slider
                value={amountRange}
                min={0}
                max={1000}
                step={10}
                onValueChange={value => setAmountRange([value[0], value[1]])}
                className="mt-2"
              />
              <div className="flex justify-between text-xs mt-1">
                <span>{currency} {amountRange[0]}</span>
                <span>{currency} {amountRange[1]}</span>
              </div>
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label>Customer</Label>
              <Input
                placeholder="Search by customer name"
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetFilters}>Reset</Button>
            <Button onClick={() => {
              applyFilters();
              setIsFiltersOpen(false);
            }}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedTransaction && (
            <>
              <DialogTitle className="flex items-center justify-between">
                <span>Transaction Details</span>
                <div>{getStatusBadge(selectedTransaction.status)}</div>
              </DialogTitle>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="customer">Customer</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID</p>
                      <p className="text-sm font-mono text-gray-900 dark:text-gray-100">{selectedTransaction.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">{formatDate(selectedTransaction.createdAt || selectedTransaction.created || selectedTransaction.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fee</p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">{formatCurrency(selectedTransaction.fee || 0, selectedTransaction.currency)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</p>
                      <div className="flex items-center gap-2 text-sm">
                        {getPaymentMethodIcon(selectedTransaction.paymentMethod)}
                        <span className="capitalize text-gray-900 dark:text-gray-100">{selectedTransaction.paymentMethod.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">{selectedTransaction.description}</p>
                    </div>
                    {selectedTransaction.paymentMethod === "card" && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Card Brand</p>
                          <p className="text-sm capitalize text-gray-900 dark:text-gray-100">{selectedTransaction.cardBrand}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last 4</p>
                          <p className="text-sm text-gray-900 dark:text-gray-100">•••• {selectedTransaction.last4}</p>
                        </div>
                      </>
                    )}
                    {selectedTransaction.paymentMethod === "bank_transfer" && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bank</p>
                        <p className="text-sm text-gray-900 dark:text-gray-100">{selectedTransaction.bankName}</p>
                      </div>
                    )}
                    {selectedTransaction.paymentMethod === "mobile_money" && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Provider</p>
                          <p className="text-sm text-gray-900 dark:text-gray-100">{selectedTransaction.provider}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="text-sm text-gray-900 dark:text-gray-100">{selectedTransaction.phoneNumber}</p>
                        </div>
                      </>
                    )}
                    {selectedTransaction.status === "failed" && selectedTransaction.failureReason && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Failure Reason</p>
                        <p className="text-sm text-red-600 dark:text-red-400">{selectedTransaction.failureReason}</p>
                      </div>
                    )}
                    {selectedTransaction.status === "refunded" && selectedTransaction.refundReason && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Refund Reason</p>
                        <p className="text-sm text-gray-900 dark:text-gray-100">{selectedTransaction.refundReason}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="customer" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">{selectedTransaction.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">{selectedTransaction.email}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <div className="flex gap-2">
                  {selectedTransaction.status === "succeeded" && (
                    <Button variant="destructive" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      <span>Refund</span>
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Receipt</span>
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
