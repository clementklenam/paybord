import {useState, useEffect} from "react";
import {DashboardLayout} from "@/components/dashboard/DashboardLayout";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useToast} from "@/components/ui/use-toast";
import {usePaymentContext} from "@/contexts/PaymentContext";
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
  ArrowRight
} from "lucide-react";

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
  const { subscribeToPaymentEvents } = usePaymentContext();
  
  // Initialize transaction service
  const transactionService = new TransactionService();
  
  // Fetch transactions when filters change
  useEffect(() => {
    fetchTransactions();
  }, [currentPage, itemsPerPage]);
  
  // Subscribe to payment events to refresh transaction data
  useEffect(() => {
    const unsubscribe = subscribeToPaymentEvents(() => {
      console.log('[TransactionsPage] Payment event received, refreshing transactions...');
      fetchTransactions();
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
            console.log('[TransactionsPage] Found recent payment event during periodic check, refreshing transactions...');
            fetchTransactions();
            localStorage.removeItem('paymesa_payment_event');
          }
        }
      } catch (error) {
        console.error('[TransactionsPage] Error in periodic payment check:', error);
      }
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [subscribeToPaymentEvents]);
  
  // Function to fetch transactions
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      
      // Prepare filters
      const filters: TransactionFilters = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        status: statusFilter,
        paymentMethod: paymentMethodFilter,
        amountMin: amountRange[0],
        amountMax: amountRange[1],
        customer: customerFilter
      };
      
      // Fetch transactions
      const response = await transactionService.getTransactions(filters);
      
      // Update state with fetched data
      setTransactions(response.data);
      setTotalTransactions(response.pagination.total);
      setTotalPages(response.pagination.pages);
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error loading transactions",
        description: "There was a problem loading your transactions. Please try again later.",
        variant: "destructive"
      });
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
    setCurrentPage(1);
    fetchTransactions();
  };

  // Calculate transaction statistics
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const successfulTransactions = transactions.filter(t => t.status === "succeeded");
  const successfulVolume = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
  const failedTransactions = transactions.filter(t => t.status === "failed");
  const refundedTransactions = transactions.filter(t => t.status === "refunded");
  const refundedVolume = refundedTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Get the currency from the first transaction or default to GHS
  const currency = transactions.length > 0 ? transactions[0].currency : 'GHS';

  // Format currency
  const formatCurrency = (amount: number, currency: string = "GHS") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) + ' · ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Succeeded</span>
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-rose-100 text-rose-800 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Failed</span>
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            <span>Refunded</span>
          </Badge>
        );
      case "disputed":
        return (
          <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Disputed</span>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            {status}
          </Badge>
        );
    }
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4 text-gray-500" />;
      case "bank_transfer":
        return <Building className="h-4 w-4 text-gray-500" />;
      case "mobile_money":
        return <Smartphone className="h-4 w-4 text-gray-500" />;
      default:
        return <Wallet className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Transactions</h1>
          <p className="text-gray-500 mt-1">View and manage your payment transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-2" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Transaction Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalVolume, currency)}</div>
            <p className="text-xs text-gray-500 mt-1">{transactions.length} transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(successfulVolume, currency)}</div>
            <p className="text-xs text-gray-500 mt-1">{successfulTransactions.length} transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedTransactions.length}</div>
            <p className="text-xs text-gray-500 mt-1">transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Refunded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(refundedVolume, currency)}</div>
            <p className="text-xs text-gray-500 mt-1">{refundedTransactions.length} transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[300px]"
              />
              <Button variant="outline" size="icon" onClick={applyFilters}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
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
              <Button variant="outline" onClick={() => setIsFiltersOpen(true)}>
                <Filter className="h-4 w-4 mr-2" />
                <span>Filters</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(transaction.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatDate(transaction.date)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-gray-500">{transaction.customer}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(transaction.paymentMethod)}
                        <span className="capitalize">{transaction.paymentMethod.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(transaction.amount, transaction.currency)}</div>
                      <div className="text-sm text-gray-500">Fee: {formatCurrency(transaction.fee, transaction.currency)}</div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => viewTransactionDetails(transaction.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="10 per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{transactions.length}</span> of{" "}
                <span className="font-medium">{totalTransactions}</span> transactions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1 || isLoading}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronDown className="h-4 w-4 rotate-90" />
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || isLoading}
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
                onValueChange={setAmountRange}
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
                      <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                      <p className="text-sm font-mono">{selectedTransaction.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="text-sm">{formatDate(selectedTransaction.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Amount</p>
                      <p className="text-sm font-bold">{formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fee</p>
                      <p className="text-sm">{formatCurrency(selectedTransaction.fee, selectedTransaction.currency)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Payment Method</p>
                      <div className="flex items-center gap-2 text-sm">
                        {getPaymentMethodIcon(selectedTransaction.paymentMethod)}
                        <span className="capitalize">{selectedTransaction.paymentMethod.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p className="text-sm">{selectedTransaction.description}</p>
                    </div>
                    {selectedTransaction.paymentMethod === "card" && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Card Brand</p>
                          <p className="text-sm capitalize">{selectedTransaction.cardBrand}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Last 4</p>
                          <p className="text-sm">•••• {selectedTransaction.last4}</p>
                        </div>
                      </>
                    )}
                    {selectedTransaction.paymentMethod === "bank_transfer" && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Bank</p>
                        <p className="text-sm">{selectedTransaction.bankName}</p>
                      </div>
                    )}
                    {selectedTransaction.paymentMethod === "mobile_money" && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Provider</p>
                          <p className="text-sm">{selectedTransaction.provider}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Phone</p>
                          <p className="text-sm">{selectedTransaction.phoneNumber}</p>
                        </div>
                      </>
                    )}
                    {selectedTransaction.status === "failed" && selectedTransaction.failureReason && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500">Failure Reason</p>
                        <p className="text-sm text-rose-600">{selectedTransaction.failureReason}</p>
                      </div>
                    )}
                    {selectedTransaction.status === "refunded" && selectedTransaction.refundReason && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500">Refund Reason</p>
                        <p className="text-sm">{selectedTransaction.refundReason}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="customer" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Customer</p>
                      <p className="text-sm">{selectedTransaction.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm">{selectedTransaction.email}</p>
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
