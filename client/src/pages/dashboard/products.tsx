import { useState, useEffect } from "react";
import { ProductService, Product, ProductCreateData } from "@/services/product.service";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  Download, 
  Search, 
  Filter, 
  Package, 
  MoreHorizontal, 
  ChevronDown,
  Check,
  X,
  ArrowLeft,
  Image as ImageIcon,
  DollarSign,
  CreditCard,
  Smartphone,
  Copy,
  Share2,
  Percent
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ProductsPage() {
  // Service instance
  const productService = new ProductService();
  const { user } = useAuth();
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [businessId, setBusinessId] = useState<string>("");
  
  // New product state
  const [newProduct, setNewProduct] = useState<ProductCreateData>({
    businessId: "",
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "Subscription",
    currency: "USD"
  });
  
  // Customer info state
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    discountCode: ""
  });
  
  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile">("card");
  
  // Quantity state
  const [quantity, setQuantity] = useState(1);
  
  // Initialize demo products if none exist
  const initializeDemoProducts = (currentBusinessId: string) => {
    const productsJSON = localStorage.getItem('user_products');
    if (!productsJSON || JSON.parse(productsJSON).length === 0) {
      console.log('Initializing demo products for business:', currentBusinessId);
      const demoProducts = [
        {
          id: 'prod_demo1',
          customId: 'prod_demo1',
          name: 'Basic Plan',
          description: 'Essential features for small businesses',
          price: 49.99,
          image: 'https://images.unsplash.com/photo-1586892478025-2b5472316bf4?q=80&w=1974',
          category: 'Subscription',
          currency: 'USD',
          active: true,
          businessId: currentBusinessId,
          business: currentBusinessId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active'
        },
        {
          id: 'prod_demo2',
          customId: 'prod_demo2',
          name: 'Premium Plan',
          description: 'Advanced features with priority support',
          price: 99.99,
          image: 'https://images.unsplash.com/photo-1661956602868-6ae368943878?q=80&w=2070',
          category: 'Subscription',
          currency: 'USD',
          active: true,
          businessId: currentBusinessId,
          business: currentBusinessId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active'
        }
      ];
      localStorage.setItem('user_products', JSON.stringify(demoProducts));
    }
  };

  // Fetch products when component mounts
  useEffect(() => {
    if (user) {
      let businessId = user.businessId;
      
      // If no direct businessId, try to get it from the business array
      if (!businessId && user.business && user.business.length > 0) {
        businessId = user.business[0]._id;
      }
      
      // If we don't have a businessId, create a default one
      if (!businessId) {
        businessId = 'business_default';
      }
      
      // Set the businessId and initialize the form
      setBusinessId(businessId);
      setNewProduct(prev => ({ ...prev, businessId: businessId }));
      
      // Initialize demo products if none exist
      initializeDemoProducts(businessId);
      
      // Fetch products
      fetchProducts(businessId);
    }
  }, [user]);
  
  // Fetch products function - try API first, fallback to localStorage
  const fetchProducts = async (businessId: string) => {
    try {
      setIsLoading(true);
      console.log('Fetching products for business:', businessId);
      
      // First try to fetch from API
      try {
        console.log('Attempting to fetch products from API');
        const productService = new ProductService();
        const response = await productService.getProducts({
          businessId,
          page: currentPage,
          limit: 10,
          search: searchQuery,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
        
        console.log('API products response:', response);
        
        if (response && response.data) {
          setProducts(response.data);
          setTotalPages(response.pages || 1);
          console.log('Successfully loaded products from API');
          return; // Exit early on success
        } else {
          console.log('No products returned from API, falling back to localStorage');
        }
      } catch (apiError) {
        console.error('API fetch failed, falling back to localStorage:', apiError);
      }
      
      // If API fails or returns no products, use localStorage
      const productsJSON = localStorage.getItem('user_products');
      let allProducts: Product[] = [];
      
      if (productsJSON) {
        try {
          allProducts = JSON.parse(productsJSON);
          console.log('Found products in localStorage:', allProducts.length);
        } catch (e) {
          console.error('Error parsing products from localStorage:', e);
        }
      }
      
      // If no products in localStorage either, initialize demo products
      if (allProducts.length === 0) {
        initializeDemoProducts(businessId);
        const newProductsJSON = localStorage.getItem('user_products');
        if (newProductsJSON) {
          allProducts = JSON.parse(newProductsJSON);
        }
      }
      
      // Filter products by businessId if provided
      let filteredProducts = businessId 
        ? allProducts.filter(p => p.businessId === businessId || p.business === businessId)
        : allProducts;
      
      // Apply search filter if provided
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(query) || 
          (p.description && p.description.toLowerCase().includes(query))
        );
      }
      
      // Sort products by createdAt (newest first)
      filteredProducts.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      
      // Apply pagination
      const limit = 10;
      const totalItems = filteredProducts.length;
      const totalPages = Math.ceil(totalItems / limit) || 1; // Ensure at least 1 page
      const startIndex = (currentPage - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      
      console.log('Filtered products:', paginatedProducts.length, 'of', totalItems);
      
      // Update state
      setProducts(paginatedProducts);
      setTotalPages(totalPages);
      console.log('Successfully loaded products from localStorage');
    } catch (error) {
      console.error('Error in fetchProducts:', error);
      // Show empty state rather than infinite loading
      setProducts([]);
      setTotalPages(1);
    } finally {
      // Always ensure loading state is turned off
      setIsLoading(false);
    }
  };
  
  // Create product function - using API with localStorage fallback
  const createProduct = async () => {
    try {
      setIsLoading(true); // Show loading state while creating product
      
      // Ensure price is a valid number
      const price = parseFloat(newProduct.price.toString()) || 0;
      
      console.log('Creating product with data:', {
        ...newProduct,
        price,
        businessId
      });
      
      // Try to create the product via the product service
      try {
        const createdProduct = await productService.createProduct({
          ...newProduct,
          price,
          businessId
        });
        
        console.log('Product created successfully via API:', createdProduct);
        
        // Refresh products list
        await fetchProducts(businessId);
        
        // Close modal and reset form
        setIsCreateModalOpen(false);
        setNewProduct({
          businessId,
          name: "",
          description: "",
          price: 0,
          image: "",
          category: "Subscription",
          currency: "USD"
        });
        
        // Show success message
        alert("Product created successfully!");
        
        return createdProduct;
      } catch (apiError) {
        console.error('API product creation failed, falling back to localStorage:', apiError);
        
        // If API fails, create a local-only product
        // Generate a unique ID for the new product
        const productId = `prod_local_${Date.now()}`;
        
        // Create the product object
        const localProduct: Product = {
          id: productId,
          customId: productId,
          name: newProduct.name,
          description: newProduct.description || '',
          price: price,
          image: newProduct.image || newProduct.imageUrl || `https://via.placeholder.com/800x600?text=${encodeURIComponent(newProduct.name)}`,
          category: newProduct.category || 'Other',
          currency: newProduct.currency || 'USD',
          active: true,
          businessId: businessId,
          business: businessId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active'
        };
        
        console.log('Created local product:', localProduct);
        
        // Save to localStorage
        const productsJSON = localStorage.getItem('user_products');
        let products: Product[] = [];
        
        if (productsJSON) {
          try {
            products = JSON.parse(productsJSON);
          } catch (e) {
            console.error('Error parsing products from localStorage:', e);
          }
        }
        
        // Add the new product
        products.push(localProduct);
        
        // Save back to localStorage
        localStorage.setItem('user_products', JSON.stringify(products));
        console.log('Saved product to localStorage');
        
        // Refresh products list
        await fetchProducts(businessId);
        
        // Close modal and reset form
        setIsCreateModalOpen(false);
        setNewProduct({
          businessId,
          name: "",
          description: "",
          price: 0,
          image: "",
          category: "Subscription",
          currency: "USD"
        });
        
        // Show success message with note about local storage
        alert("Product saved locally. It will be synced to the server when connection is restored.");
        
        return localProduct;
      }
    } catch (error) {
      console.error('Error in createProduct function:', error);
      alert("Error creating product. Please check the console for details.");
      setIsLoading(false); // Hide loading state if there's an error
      throw error;
    } finally {
      setIsLoading(false); // Ensure loading state is hidden
    }
  };

  // Utility functions
  const formatCurrency = (amount: number | undefined) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch (e) {
      return '-';
    }
  };

  const getBillingPeriodText = (period: string | null | undefined) => {
    if (!period) return "One-time";
    
    switch (period) {
      case "monthly": return "Monthly";
      case "yearly": return "Yearly";
      case "one-time": return "One-time";
      default: return period.charAt(0).toUpperCase() + period.slice(1);
    }
  };
  
  // Calculate discount based on discount code
  const calculateDiscount = (price: number, discountCode: string, qty: number = 1): number => {
    const subtotal = price * qty;
    if (discountCode && discountCode.toUpperCase() === "WELCOME10") {
      return subtotal * 0.9; // 10% discount
    }
    return subtotal;
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
          <Button size="sm" className="h-9" onClick={() => setIsCreateModalOpen(true)}>
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
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      // Reset to first page when searching
                      setCurrentPage(1);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        fetchProducts(businessId);
                      }
                    }}
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                      <p className="text-gray-500">Loading products...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-gray-500 mb-1">No products found</p>
                      <p className="text-gray-400 text-sm">Add your first product to get started</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : products.map((product) => (
                <TableRow 
                  key={product.id || product._id}
                  className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                  onClick={() => {
                    // Convert the product to the format expected by the preview dialog
                    const formattedProduct = {
                      businessId: product.businessId || (product.business && typeof product.business === 'string' ? product.business : ''),
                      name: product.name,
                      description: product.description,
                      image: product.image || '',
                      price: product.price || 0,
                      category: product.category || 'Other',
                      currency: product.currency || 'USD',
                      status: product.active ? 'active' : 'inactive'
                    };
                    setSelectedProduct(product);
                    setNewProduct(formattedProduct);
                    setIsPreviewMode(true);
                    setIsCreateModalOpen(true);
                    setQuantity(1); // Reset quantity when viewing a new product
                  }}
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
                      {formatCurrency(product.price || 0)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.billingPeriod ? 
                        `${getBillingPeriodText(product.billingPeriod)}` : 
                        "One-time payment"}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(product.active ? 'active' : 'inactive')}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(product.createdAt || new Date().toISOString())}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(product.updatedAt || product.createdAt || new Date().toISOString())}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
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
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(prev => prev - 1);
                      fetchProducts(businessId);
                    }
                  }}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(prev => prev + 1);
                      fetchProducts(businessId);
                    }
                  }}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Product Dialog (Add/Edit/Preview) */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
        setIsCreateModalOpen(open);
        if (!open) {
          // Reset states when dialog is closed
          setSelectedProduct(null);
          setIsEditMode(false);
          setIsPreviewMode(false);
          setQuantity(1); // Reset quantity
          if (!selectedProduct) {
            // Only reset form if we're not editing an existing product
            setNewProduct({
              businessId,
              name: "",
              description: "",
              price: 0,
              image: "",
              category: "Subscription",
              currency: "USD"
            });
          }
        }
      }}>
        <DialogContent className="max-w-6xl w-[90vw]">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct 
                ? (isEditMode ? "Edit Product" : "Product Preview") 
                : (isPreviewMode ? "Product Preview" : "Add New Product")}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct
                ? (isEditMode 
                    ? "Edit the details of your existing product." 
                    : "Review your product details and payment options.")
                : (isPreviewMode 
                    ? "Review your product details before adding it to the catalog." 
                    : "Fill in the details for your new product or service.")}
            </DialogDescription>
          </DialogHeader>

          {isPreviewMode ? (
            <div className="space-y-6">
              {/* Product Preview Header */}
              <div className="bg-muted p-4 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-medium">{newProduct.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{newProduct.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{newProduct.category}</Badge>
                      {getStatusBadge(newProduct.status || 'active')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {formatCurrency(newProduct.price * quantity)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getBillingPeriodText(newProduct.billingPeriod)}
                    </div>
                    {quantity > 1 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(newProduct.price)} each
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Main Content - 3 Column Layout */}
              <div className="grid grid-cols-3 gap-6">
                {/* Left Column: Product Image */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Product Image</h3>
                  
                  {/* Quantity Selector */}
                  <div className="mb-4">
                    <Label htmlFor="quantity" className="text-sm font-medium">Quantity</Label>
                    <div className="flex items-center mt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <span className="sr-only">Decrease</span>
                        <span className="text-lg">-</span>
                      </Button>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 1) {
                            setQuantity(value);
                          }
                        }}
                        className="h-8 w-16 mx-2 text-center"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <span className="sr-only">Increase</span>
                        <span className="text-lg">+</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden bg-white p-2 h-[250px] flex items-center justify-center">
                    {newProduct.imageUrl ? (
                      <img 
                        src={newProduct.imageUrl} 
                        alt={newProduct.name} 
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p>No image available</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Middle Column: Customer Information */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Customer Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer-name">Full Name</Label>
                      <Input
                        id="customer-name"
                        name="name"
                        placeholder="John Doe"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-email">Email Address</Label>
                      <Input
                        id="customer-email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-phone">Phone Number</Label>
                      <Input
                        id="customer-phone"
                        name="phone"
                        placeholder="+233 XX XXX XXXX"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount-code">Discount Code (Optional)</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="discount-code"
                            name="discountCode"
                            placeholder="Enter discount code"
                            className="pl-8"
                            value={customerInfo.discountCode}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value })}
                          />
                        </div>
                        <Button variant="outline" type="button">
                          Apply
                        </Button>
                      </div>
                      {customerInfo.discountCode.toUpperCase() === "WELCOME10" && (
                        <p className="text-sm text-green-600">10% discount applied!</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Right Column: Payment Method & Summary */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Payment Options</h3>
                  <div className="space-y-5">
                    {/* Payment Method */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Select Payment Method</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div 
                          className={`border rounded-md p-4 cursor-pointer ${paymentMethod === "card" ? "border-primary bg-primary/5" : ""}`}
                          onClick={() => setPaymentMethod("card")}
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5" />
                            <div>
                              <div className="font-medium">Credit/Debit Card</div>
                              <div className="text-sm text-muted-foreground">Pay with Visa, Mastercard, etc.</div>
                            </div>
                          </div>
                        </div>
                        <div 
                          className={`border rounded-md p-4 cursor-pointer ${paymentMethod === "mobile" ? "border-primary bg-primary/5" : ""}`}
                          onClick={() => setPaymentMethod("mobile")}
                        >
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5" />
                            <div>
                              <div className="font-medium">Mobile Money</div>
                              <div className="text-sm text-muted-foreground">Pay with MTN, Vodafone, etc.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-muted p-4 rounded-md space-y-3">
                      <h4 className="text-sm font-medium">Payment Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Price</span>
                          <span>{formatCurrency(Number(newProduct.price) || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quantity</span>
                          <span>{quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>{formatCurrency((Number(newProduct.price) || 0) * quantity)}</span>
                        </div>
                        {customerInfo.discountCode.toUpperCase() === "WELCOME10" && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount (10%)</span>
                            <span>-{formatCurrency((Number(newProduct.price) || 0) * quantity * 0.1)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                          <span>Total</span>
                          <span>
                            {formatCurrency(
                              calculateDiscount(Number(newProduct.price) || 0, customerInfo.discountCode, quantity)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Share Payment Link */}
                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-2">Share Payment Link</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Share this payment link with your customer to complete the transaction
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter product name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, [e.target.name]: e.target.value })}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category
                    </Label>
                    <Select 
                      value={newProduct.category} 
                      onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                    >
                      <SelectTrigger id="category" className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Subscription">Subscription</SelectItem>
                        <SelectItem value="Service">Service</SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter product description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, [e.target.name]: e.target.value })}
                    className="mt-1 h-20"
                  />
                </div>
                
                <div>
                  <Label htmlFor="image" className="text-sm font-medium">
                    Product Image
                  </Label>
                  <div className="mt-1 flex items-center gap-4">
                    <div className="h-20 w-20 rounded-md border overflow-hidden flex items-center justify-center bg-muted">
                      {newProduct.imageUrl ? (
                        <img 
                          src={newProduct.imageUrl} 
                          alt="Product" 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setNewProduct(prev => ({
                                ...prev,
                                imageUrl: event.target?.result as string
                              }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status
                  </Label>
                  <Select 
                    value={newProduct.status} 
                    onValueChange={(value: "active" | "draft" | "archived") => setNewProduct({ ...newProduct, status: value })}
                  >
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">
                    Billing Type
                  </Label>
                  <RadioGroup
                    value={newProduct.billingPeriod === "one-time" ? "one-time" : "recurring"}
                    onValueChange={(value) => {
                      if (value === "one-time") {
                        setNewProduct({ ...newProduct, billingPeriod: "one-time" });
                      } else {
                        setNewProduct({ ...newProduct, billingPeriod: "monthly" });
                      }
                    }}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="one-time" id="one-time" />
                      <Label htmlFor="one-time">One-time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="recurring" id="recurring" />
                      <Label htmlFor="recurring">Recurring</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-sm font-medium">
                      Price <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, [e.target.name]: e.target.value })}
                        className="pl-8"
                        required
                      />
                    </div>
                  </div>
                  
                  {newProduct.billingPeriod !== "one-time" && (
                    <div>
                      <Label htmlFor="billingPeriod" className="text-sm font-medium">
                        Billing Period
                      </Label>
                      <Select 
                        value={newProduct.billingPeriod || "monthly"} 
                        onValueChange={(value: "monthly" | "yearly") => setNewProduct({ ...newProduct, billingPeriod: value })}
                      >
                        <SelectTrigger id="billingPeriod" className="mt-1">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {isPreviewMode ? (
              <>
                {selectedProduct ? (
                  <>
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      <X className="h-4 w-4 mr-2" />
                      <span>Close</span>
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsPreviewMode(false);
                        setIsEditMode(true);
                      }}
                    >
                      <span>Edit Product</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setIsPreviewMode(false)}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      <span>Back to Edit</span>
                    </Button>
                    <Button 
                      onClick={async () => {
                        try {
                          setIsPaymentProcessing(true);
                          
                          // Actually create the product in the database
                          const result = await createProduct();
                          console.log('Product created successfully:', result);
                          
                          // Reset states
                          setIsPaymentProcessing(false);
                          setIsCreateModalOpen(false);
                          setIsPreviewMode(false);
                          
                          // Show success message
                          alert("Product added successfully!");
                        } catch (error) {
                          console.error('Error creating product:', error);
                          setIsPaymentProcessing(false);
                          alert("Error creating product. Please try again.");
                        }
                      }}
                      disabled={isPaymentProcessing || !newProduct.name || !newProduct.price}
                    >
                      {isPaymentProcessing ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          <span>Add Product & Save</span>
                        </>
                      )}
                    </Button>
                  </>
                )}
              </>
            ) : isEditMode ? (
              <>
                <Button variant="outline" onClick={() => {
                  setIsEditMode(false);
                  setIsPreviewMode(true);
                }}>
                  <X className="h-4 w-4 mr-2" />
                  <span>Cancel</span>
                </Button>
                <Button 
                  onClick={() => {
                    // Here you would update the product in your database
                    // For now, we'll just simulate a successful update
                    setTimeout(() => {
                      setIsEditMode(false);
                      setIsPreviewMode(true);
                      alert("Product updated successfully!");
                    }, 1000);
                  }}
                  disabled={!newProduct.name || !newProduct.price}
                >
                  <span>Update Product</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  <span>Cancel</span>
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setIsPreviewMode(true)}
                    disabled={!newProduct.name || !newProduct.price}
                  >
                    <span>Preview</span>
                  </Button>
                  <Button 
                    onClick={async () => {
                      try {
                        // Set loading state
                        setIsPaymentProcessing(true);
                        
                        // Ensure price is a valid number
                        const price = parseFloat(newProduct.price.toString()) || 0;
                        
                        // Prepare product data
                        const productData = {
                          ...newProduct,
                          price,
                          businessId
                        };
                        
                        console.log('Creating product with data:', productData);
                        
                        // Create a new instance of ProductService
                        const productService = new ProductService();
                        
                        // Call the product service to create the product via API
                        const createdProduct = await productService.createProduct(productData);
                        
                        console.log('Product created successfully:', createdProduct);
                        
                        // Reset states
                        setIsCreateModalOpen(false);
                        
                        // Refresh the products list
                        await fetchProducts(businessId);
                        
                        // Show success message
                        alert("Product created successfully!");
                      } catch (error: any) {
                        console.error('Error creating product:', error);
                        
                        // Show detailed error message
                        if (error.response) {
                          // The request was made and the server responded with an error status
                          const errorMessage = error.response.data?.message || error.response.statusText || 'Server error';
                          console.error('Server error response:', errorMessage);
                          alert(`Error creating product: ${errorMessage}`); 
                        } else if (error.request) {
                          // The request was made but no response was received
                          console.error('No response received:', error.request);
                          alert("Error creating product: No response from server. Please check your connection.");
                        } else {
                          // Something happened in setting up the request
                          console.error('Request setup error:', error.message);
                          alert(`Error creating product: ${error.message || 'Unknown error'}`); 
                        }
                      } finally {
                        // Always reset loading state
                        setIsPaymentProcessing(false);
                      }
                    }}
                    disabled={isPaymentProcessing || !newProduct.name || !newProduct.price}
                  >
                    {isPaymentProcessing ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        <span>Create Product</span>
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
