import { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Mail, 
  MoreHorizontal, 
  ArrowUpDown,
  DollarSign
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for customers
const customers = [
  {
    id: "cus_123456",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+2349012345678",
    country: "Nigeria",
    status: "active",
    spent: 1256.78,
    transactions: 8,
    created: "2025-01-15T10:30:00",
    lastActive: "2025-05-07T14:22:35"
  },
  {
    id: "cus_234567",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+254712345678",
    country: "Kenya",
    status: "active",
    spent: 3421.45,
    transactions: 12,
    created: "2025-02-10T08:15:22",
    lastActive: "2025-05-09T09:16:08"
  },
  {
    id: "cus_345678",
    name: "Michael Adeyemi",
    email: "michael.a@example.com",
    phone: "+2347012345678",
    country: "Nigeria",
    status: "inactive",
    spent: 845.20,
    transactions: 4,
    created: "2025-03-05T16:45:11",
    lastActive: "2025-04-12T11:30:42"
  },
  {
    id: "cus_456789",
    name: "Grace Mensah",
    email: "grace.m@example.com",
    phone: "+233201234567",
    country: "Ghana",
    status: "active",
    spent: 2105.99,
    transactions: 9,
    created: "2025-02-28T14:22:33",
    lastActive: "2025-05-08T18:05:17"
  },
  {
    id: "cus_567890",
    name: "David Nkosi",
    email: "david.n@example.com",
    phone: "+27812345678",
    country: "South Africa",
    status: "active",
    spent: 5678.34,
    transactions: 15,
    created: "2025-01-05T09:10:45",
    lastActive: "2025-05-09T12:45:30"
  },
  {
    id: "cus_678901",
    name: "Rebecca Osei",
    email: "rebecca.o@example.com",
    phone: "+233241234567",
    country: "Ghana",
    status: "inactive",
    spent: 125.50,
    transactions: 2,
    created: "2025-04-18T11:33:27",
    lastActive: "2025-04-25T13:22:08"
  }
];

// Summary stats
const customerStats = {
  totalCustomers: 842,
  activeCustomers: 695,
  inactiveCustomers: 147,
  avgLifetimeValue: 1856.42,
  newThisMonth: 58,
  retentionRate: 93.5
};

export function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("lastActive");
  const [sortDirection, setSortDirection] = useState("desc");
  
  // Filter customers based on search and status
  const filteredCustomers = customers.filter((customer) => {
    // Search filter
    if (
      searchQuery &&
      !customer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !customer.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !customer.phone.includes(searchQuery)
    ) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== "all" && customer.status !== statusFilter) {
      return false;
    }
    
    return true;
  });
  
  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (sortField === "spent") {
      return sortDirection === "asc"
        ? a.spent - b.spent
        : b.spent - a.spent;
    }
    if (sortField === "transactions") {
      return sortDirection === "asc"
        ? a.transactions - b.transactions
        : b.transactions - a.transactions;
    }
    if (sortField === "lastActive") {
      return sortDirection === "asc"
        ? new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime()
        : new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
    }
    return 0;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part: string) => part[0])
      .join("")
      .toUpperCase();
  };
  
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-gray-500">
            Manage and analyze customer data across Africa
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-600"
          >
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button className="bg-[#1e8449] hover:bg-[#196f3d]">
            <Plus className="h-4 w-4 mr-1" /> Add Customer
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
        <Card className="bg-gradient-to-br from-gray-50/50 to-gray-100/30 hover:from-gray-100/50 hover:to-gray-200/40 transition-all border-gray-200 hover:border-gray-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900">{customerStats.totalCustomers}</h3>
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm">
              <Badge className="bg-gray-100 text-gray-700">+{customerStats.newThisMonth} this month</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50/50 to-gray-100/30 hover:from-gray-100/50 hover:to-gray-200/40 transition-all border-gray-200 hover:border-gray-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Lifetime Value</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900">${customerStats.avgLifetimeValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-gray-500">
              Based on all customer transactions
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50/50 to-gray-100/30 hover:from-gray-100/50 hover:to-gray-200/40 transition-all border-gray-200 hover:border-gray-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Retention Rate</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900">{customerStats.retentionRate}%</h3>
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                <RefreshCcw className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <div className="mt-3 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-600 rounded-full"
                style={{ width: `${customerStats.retentionRate}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Customers Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <CardTitle className="text-lg">Customer Management</CardTitle>
            <div className="mt-2 sm:mt-0 flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search customers..."
                  className="pl-8 w-full sm:w-64 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px] h-9">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Status</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-3 pl-4 font-medium text-gray-500">Customer</th>
                  <th className="pb-3 font-medium text-gray-500">Location</th>
                  <th 
                    className="pb-3 font-medium text-gray-500 cursor-pointer"
                    onClick={() => toggleSort("spent")}
                  >
                    <div className="flex items-center gap-1">
                      Total Spent
                      {sortField === "spent" && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="pb-3 font-medium text-gray-500 cursor-pointer"
                    onClick={() => toggleSort("transactions")}
                  >
                    <div className="flex items-center gap-1">
                      Transactions
                      {sortField === "transactions" && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="pb-3 font-medium text-gray-500 cursor-pointer"
                    onClick={() => toggleSort("lastActive")}
                  >
                    <div className="flex items-center gap-1">
                      Last Active
                      {sortField === "lastActive" && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th className="pb-3 font-medium text-gray-500">Status</th>
                  <th className="pb-3 font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {sortedCustomers.map((customer, index) => (
                  <tr 
                    key={customer.id} 
                    className={`hover:bg-gray-50 ${
                      index !== sortedCustomers.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <td className="py-3 pl-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}`} alt={customer.name} />
                          <AvatarFallback className="bg-[#1e8449]/10 text-[#1e8449]">
                            {getInitials(customer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-gray-500">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className="font-normal">
                        {customer.country}
                      </Badge>
                    </td>
                    <td className="py-3 text-gray-900 font-medium">
                      ${customer.spent.toFixed(2)}
                    </td>
                    <td className="py-3 text-gray-900">
                      {customer.transactions}
                    </td>
                    <td className="py-3 text-gray-500">
                      {formatDate(customer.lastActive)}
                    </td>
                    <td className="py-3">
                      <Badge className={`
                        ${customer.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                        ${customer.status === "inactive" ? "bg-gray-100 text-gray-800 hover:bg-gray-100" : ""}
                      `}>
                        {customer.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <User className="h-4 w-4 mr-2" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <ShoppingCart className="h-4 w-4 mr-2" /> View Transactions
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Mail className="h-4 w-4 mr-2" /> Email Customer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                            <Trash className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No customers found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {sortedCustomers.length} of {customers.length} customers
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-gray-300" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 bg-gray-50 font-medium">
                1
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300">
                2
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Customer Growth */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Growth</CardTitle>
            <CardDescription>
              New customer acquisition over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-end justify-between">
              {/* Mock bar chart - this would be replaced with a real chart component */}
              {[35, 42, 53, 49, 61, 58, 65, 73, 68, 75, 82, 93].map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                    style={{ height: `${value * 2}px` }}
                  ></div>
                  <span className="text-xs mt-2 text-gray-500">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// Icons that need to be imported
const Users = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const RefreshCcw = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 2v6h6" />
    <path d="M21 12A9 9 0 0 0 6 5.3L3 8" />
    <path d="M21 22v-6h-6" />
    <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
  </svg>
);

const User = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ShoppingCart = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const Trash = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);
