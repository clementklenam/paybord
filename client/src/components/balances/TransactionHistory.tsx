import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  CreditCard,
  Wallet,
  Activity,
  RotateCcw,
  Filter
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  created: string;
  description: string;
  transactionId?: string;
  _id?: string;
  paymentType?: string;
  storefrontName?: string;
  paymentLinkTitle?: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  currency: string;
}

export function TransactionHistory({ transactions, currency }: TransactionHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 15;
  
  // Filter transactions based on selected filter and search term
  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = selectedFilter === "all" || transaction.type === selectedFilter;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "available":
      case "complete":
      case "success":
      case "succeeded":
        return {
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          label: "Completed"
        };
      case "pending":
        return {
          color: "text-yellow-600 dark:text-yellow-400",
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          label: "Pending"
        };
      case "needs_response":
      case "dispute":
        return {
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          label: "Needs Action"
        };
      case "failed":
      case "cancelled":
        return {
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-800",
          label: "Failed"
        };
      default:
        return {
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-800",
          label: status.replace("_", " ")
        };
    }
  };
  
  const getTypeConfig = (type: string, amount: number) => {
    const isIncoming = amount > 0;
    
    switch (type) {
      case "charge":
        return {
          icon: isIncoming ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />,
          color: isIncoming ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
          label: isIncoming ? "Payment Received" : "Payment Sent"
        };
      case "payout":
        return {
          icon: <Wallet className="h-4 w-4" />,
          color: "text-blue-600 dark:text-blue-400",
          label: "Payout"
        };
      case "refund":
        return {
          icon: <RotateCcw className="h-4 w-4" />,
          color: "text-yellow-600 dark:text-yellow-400",
          label: "Refund"
        };
      case "dispute":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: "text-red-600 dark:text-red-400",
          label: "Dispute"
        };
      default:
        return {
          icon: <Activity className="h-4 w-4" />,
          color: "text-gray-600 dark:text-gray-400",
          label: type.charAt(0).toUpperCase() + type.slice(1)
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const transactionTypes = ["all", "charge", "payout", "refund", "dispute"];

  // Calculate summary stats
  const totalIncoming = transactions
    .filter(t => t.amount > 0 && (t.status === "success" || t.status === "succeeded"))
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalOutgoing = Math.abs(
    transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );
  
  const netChange = transactions.reduce((sum, t) => sum + t.amount, 0);
  
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Incoming</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(totalIncoming, currency)}
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Outgoing</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(totalOutgoing, currency)}
              </p>
            </div>
            <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Net Change</p>
              <p className={`text-xl font-semibold ${netChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {netChange >= 0 ? '+' : ''}{formatCurrency(netChange, currency)}
              </p>
            </div>
            {netChange >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            {transactionTypes.map((type) => (
              <Button
                key={type}
                variant={selectedFilter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(type)}
                className="capitalize"
              >
                {type === "all" ? "All" : type}
              </Button>
            ))}
          </div>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Transaction History</h2>
        </div>
        
        {paginatedTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">No transactions found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || selectedFilter !== "all" 
                ? "Try adjusting your search or filters" 
                : "No transactions available yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Source Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedTransactions.map((transaction) => {
                  const statusConfig = getStatusConfig(transaction.status);
                  const typeConfig = getTypeConfig(transaction.type, transaction.amount);
                  const isIncoming = transaction.amount > 0;
                  let source = "Other";
                  let sourceName = "-";
                  if (transaction.paymentType === "storefront_purchase") {
                    source = "Storefront";
                    sourceName = transaction.storefrontName || "-";
                  } else if (transaction.paymentType === "payment_link") {
                    source = "Payment Link";
                    sourceName = transaction.paymentLinkTitle || "-";
                  }
                  return (
                    <tr key={transaction.id || transaction.transactionId || transaction._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {transaction.description || "No description"}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                            {transaction.transactionId || transaction.id || transaction._id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`mr-2 ${typeConfig.color}`}>
                            {typeConfig.icon}
                          </div>
                          <span className="text-sm text-gray-900 dark:text-gray-100">{typeConfig.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <div>
                          <div>{formatDate(transaction.created)}</div>
                          <div className="text-gray-500 dark:text-gray-400">{formatTime(transaction.created)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {sourceName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          <span className={isIncoming ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {isIncoming ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount), currency)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
