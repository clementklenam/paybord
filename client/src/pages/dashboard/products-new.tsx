import {useState, useEffect} from "react";
import type { Product, ProductCreateData } from "@/services/product.service";
import {DashboardLayout} from "@/components/dashboard/DashboardLayout";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Plus, Search, Package, Loader2, X, Pencil, Trash, Eye, EyeOff, Upload} from "lucide-react";
import {ProductService} from "@/services/product.service";
import BusinessService from "@/services/business.service";
import {useAuth} from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  } from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {useToast} from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductsPage() {

  const { user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [businessId, setBusinessId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New product state
  const [newProduct, setNewProduct] = useState<ProductCreateData>({
    businessId: "",
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "Subscription",
    currency: "USD",
    billingPeriod: "monthly"
  });
  
  // Preview mode state
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Fetch current user's business ID and products when component mounts
  useEffect(() => {
    if (user) {
      // Clear any previously set business ID to avoid using old data
      setBusinessId("");
      setProducts([]);
      
      // Fetch the user's business using BusinessService
      const fetchUserBusinesses = async () => {
        try {
          // Create a new instance of BusinessService
          const businessService = new BusinessService();
          
          // First check if business exists
          const hasRegistered = await businessService.hasRegisteredBusiness();
          console.log('Has registered business:', hasRegistered);
          
          if (hasRegistered) {
            // Fetch the business profile
            const businessProfile = await businessService.getBusinessProfile();
            console.log('Fetched business profile:', businessProfile);
            
            if (businessProfile && businessProfile._id) {
              const userBusinessId = businessProfile._id;
              console.log('Using business ID:', userBusinessId);
              
              // Store the business ID in localStorage for persistence
              localStorage.setItem('current_business_id', userBusinessId);
              
              // Update state with the business ID
              setBusinessId(userBusinessId);
              setNewProduct(prev => ({ ...prev, businessId: userBusinessId }));
              
              // Fetch products for this business
              fetchProducts(userBusinessId);
            } else {
              console.error('Business profile does not have an ID');
              toast({
                title: "Business ID Missing",
                description: "Your business profile is incomplete. Please update your business profile.",
                variant: "destructive"
              });
              setIsLoading(false);
            }
          } else {
            console.log('No business found, redirecting to business creation...');
            toast({
              title: "No Business Found",
              description: "Please create a business profile first.",
              variant: "destructive"
            });
            setIsLoading(false);
            
            // Optionally redirect to business creation page
            // window.location.href = '/dashboard/business/create';
          }
        } catch (error) {
          console.error('Error in business setup:', error);
          toast({
            title: "Setup Error",
            description: error instanceof Error ? error.message : "An unknown error occurred",
            variant: "destructive"
          });
          setIsLoading(false);
        }
      };
      
      fetchUserBusinesses();
    }
  }, [user]);
  
  // Fetch products when search query changes
  useEffect(() => {
    if (businessId) {
      fetchProducts(businessId);
    }
  }, [searchQuery, currentPage]);
  
  // Fetch products function
  const fetchProducts = async (businessId: string) => {
    try {
      setIsLoading(true);
      console.log('Fetching products for business:', businessId);
      
      // Create a new instance of ProductService
      const productService = new ProductService();
      
      // Get products from API - make sure to include businessId
      const response = await productService.getProducts({
        businessId, // Important: Include businessId in the request
        page: currentPage,
        limit: 10,
        search: searchQuery,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      console.log('Products fetched from API:', response);
      
      // Also get user-created products from localStorage
      const userProductsJSON = localStorage.getItem('user_products');
      let userProducts: Product[] = []; // Changed to any[]
      
      if (userProductsJSON) {
        try {
          userProducts = JSON.parse(userProductsJSON);
          console.log('User products from localStorage:', userProducts);
        } catch (e) {
          console.error('Error parsing user products from localStorage:', e);
        }
      }
      
      // Combine API products and local products
      let allProducts: Product[] = []; // Changed to any[]
      
      if (response && response.data) {
        allProducts = [...response.data];
      }
      
      // Only add local products that match the current businessId
      if (userProducts.length > 0 && businessId) {
        const apiProductIds = new Set(allProducts.map(p => p.id || p._id));
        const filteredUserProducts = userProducts.filter(
          p => (p.businessId === businessId || p.business === businessId) && !apiProductIds.has(p.id || p._id || '')
        );
        allProducts = [...allProducts, ...filteredUserProducts];
      }
      
      // Sort by creation date (newest first)
      allProducts.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      
      console.log('Combined products:', allProducts);
      
      setProducts(allProducts);
      setTotalPages(Math.ceil(allProducts.length / 10) || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // Try to get products from localStorage as fallback
      try {
        const userProductsJSON = localStorage.getItem('user_products');
        if (userProductsJSON) {
          const userProducts = JSON.parse(userProductsJSON);
          console.log('Fallback: Using products from localStorage:', userProducts);
          setProducts(userProducts);
          setTotalPages(Math.ceil(userProducts.length / 10) || 1);
        } else {
          setProducts([]);
          setTotalPages(1);
        }
      } catch (e) {
        console.error('Error parsing user products from localStorage:', e);
        setProducts([]);
        setTotalPages(1);
        
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Available currencies
  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "INR", name: "Indian Rupee" },
    { code: "NGN", name: "Nigerian Naira" },
    { code: "GHS", name: "Ghanaian Cedi" },
    { code: "KES", name: "Kenyan Shilling" },
    { code: "ZAR", name: "South African Rand" }
  ];

  // Product categories
  const categories = [
    "Subscription",
    "Digital Product",
    "Physical Product",
    "Service",
    "Membership",
    "Course",
    "Event",
    "Donation"
  ];

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Convert to base64 for preview and storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setNewProduct(prev => ({
        ...prev,
        image: base64
      }));
    };
    reader.readAsDataURL(file);
  };
  
  // Remove uploaded image
  const removeImage = () => {
    setNewProduct(prev => ({
      ...prev,
      image: ''
    }));
  };

  // Toggle preview mode
  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  // Edit product function - TODO: Implement when needed
  // const editProduct = async () => {
  //   // TODO: Implement edit functionality
  // };
  
  // Delete product function - TODO: Implement when needed
  // const deleteProduct = async () => {
  //   // TODO: Implement delete functionality
  // };
  
  // Create product function
  const createProduct = async () => {
    try {
      setIsSubmitting(true);
      console.log('Creating product...');
      
      // Validate required fields
      if (!newProduct.name || !newProduct.price) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Get the current business ID from state or localStorage
      let currentBusinessId = businessId;
      
      // If businessId is not in state, try to get it from localStorage
      if (!currentBusinessId) {
        currentBusinessId = localStorage.getItem('current_business_id') || '';
        console.log('Retrieved business ID from localStorage:', currentBusinessId);
        
        if (currentBusinessId) {
          // Update state with the business ID from localStorage
          setBusinessId(currentBusinessId);
        } else {
          toast({
            title: "Error",
            description: "No business found. Please refresh the page.",
            variant: "destructive"
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      console.log('Validation passed, proceeding with product creation');
      
      // Use the current business ID
      const productData = { ...newProduct };
      productData.businessId = currentBusinessId;
      
      console.log('Using current business ID:', currentBusinessId);
      
      if (!productData.businessId) {
        toast({
          title: "Error",
          description: "Business ID is required. Please refresh the page and try again.",
          variant: "destructive"
        });
        return;
      }
      
      // Convert metadata to a proper format for the backend
      const metadataObject: Record<string, string> = {};
      
      if (newProduct.pricingType === 'recurring') {
        metadataObject['pricingType'] = newProduct.pricingType;
        metadataObject['billingPeriod'] = newProduct.billingPeriod ?? '';
        if (newProduct.billingPeriod === 'custom' && newProduct.customBillingDays) {
          metadataObject['customBillingDays'] = String(newProduct.customBillingDays);
        }
      } else {
        metadataObject['pricingType'] = 'one-off';
      }
      
      // Prepare product data for API - ensuring we use the field names expected by the backend
      // Note: We're using 'business' directly here to match what the backend expects
      const finalProductData = {
        business: productData.businessId, // Use the current user's business ID
        name: productData.name,
        description: productData.description || '',
        price: typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price,
        // Use the image data from the form, but limit its size if it's too large
        image: productData.image || 'https://via.placeholder.com/800x600?text=Product+Image',
        category: productData.category || 'Other',
        currency: productData.currency || 'USD',
        metadata: metadataObject,
        customId: `prod_${Date.now()}` // Add a custom ID for better tracking
      };
      
      console.log('Using business ID for Esthers Bakery Shop:', '68226b39653af0df3da731e9');
      console.log('Creating product with data:', finalProductData);
      
      // Get token directly from localStorage for maximum reliability
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Make direct API call instead of using the service
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalProductData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const createdProduct = await response.json();
      console.log('Product created successfully:', createdProduct);
      
      // Manually save to localStorage to ensure it's available immediately
      try {
        const userProductsJSON = localStorage.getItem('user_products');
        let userProducts: Product[] = []; // Changed to any[]
        
        if (userProductsJSON) {
          userProducts = JSON.parse(userProductsJSON);
        }
        
        // Add the new product to the list if it doesn't already exist
        const exists = userProducts.some(p => 
          (p.id && createdProduct.id && p.id === createdProduct.id) ||
          (p._id && createdProduct._id && p._id === createdProduct._id) ||
          (p.customId && createdProduct.customId && p.customId === createdProduct.customId)
        );
        
        if (!exists) {
          userProducts.push(createdProduct);
          localStorage.setItem('user_products', JSON.stringify(userProducts));
          console.log('Product saved to localStorage');
        }
      } catch (e) {
        console.error('Error saving to localStorage:', e);
        // Continue execution even if localStorage fails
      }
      
      toast({
        title: "Success",
        description: `Product "${createdProduct.name}" has been created.`
      });
      
      // Refresh products list
      await fetchProducts(businessId);
      
      // Close modal and reset form
      setIsCreateModalOpen(false);
      setIsPreviewMode(false);
      setNewProduct({
        businessId,
        name: "",
        description: "",
        price: 0,
        image: "",
        category: "Subscription",
        currency: "USD",
        pricingType: "one-off",
        billingPeriod: "monthly"
      });
    } catch (error: unknown) {
      console.error('Error in createProduct function:', error);
      
      // Show detailed error message
      let errorMessage = "Failed to create product. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Error Creating Product",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Utility functions
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(amount);
    } catch (e) {
      // Fallback to USD if currency code is invalid
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount) + (currency ? ` (${currency})` : '');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getStatusBadge = (active?: boolean) => {
    if (active === undefined) return null;
    
    return active ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-gray-100">
        Inactive
      </Badge>
    );
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading products...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-300" />
              <h3 className="mt-2 text-lg font-medium">No products found</h3>
              <p className="mt-1 text-gray-500">
                {searchQuery 
                  ? "Try a different search term or clear your filters." 
                  : "Get started by creating your first product."}
              </p>
              <Button 
                onClick={() => setIsCreateModalOpen(true)} 
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add product
              </Button>
            </div>
          ) : (
            /* Products Table */
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow 
                    key={product._id || product.id || product.customId}
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
                        {formatCurrency(product.price, product.currency || "USD")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.currency || "USD"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {product.category || "Other"}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.active)}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(product.createdAt)}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2 justify-end">
                        {/* TODO: Implement edit functionality
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsEditModalOpen(true);
                          }}
                          title="Edit product"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        */}
                        {/* TODO: Implement delete functionality
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsDeleteModalOpen(true);
                          }}
                          title="Delete product"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                        */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Create Product Modal */}
 {/* Create Product Modal */}
 <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden">
          <div className="flex h-full">
            {/* Form Section */}
            <div className="w-full p-6">
              <DialogHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-xl font-semibold">New Product</DialogTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
             
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column - Form Fields */}
                <div className="space-y-5">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      placeholder="Describe your product..."
                      rows={3}
                    />
                  </div>
                  
                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Right Column - Pricing & Image */}
                <div className="space-y-5">
                  {/* Price */}
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                        className="flex-1"
                      />
                      <Select
                        value={newProduct.currency}
                        onValueChange={(value) => setNewProduct(prev => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="image">Product Image</Label>
                    <div className="space-y-2">
                      {newProduct.image ? (
                        <div className="relative">
                          <img 
                            src={newProduct.image} 
                            alt="Product preview" 
                            className="w-full h-32 object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={removeImage}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">Upload product image</p>
                        </div>
                      )}
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>
                  
                  {/* Billing Period for Subscriptions */}
                  {newProduct.category === "Subscription" && (
                    <div className="space-y-2">
                      <Label htmlFor="billingPeriod">Billing Period</Label>
                      <Select
                        value={newProduct.billingPeriod ?? ''}
                        onValueChange={(value) => setNewProduct(prev => ({ ...prev, billingPeriod: value as ProductCreateData['billingPeriod'] }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Preview Section */}
              {isPreviewMode && (
                <div className="mt-6 border-t pt-5">
                  <h3 className="text-lg font-semibold mb-3">Preview</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                        {newProduct.image ? (
                          <img src={newProduct.image} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{newProduct.name || "Product Name"}</h4>
                        <p className="text-gray-600 text-sm">{newProduct.description || "No description"}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-semibold text-lg">
                            {formatCurrency(newProduct.price, newProduct.currency)}
                          </span>
                          <Badge variant="outline">{newProduct.category}</Badge>
                          {newProduct.category === "Subscription" && (
                            <Badge variant="secondary">
                              {newProduct.billingPeriod}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={togglePreviewMode} 
                  type="button"
                  size="sm"
                  className="flex items-center"
                >
                  {isPreviewMode ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5 mr-1.5" /> Hide Preview
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5 mr-1.5" /> Preview
                    </>
                  )}
                </Button>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateModalOpen(false)} 
                    disabled={isSubmitting}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={createProduct} 
                    disabled={isSubmitting}
                    className="min-w-[120px] bg-blue-600 hover:bg-blue-700"
                    type="button"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Product
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
 </DashboardLayout>
  );
}
