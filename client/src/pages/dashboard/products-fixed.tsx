import {useState} from "react";
import {DashboardLayout} from "@/components/dashboard/DashboardLayout";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Plus, Download, Search, Filter, Package, MoreHorizontal, ChevronDown} from "lucide-react";

export default function ProductsPage() {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Mock data
  const products = [
    { 
      id: "prod_1K2OnjL", 
      name: "Basic Plan",
      description: "Essential features for small businesses",
      image: "/placeholder-product.jpg",
      pricingType: "recurring", 
      amount: 49.99, 
      billingPeriod: "monthly",
      created: "2025-03-15T14:23:45Z", 
      updated: "2025-05-02T10:15:30Z",
      status: "active"
    },
    { 
      id: "prod_1K2MkiP", 
      name: "Premium Plan",
      description: "Advanced features with priority support",
      image: "/placeholder-product.jpg",
      pricingType: "recurring", 
      amount: 99.99, 
      billingPeriod: "monthly",
      created: "2025-02-18T10:15:30Z", 
      updated: "2025-04-28T09:45:12Z",
      status: "active"
    }
  ];

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getBillingPeriodText = (period: string | null) => {
    if (!period) return "";
    
    switch (period) {
      case "monthly": return "Monthly";
      case "yearly": return "Yearly";
      default: return period.charAt(0).toUpperCase() + period.slice(1);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Product Catalog</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your products and services
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-2" />
            <span>Export</span>
          </Button>
          <Button size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-2" />
            <span>Add product</span>
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Products</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Products Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Product</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow 
                  key={product.id}
                  className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">{product.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {formatCurrency(product.amount)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.pricingType === "recurring" ? 
                        `${getBillingPeriodText(product.billingPeriod)}` : 
                        "One-time payment"}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(product.created)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(product.updated)}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
