import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Search, Filter, Package, MoreHorizontal, ChevronDown } from "lucide-react";
import { ProductService } from "@/services/product.service";
import BusinessService from "@/services/business.service";
import { useAuth } from "@/contexts/AuthContext";
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
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductsPage() {
  // Service instance
  const productService = new ProductService();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]); // Changed to any[] as Product type is removed
  const [businessId, setBusinessId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New product state
  const [newProduct, setNewProduct] = useState<any>({ // Changed to any as ProductCreateData is removed
    businessId: "",
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "Subscription",
    currency: "USD",
    pricingType: "one-off",
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
      let userProducts: any[] = []; // Changed to any[]
      
      if (userProductsJSON) {
        try {
          userProducts = JSON.parse(userProductsJSON);
          console.log('User products from localStorage:', userProducts);
        } catch (e) {
          console.error('Error parsing user products from localStorage:', e);
        }
      }
      
      // Combine API products and local products
      let allProducts: any[] = []; // Changed to any[]
      
      if (response && response.data) {
        allProducts = [...response.data];
      }
      
      // Add local products that aren't already in the API response
      if (userProducts.length > 0) {
        const apiProductIds = new Set(allProducts.map(p => p.id || p._id));
        const filteredUserProducts = userProducts.filter(p => !apiProductIds.has(p.id || p._id || ''));
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

  // Edit product function
  const editProduct = async () => {
    try {
      if (!selectedProduct) return;
      
      setIsSubmitting(true);
      console.log('Editing product:', selectedProduct._id);
      
      // Validate required fields
      if (!selectedProduct.name || !selectedProduct.price) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in again.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Format price if it's a string
      const formattedPrice = typeof selectedProduct.price === 'string' 
        ? parseFloat(selectedProduct.price) 
        : selectedProduct.price;
      
      // Prepare the product data for API
      const productData = {
        name: selectedProduct.name,
        description: selectedProduct.description || '',
        price: formattedPrice,
        image: selectedProduct.image || 'https://via.placeholder.com/800x600?text=Product+Image',
        category: selectedProduct.category || 'Other',
        currency: selectedProduct.currency || 'USD',
        customId: selectedProduct.customId || `product_${Date.now()}`
      };
      
      // Make API call to update product
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const productId = selectedProduct._id || selectedProduct.id || selectedProduct.customId;
      
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      console.log('Product updated successfully:', data);
      toast({
        title: "Success",
        description: `Product "${productData.name}" updated successfully!`
      });
      
      // Refresh products list
      fetchProducts(businessId);
      
      // Close modal
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Delete product function
  const deleteProduct = async () => {
    try {
      if (!selectedProduct) return;
      
      setIsSubmitting(true);
      console.log('Deleting product:', selectedProduct._id);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in again.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Make API call to delete product
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const productId = selectedProduct._id || selectedProduct.id || selectedProduct.customId;
      
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      console.log('Product deleted successfully');
      toast({
        title: "Success",
        description: `Product "${selectedProduct.name}" deleted successfully!`
      });
      
      // Refresh products list
      fetchProducts(businessId);
      
      // Close modal
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
        metadataObject['billingPeriod'] = newProduct.billingPeriod;
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
        let userProducts: any[] = []; // Changed to any[]
        
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
    } catch (error: any) {
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
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
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium block mb-1.5">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter product name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium block mb-1.5">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your product"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      className="min-h-[100px] w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium block mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="category"
                      name="category"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Right Column - Pricing & Image */}
                <div className="space-y-5">
                  <div>
                    <Label className="text-sm font-medium block mb-1.5">
                      Pricing Type <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div 
                        className={`border rounded-md p-3 cursor-pointer ${newProduct.pricingType === 'one-off' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                        onClick={() => setNewProduct({...newProduct, pricingType: 'one-off'})}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${newProduct.pricingType === 'one-off' ? 'bg-primary' : 'border border-gray-300'}`}>
                            {newProduct.pricingType === 'one-off' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          <span className="font-medium">One-time</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-6">Charge once for this product</p>
                      </div>
                      
                      <div 
                        className={`border rounded-md p-3 cursor-pointer ${newProduct.pricingType === 'recurring' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                        onClick={() => setNewProduct({...newProduct, pricingType: 'recurring'})}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${newProduct.pricingType === 'recurring' ? 'bg-primary' : 'border border-gray-300'}`}>
                            {newProduct.pricingType === 'recurring' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          <span className="font-medium">Subscription</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-6">Charge on a recurring basis</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="price" className="text-sm font-medium block mb-1.5">
                      Price <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex">
                      <div className="w-1/3 mr-2">
                        <select
                          id="currency"
                          name="currency"
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                          value={newProduct.currency}
                          onChange={(e) => setNewProduct({...newProduct, currency: e.target.value})}
                        >
                          {currencies.map(currency => (
                            <option key={currency.code} value={currency.code}>{currency.code}</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-2/3">
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={newProduct.price}
                          onChange={handleInputChange}
                          className="w-full"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {newProduct.pricingType === 'recurring' && (
                    <div>
                      <Label htmlFor="billingPeriod" className="text-sm font-medium block mb-1.5">
                        Billing Period <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="billingPeriod"
                        name="billingPeriod"
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                        value={newProduct.billingPeriod}
                        onChange={(e) => setNewProduct({...newProduct, billingPeriod: e.target.value as any})}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Every 3 Months</option>
                        <option value="biannually">Every 6 Months</option>
                        <option value="yearly">Yearly</option>
                        <option value="custom">Custom</option>
                      </select>
                      
                      {newProduct.billingPeriod === 'custom' && (
                        <div className="mt-2">
                          <Label htmlFor="customBillingDays" className="text-sm font-medium block mb-1.5">
                            Days Between Billing <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="customBillingDays"
                            name="customBillingDays"
                            type="number"
                            min="1"
                            placeholder="30"
                            value={newProduct.customBillingDays || ''}
                            onChange={(e) => setNewProduct({...newProduct, customBillingDays: parseInt(e.target.value) || undefined})}
                            className="w-full"
                            required
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="image" className="text-sm font-medium block mb-1.5">
                      Product Image
                    </Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                      {newProduct.image ? (
                        <div className="flex flex-col items-center">
                          <img 
                            src={typeof newProduct.image === 'string' ? newProduct.image : ''} 
                            alt="Product preview" 
                            className="max-h-[150px] object-contain mb-3"
                          />
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={removeImage}
                              className="text-xs"
                            >
                              <X className="h-3 w-3 mr-1" /> Remove
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('product-image-upload')?.click()}
                              className="text-xs"
                            >
                              <Upload className="h-3 w-3 mr-1" /> Change
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="h-10 w-10 text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500 mb-3">Drag and drop an image or click to browse</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => document.getElementById('product-image-upload')?.click()}
                          >
                            <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload Image
                          </Button>
                        </div>
                      )}
                      <input
                        id="product-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Or enter an image URL:</p>
                      <Input
                        id="imageUrl"
                        name="image"
                        placeholder="https://example.com/image.jpg"
                        value={typeof newProduct.image === 'string' ? newProduct.image : ''}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Preview Section */}
              {isPreviewMode && (
                <div className="mt-6 border-t pt-5">
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <Eye className="h-4 w-4 mr-1.5 text-blue-500" /> 
                    Product Preview
                  </h3>
                  <div className="bg-white rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow duration-200">
                    {/* Product Header with Image */}
                    <div className="relative">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 h-32 w-full flex items-center justify-center">
                        {newProduct.image ? (
                          <img 
                            src={newProduct.image as string} 
                            alt={newProduct.name} 
                            className="max-h-28 max-w-[80%] object-contain shadow-sm"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-white flex items-center justify-center rounded-full shadow-sm">
                            <Package className="h-12 w-12 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg text-gray-900">{newProduct.name || 'Product Name'}</h4>
                          <div className="flex items-center mt-1 space-x-2">
                            <Badge variant="outline" className="text-xs">{newProduct.category || 'Category'}</Badge>
                            {newProduct.pricingType === 'recurring' && (
                              <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-50">
                                Subscription
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-3 line-clamp-3">{newProduct.description || 'Product description'}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-bold text-xl text-gray-900">
                            {newProduct.currency} {newProduct.price.toFixed(2)}
                          </div>
                          {newProduct.pricingType === 'recurring' && (
                            <div className="text-xs text-gray-500 mt-1 font-medium">
                              {newProduct.billingPeriod === 'daily' && 'Billed daily'}
                              {newProduct.billingPeriod === 'weekly' && 'Billed weekly'}
                              {newProduct.billingPeriod === 'monthly' && 'Billed monthly'}
                              {newProduct.billingPeriod === 'quarterly' && 'Billed every 3 months'}
                              {newProduct.billingPeriod === 'biannually' && 'Billed every 6 months'}
                              {newProduct.billingPeriod === 'yearly' && 'Billed yearly'}
                              {newProduct.billingPeriod === 'custom' && `Billed every ${newProduct.customBillingDays || 30} days`}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Additional Info */}
                      <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
                        <div>Created: {new Date().toLocaleDateString()}</div>
                        <div>ID: PROD_{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</div>
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
                  <div className="flex gap-2">
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
        </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden">
          <div className="flex h-full">
            {/* Form Section */}
            <div className="w-full p-6">
              <DialogHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-xl font-semibold">Edit Product</DialogTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsEditModalOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              
              {selectedProduct && (
                <div className="space-y-4 mt-4">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Product Name *</Label>
                    <Input 
                      id="edit-name" 
                      placeholder="Enter product name" 
                      value={selectedProduct.name} 
                      onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                    />
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea 
                      id="edit-description" 
                      placeholder="Describe your product" 
                      className="min-h-[100px]" 
                      value={selectedProduct.description || ''}
                      onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-price">Price *</Label>
                      <Input 
                        id="edit-price" 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        placeholder="0.00" 
                        value={selectedProduct.price}
                        onChange={(e) => setSelectedProduct({...selectedProduct, price: parseFloat(e.target.value)})}
                      />
                    </div>
                    
                    {/* Currency */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-currency">Currency</Label>
                      <Select 
                        value={selectedProduct.currency || 'USD'}
                        onValueChange={(value) => setSelectedProduct({...selectedProduct, currency: value})}
                      >
                        <SelectTrigger id="edit-currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select 
                      value={selectedProduct.category || 'Other'}
                      onValueChange={(value) => setSelectedProduct({...selectedProduct, category: value})}
                    >
                      <SelectTrigger id="edit-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Image */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-image">Product Image</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                        {selectedProduct.image ? (
                          <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <Input 
                        id="edit-image" 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
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
                            setSelectedProduct({...selectedProduct, image: base64});
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={editProduct} 
                      disabled={isSubmitting}
                      className="min-w-[120px] bg-blue-600 hover:bg-blue-700"
                      type="button"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>Save Changes</>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Product Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Delete Product</DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="py-4">
              <p className="text-gray-700">Are you sure you want to delete this product?</p>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-md flex items-center gap-3">
                <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                  {selectedProduct.image ? (
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full w-full object-cover" />
                  ) : (
                    <Package className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
                  <p className="text-sm text-gray-500">{formatCurrency(selectedProduct.price, selectedProduct.currency || "USD")}</p>
                </div>
              </div>
              
              <p className="mt-4 text-sm text-red-600">This action cannot be undone.</p>
              
              <div className="mt-6 flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={deleteProduct}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>Delete Product</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
