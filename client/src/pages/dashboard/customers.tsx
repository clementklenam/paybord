import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { CustomerForm } from "@/components/customers/CustomerForm";
import CustomerService, { Customer, CustomerFilters, CustomerCreationData } from "@/services/customer.service";
import BusinessService from '@/services/business.service';
import { 
  Search, 
  Download, 
  Filter, 
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Building,
  Globe,
  Clock
} from "lucide-react";
import { safeRender, sanitizeArray } from "@/utils/safeRender";

// Main Customers Page Component
export default function CustomersPage() {
  const { toast } = useToast();
  const customerService = new CustomerService();
  const businessService = new BusinessService();

  // State for businessId
  const [businessId, setBusinessId] = useState<string | null>(null);

  // State for customers data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isExporting, setIsExporting] = useState(false);
  
  // Customer detail state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Customer creation state
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  
  // Fetch businessId on mount
  useEffect(() => {
    async function fetchBusinessId() {
      try {
        const business = await businessService.getBusinessProfile();
        
        // Sanitize the business profile to prevent React errors
        const sanitizedBusiness = {
          _id: safeRender(business._id),
          businessName: safeRender(business.businessName),
          businessType: safeRender(business.businessType),
          registrationNumber: safeRender(business.registrationNumber),
          taxId: safeRender(business.taxId),
          industry: safeRender(business.industry),
          website: safeRender(business.website),
          email: safeRender(business.email),
          phone: safeRender(business.phone),
          currency: safeRender(business.currency)
        };
        
        setBusinessId(sanitizedBusiness._id);
      } catch (err) {
        setBusinessId(null);
      }
    }
    fetchBusinessId();
  }, []);

  // Fetch customers data
  const fetchCustomers = async () => {
    if (!businessId) return;
    setIsLoading(true);
    setError(null);
    try {
      const customers = await customerService.getCustomersByBusiness(businessId);
      
      // Sanitize customers to prevent React errors
      const sanitizedCustomers = sanitizeArray(customers);
      console.log('Sanitized customers:', sanitizedCustomers);
      
      setCustomers(sanitizedCustomers as Customer[]);
      setTotalItems(customers.length);
      setTotalPages(1);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers. Please try again.');
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (businessId) fetchCustomers();
  }, [businessId]);
  
  // Effect to apply filters when they change
  useEffect(() => {
    if (statusFilter || countryFilter || Object.keys(dateRange).length > 0 || 
        sortBy !== "createdAt" || sortOrder !== "desc") {
      fetchCustomers();
    }
  }, [statusFilter, countryFilter, dateRange, sortBy, sortOrder]);
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchCustomers();
  };
  

  
  // Handle reset filters
  const handleResetFilters = () => {
    setStatusFilter("");
    setCountryFilter("");
    setDateRange({});
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
    fetchCustomers();
  };
  
  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Prepare filters for export
      const exportFilters: CustomerFilters = {
        search: searchQuery || undefined,
        status: statusFilter || undefined,
        country: countryFilter || undefined,
        dateRange: Object.keys(dateRange).length > 0 ? dateRange : undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder
      };
      
      // Get CSV content
      const csvContent = await customerService.exportCustomers(exportFilters);
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `customers-export-${new Date().toISOString().split('T')[0]}.csv`);
      
      // Append to document, click, and remove
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Export Successful",
        description: "Your customer data has been exported to CSV.",
        variant: "default",
      });
    } catch (err) {
      console.error('Error exporting customers:', err);
      toast({
        title: "Export Failed",
        description: "There was a problem exporting your customer data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Handle date range selection
  const handleDateRangeChange = (type: "startDate" | "endDate", value: string) => {
    setDateRange(prev => {
      const newDateRange = { ...prev };
      if (value) {
        newDateRange[type] = value;
      } else {
        delete newDateRange[type];
      }
      return newDateRange;
    });
    setCurrentPage(1); // Reset to first page when changing date range
  };
  
  // Handle customer creation
  const handleCreateCustomer = async (data: CustomerCreationData) => {
    setIsCreatingCustomer(true);
    try {
      if (!businessId) {
        throw new Error('Business ID is required to create a customer');
      }
      
      // Add businessId to the customer data
      const customerData = {
        ...data,
        businessId: businessId
      };
      
      const newCustomer = await customerService.createCustomer(customerData);
      setIsCreateCustomerOpen(false);
      fetchCustomers();
      toast({
        title: "Customer Created",
        description: `${newCustomer.name} has been successfully added.`,
        variant: "default",
      });
    } catch (err) {
      console.error('Error creating customer:', err);
      toast({
        title: "Error Creating Customer",
        description: err instanceof Error ? err.message : "There was a problem creating the customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingCustomer(false);
    }
  };
  
  // Handle customer view
  const handleViewCustomer = async (customerId: string) => {
    try {
      const customer = await customerService.getCustomerById(customerId);
      setSelectedCustomer(customer);
      setIsDetailsOpen(true);
    } catch (err) {
      console.error('Error fetching customer details:', err);
      toast({
        title: "Error Loading Customer",
        description: "There was a problem loading the customer details. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsCreateCustomerOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            <span>Add Customer</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input 
            placeholder="Search customers..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <Button variant="outline" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
          <Filter className="h-4 w-4 mr-2" />
          <span>Filters</span>
          {(statusFilter || countryFilter || Object.keys(dateRange).length > 0) && (
            <span className="ml-1 flex h-2 w-2 rounded-full bg-primary"></span>
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={handleExport} 
          disabled={isExporting}
        >
          {isExporting ? (
            <span className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-b-2 rounded-full border-primary"></div>
              <span>Exporting...</span>
            </span>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              <span>Export</span>
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters Panel */}
          {isFiltersOpen && (
            <div className="border rounded-lg p-4 mb-4 bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Status</h3>
                  <Select value={statusFilter} onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1); // Reset to first page when filtering
                    fetchCustomers();
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Country</h3>
                  <Select value={countryFilter} onValueChange={(value) => {
                    setCountryFilter(value);
                    setCurrentPage(1); // Reset to first page when filtering
                    fetchCustomers();
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="All countries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All countries</SelectItem>
                      <SelectItem value="Ghana">Ghana</SelectItem>
                      <SelectItem value="Nigeria">Nigeria</SelectItem>
                      <SelectItem value="Kenya">Kenya</SelectItem>
                      <SelectItem value="South Africa">South Africa</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Date Range</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        type="date"
                        value={dateRange.startDate || ''}
                        onChange={(e) => {
                          handleDateRangeChange('startDate', e.target.value);
                          fetchCustomers();
                        }}
                        placeholder="Start date"
                      />
                    </div>
                    <div>
                      <Input
                        type="date"
                        value={dateRange.endDate || ''}
                        onChange={(e) => {
                          handleDateRangeChange('endDate', e.target.value);
                          fetchCustomers();
                        }}
                        placeholder="End date"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Sort By</h3>
                  <Select value={sortBy} onValueChange={(value) => {
                    setSortBy(value);
                    setCurrentPage(1); // Reset to first page when sorting
                    fetchCustomers();
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="createdAt">Created Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Sort Order</h3>
                  <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => {
                    setSortOrder(value);
                    setCurrentPage(1); // Reset to first page when changing sort order
                    fetchCustomers();
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end justify-end">
                  <Button 
                    variant="outline" 
                    onClick={handleResetFilters}
                    className="h-9"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={fetchCustomers}
              >
                Try Again
              </Button>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No customers found</p>
              <Button 
                onClick={() => setIsCreateCustomerOpen(true)}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>Add Your First Customer</span>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer._id || customer.customerId}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {safeRender(customer.name && typeof customer.name === 'string' ? customer.name.split(' ').map(n => n[0]).join('') : customer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{safeRender(customer.name)}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">
                            {safeRender(customer.description || 'No description')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-gray-500" />
                        <span>{safeRender(customer.email)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-gray-500" />
                        <span>{safeRender(customer.phone || 'N/A')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {safeRender(formatDate(customer.createdAt))}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCustomer(customer._id || customer.customerId);
                          }}
                          title="View details"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && !error && customers.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} customers
              </div>
              <div className="flex items-center gap-2">
                <Select 
                  value={String(itemsPerPage)}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="10 per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="25">25 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                    <SelectItem value="100">100 per page</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Customer Creation Dialog */}
      <Dialog open={isCreateCustomerOpen} onOpenChange={setIsCreateCustomerOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Fill in the customer details below to create a new customer account.  
            </DialogDescription>
          </DialogHeader>
          
          <CustomerForm 
            onSubmit={handleCreateCustomer} 
            onCancel={() => setIsCreateCustomerOpen(false)}
            isLoading={isCreatingCustomer}
          />
        </DialogContent>
      </Dialog>
      
      {/* Customer Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-xl">{selectedCustomer.name}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{selectedCustomer.email}</span>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="mt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="addresses">Addresses</TabsTrigger>
                    <TabsTrigger value="payment">Payment Methods</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span>{selectedCustomer.email}</span>
                          </div>
                          {selectedCustomer.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span>{selectedCustomer.phone}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Account Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>Created on {formatDate(selectedCustomer.createdAt)}</span>
                          </div>
                          {selectedCustomer.metadata?.timezone && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>Timezone: {selectedCustomer.metadata.timezone}</span>
                            </div>
                          )}
                          {selectedCustomer.metadata?.language && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-gray-500" />
                              <span>Language: {selectedCustomer.metadata?.language || ''}</span>
                            </div>
                          )}
                          {selectedCustomer.metadata?.currency && (
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-gray-500" />
                              <span>Currency: {selectedCustomer.metadata.currency}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                    
                    {selectedCustomer.description && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">{selectedCustomer.description}</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="addresses" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Billing Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedCustomer.billingAddress ? (
                            <div className="space-y-1 text-sm">
                              <p>{selectedCustomer.billingAddress.line1}</p>
                              {selectedCustomer.billingAddress.line2 && (
                                <p>{selectedCustomer.billingAddress.line2}</p>
                              )}
                              <p>
                                {selectedCustomer.billingAddress.city}, {selectedCustomer.billingAddress.state} {selectedCustomer.billingAddress.postalCode}
                              </p>
                              <p>{selectedCustomer.billingAddress.country}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No billing address provided</p>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedCustomer.shippingAddress ? (
                            <div className="space-y-1 text-sm">
                              <p>{selectedCustomer.shippingAddress.line1}</p>
                              {selectedCustomer.shippingAddress.line2 && (
                                <p>{selectedCustomer.shippingAddress.line2}</p>
                              )}
                              <p>
                                {selectedCustomer.shippingAddress.city}, {selectedCustomer.shippingAddress.state} {selectedCustomer.shippingAddress.postalCode}
                              </p>
                              <p>{selectedCustomer.shippingAddress.country}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No shipping address provided</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="payment" className="mt-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedCustomer.paymentMethods && selectedCustomer.paymentMethods.length > 0 ? (
                          <div className="space-y-3">
                            {selectedCustomer.paymentMethods.map((method) => (
                              <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-full bg-gray-100">
                                    {method.type === 'card' ? (
                                      <CreditCard className="h-5 w-5 text-gray-600" />
                                    ) : (
                                      <Building className="h-5 w-5 text-gray-600" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {method.type === 'card' 
                                        ? `${method.details && typeof method.details === 'object' ? (method.details as any).brand || 'Card' : 'Card'} ending in ${method.details && typeof method.details === 'object' ? (method.details as any).last4 || '****' : '****'}` 
                                        : method.type === 'bank_account'
                                          ? `${method.details && typeof method.details === 'object' ? (method.details as any).bankName || 'Bank' : 'Bank'} (${method.details && typeof method.details === 'object' ? (method.details as any).accountType || 'Account' : 'Account'})`
                                          : 'Wallet'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {method.type === 'card' 
                                        ? `Expires ${method.details && typeof method.details === 'object' ? (method.details as any).expMonth || 'MM' : 'MM'}/${method.details && typeof method.details === 'object' ? (method.details as any).expYear || 'YY' : 'YY'}` 
                                        : method.type === 'bank_account'
                                          ? `Account ${method.details && typeof method.details === 'object' ? (method.details as any).accountNumber || '****' : '****'}`
                                          : method.details && typeof method.details === 'object' ? (method.details as any).provider || 'Provider' : 'Provider'}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  {method.isDefault && (
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                      Default
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <div className="mb-3">
                              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                <CreditCard className="h-6 w-6 text-gray-400" />
                              </div>
                            </div>
                            <h3 className="text-sm font-medium mb-1">No payment methods</h3>
                            <p className="text-xs text-gray-500 mb-4">This customer doesn't have any payment methods saved.</p>
                            <Button size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              <span>Add payment method</span>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              <DialogFooter className="mt-6">
                <div className="flex justify-between w-full">
                  <Button variant="outline" size="sm" onClick={() => setIsDetailsOpen(false)}>
                    Close
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      <span>Edit</span>
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
