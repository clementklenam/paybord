import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { 
  Download, 
  Search, 
  Filter,
  Eye,
  Receipt,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar
} from "lucide-react";
import {useState} from "react";

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  description: string;
  pdfUrl?: string;
}

interface InvoiceListProps {
  invoices: Invoice[];
  onDownload?: (invoice: Invoice) => void;
  onView?: (invoice: Invoice) => void;
}

export function InvoiceList({ invoices, onDownload, onView }: InvoiceListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'overdue': return <AlertCircle className="h-3 w-3" />;
      case 'cancelled': return <AlertCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const filteredInvoices = invoices
    .filter(invoice => {
      const matchesSearch = 
        invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "amount":
          return b.amount - a.amount;
        case "number":
          return a.number.localeCompare(b.number);
        default:
          return 0;
      }
    });

  const handleDownload = (invoice: Invoice) => {
    if (onDownload) {
      onDownload(invoice);
    } else if (invoice.pdfUrl) {
      window.open(invoice.pdfUrl, '_blank');
    }
  };

  return (
    <Card className="border-0 shadow-sm dark:bg-gray-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Invoice History</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {filteredInvoices.length} invoices found
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] h-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-900 dark:text-gray-100">
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="number">Invoice #</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search invoices..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-900 dark:text-gray-100">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 dark:border-gray-700">
                <TableHead className="text-gray-900 dark:text-gray-100">Invoice #</TableHead>
                <TableHead className="text-gray-900 dark:text-gray-100">Date</TableHead>
                <TableHead className="text-gray-900 dark:text-gray-100">Due Date</TableHead>
                <TableHead className="text-gray-900 dark:text-gray-100">Amount</TableHead>
                <TableHead className="text-gray-900 dark:text-gray-100">Status</TableHead>
                <TableHead className="text-gray-900 dark:text-gray-100">Description</TableHead>
                <TableHead className="text-gray-900 dark:text-gray-100">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-gray-200 dark:border-gray-700">
                  <TableCell>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {invoice.number}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(invoice.date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(invoice.dueDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      {getStatusIcon(invoice.status)}
                      <span className="ml-1">{invoice.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                      {invoice.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {onView && (
                        <Button variant="ghost" size="sm" onClick={() => onView(invoice)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDownload(invoice)}
                        disabled={!invoice.pdfUrl && !onDownload}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Empty State */}
        {filteredInvoices.length === 0 && (
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No invoices found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filters" 
                : "No invoices have been generated yet"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 