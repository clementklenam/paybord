import {useState, useRef, useEffect} from "react";
import {DashboardLayout} from "@/components/dashboard/DashboardLayout";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Dialog, DialogContent, DialogDescription, DialogTitle} from "@/components/ui/dialog";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {Pagination} from "@/components/ui/pagination";
import {toast} from "@/components/ui/use-toast";
import {
  Copy,
  Plus,
  Share2,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  Smartphone,
  Monitor,
  Upload,
  CreditCard,
  DollarSign,
  Link,
  Loader2
} from "lucide-react";
import {useBusinesses} from "@/hooks/useBusinesses";
import {useProducts} from "@/hooks/useProducts";
import {PaymentLink, paymentLinkService} from "@/services/payment-link.service";

// Format currency
const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export default function PaymentLinksPage() {
  // State for payment links
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // State for create dialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkDescription, setNewLinkDescription] = useState("");
  const [newLinkAmount, setNewLinkAmount] = useState("");
  const [newLinkCurrency, setNewLinkCurrency] = useState("USD");
  const [newLinkEmail, setNewLinkEmail] = useState("");
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<unknown>(null);
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("desktop");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"card" | "mobile" | "bank" | null>("card");
  const [imageUploadMethod, setImageUploadMethod] = useState<"file" | "url">("file");
  const [imageUrl, setImageUrl] = useState("");
  const [requiredFields, setRequiredFields] = useState({
    customerName: true,
    customerEmail: true,
    customerPhone: false,
    shippingAddress: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cardColor, setCardColor] = useState('#1e8449');
  
  // Fetch businesses and products
  const { businesses } = useBusinesses();
  const { products } = useProducts();
  
  // Filter and search
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    fetchPaymentLinks();
  }, [pagination.page, statusFilter]);
  
  useEffect(() => {
    if (businesses.length > 0 && !selectedBusinessId) {
      // If there's only one real business (not a demo), select it automatically
      const realBusinesses = businesses.filter(b => !b._id.startsWith('507f1f77'));
      
      if (realBusinesses.length > 0) {
        // Select the first real business
        setSelectedBusinessId(realBusinesses[0]._id);
        console.log('Auto-selected user business:', realBusinesses[0].name);
      } else if (businesses.length > 0) {
        // Fall back to the first business in the list (might be a demo)
        setSelectedBusinessId(businesses[0]._id);
        console.log('Selected first available business:', businesses[0].name);
      }
    }
  }, [businesses, selectedBusinessId]);
  
  const fetchPaymentLinks = async () => {
    setIsLoading(true);
    try {
      const status = statusFilter !== "all" ? statusFilter : undefined;
      const result = await paymentLinkService.getPaymentLinks(pagination.page, pagination.limit, status);
      setPaymentLinks(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error fetching payment links:", error);
      toast({
        title: "Error",
        description: "Failed to fetch payment links. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/payment-links/test-auth', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Auth test successful:", data);
        return data;
      } else {
        console.error("Auth test failed:", response.status);
        return null;
      }
    } catch (error) {
      console.error("Auth test error:", error);
      return null;
    }
  };

  const testEnum = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payment-links/test-enum');
      
      if (response.ok) {
        const data = await response.json();
        console.log("Enum test successful:", data);
        return data;
      } else {
        console.error("Enum test failed:", response.status);
        return null;
      }
    } catch (error) {
      console.error("Enum test error:", error);
      return null;
    }
  };

  const testPaymentLinkUrl = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`Payment link URL test (${url}):`, response.status, response.statusText);
      return response.ok;
    } catch (error) {
      console.error(`Payment link URL test failed (${url}):`, error);
      return false;
    }
  };

  const handleCreatePaymentLink = async () => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "Please log in to create payment links",
        variant: "destructive"
      });
      return;
    }

    console.log("Token found:", token.substring(0, 20) + "..."); // Debug log

    if (!newLinkTitle) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }
    
    if ((!newLinkAmount || parseFloat(newLinkAmount) <= 0) && !selectedProduct) {
      toast({
        title: "Validation Error",
        description: "Valid amount is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedBusinessId) {
      toast({
        title: "Validation Error",
        description: "Please select a business",
        variant: "destructive"
      });
      return;
    }

    // Validate ObjectId format - must be 24 hex characters
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(selectedBusinessId)) {
      toast({
        title: "Validation Error",
        description: "Invalid business ID format",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    
    try {
      // Map frontend payment method to backend enum values
      const getPaymentMethodType = (method: string) => {
        switch (method) {
          case 'card': return 'card';
          case 'mobile': return 'mobile_money';
          case 'bank': return 'bank_transfer';
          default: return 'card';
        }
      };

      const paymentLinkData: PaymentLink = {
        title: newLinkTitle,
        description: newLinkDescription,
        amount: selectedProduct ? selectedProduct.price : parseFloat(newLinkAmount),
        currency: selectedProduct ? selectedProduct.currency : newLinkCurrency,
        businessId: selectedBusinessId,
        imageUrl: uploadedImage || undefined,
        paymentMethodTypes: selectedPaymentMethod ? [getPaymentMethodType(selectedPaymentMethod)] : ["card"],
        requiredFields
      };
      
      console.log("Creating payment link with data:", paymentLinkData);
      console.log("Selected payment method:", selectedPaymentMethod);
      console.log("Payment method types being sent:", paymentLinkData.paymentMethodTypes);
      
      const newPaymentLink = await paymentLinkService.createPaymentLink(paymentLinkData);
      
      // Add to state and reset form
      setPaymentLinks([newPaymentLink, ...paymentLinks]);
      setIsCreateDialogOpen(false);
      resetForm();
      
      toast({
        title: "Success",
        description: "Payment link created successfully",
        variant: "default"
      });
      
      // Refresh the list
      fetchPaymentLinks();
    } catch (error: unknown) {
      console.error("Error creating payment link:", error);
      
      let errorMessage = "Failed to create payment link.";
      
      // Enhanced error handling
      if (error.response?.status === 403) {
        errorMessage = "Access denied. Please check your permissions or try logging in again.";
      } else if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error.message && error.message.includes("Cast to ObjectId failed")) {
        errorMessage = "Invalid business ID format. Please select a valid business.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleDeletePaymentLink = async (id: string) => {
    if (confirm("Are you sure you want to delete this payment link?")) {
      setIsDeleting(true);
      try {
        await paymentLinkService.deletePaymentLink(id);
        // Remove from state
        setPaymentLinks(paymentLinks.filter(link => link._id !== id && link.linkId !== id));
        toast({
          title: "Success",
          description: "Payment link deleted successfully",
          variant: "default"
        });
      } catch (error) {
        console.error("Error deleting payment link:", error);
        toast({
          title: "Error",
          description: "Failed to delete payment link. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const resetForm = () => {
    setNewLinkTitle("");
    setNewLinkDescription("");
    setNewLinkAmount("");
    setNewLinkCurrency("USD");
    setNewLinkEmail("");
    setSelectedBusinessId("");
    setSelectedProduct(null);
    setUploadedImage(null);
    setImageUrl("");
    setSelectedPaymentMethod("card");
    setImageUploadMethod("file");
    setRequiredFields({
      customerName: true,
      customerEmail: true,
      customerPhone: false,
      shippingAddress: false
    });
  };

  const handleProductSelect = (product: unknown) => {
    setSelectedProduct(product);
    if (product) {
      setNewLinkTitle(product.name);
      setNewLinkDescription(product.description);
      setNewLinkAmount(product.price.toString());
      setNewLinkCurrency(product.currency);
      if (product.imageUrl) {
        setUploadedImage(product.imageUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlSubmit = () => {
    if (imageUrl.trim()) {
      setUploadedImage(imageUrl);
    }
  };
  
  const handleCopyLink = (url: string) => {
    // Test the URL first
    testPaymentLinkUrl(url);
    
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Payment link copied to clipboard",
      variant: "default"
    });
  };
  
  const handleShareLink = (url: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Payment Link",
        text: "Check out this payment link",
        url: url
      });
    } else {
      handleCopyLink(url);
    }
  };
  
  const filteredLinks = searchQuery 
    ? paymentLinks.filter(link => 
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        link.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : paymentLinks;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-black tracking-tight mb-2">Payment Links</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Create and manage secure payment links to accept payments from anywhere. Share links with customers for instant payments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            size="lg" 
            className="h-12 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 px-6 font-semibold" 
            onClick={testAuth}
          >
            Test Auth
          </Button>
          <Button 
            variant="outline"
            size="lg" 
            className="h-12 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 px-6 font-semibold" 
            onClick={testEnum}
          >
            Test Enum
          </Button>
          <Button 
            size="lg" 
            className="h-12 rounded-full bg-black text-white hover:bg-gray-900 px-8 font-semibold shadow-lg" 
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            <span>Create Payment Link</span>
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
          <Input 
            className="pl-12 h-12 rounded-full border-gray-200 focus:border-black bg-white shadow-sm text-lg" 
            placeholder="Search payment links..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-12 rounded-full border-gray-200 bg-white shadow-sm w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Links</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Payment Links Grid */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-6"></div>
            <p className="text-lg text-gray-500">Loading payment links...</p>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Link className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No payment links found</h3>
            <p className="text-lg text-gray-500 mb-6 text-center max-w-md">
              Create your first payment link to start accepting payments from customers anywhere in the world.
            </p>
            <Button 
              size="lg" 
              className="rounded-full bg-black text-white hover:bg-gray-900 px-10 font-semibold shadow-lg text-lg" 
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-6 w-6 mr-2" />
              Create Your First Payment Link
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLinks.map((link) => (
              <Card
                key={link._id || link.linkId}
                className="group p-0 rounded-3xl shadow-xl border-0 bg-white hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Card Header with Image/Icon */}
                <div className="h-48 w-full bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center relative overflow-hidden">
                  {link.imageUrl ? (
                    <img 
                      src={link.imageUrl} 
                      alt={link.title} 
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <DollarSign className="h-8 w-8 text-gray-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">{link.title}</h3>
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className={
                      link.status === "active" 
                        ? "bg-green-100 text-green-800 border-green-200" 
                        : link.status === "expired" 
                          ? "bg-red-100 text-red-800 border-red-200" 
                          : "bg-gray-100 text-gray-800 border-gray-200"
                    }>
                      {link.status}
                    </Badge>
                  </div>
                </div>

                {/* Card Content */}
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Title and Description */}
                    <div>
                      <h3 className="text-xl font-bold text-black mb-1 truncate">{link.title}</h3>
                      {link.description && (
                        <p className="text-gray-500 text-sm line-clamp-2">{link.description}</p>
                      )}
                    </div>

                    {/* Amount */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-black">
                        {formatCurrency(link.amount, link.currency)}
                      </span>
                      <span className="text-sm text-gray-500 uppercase tracking-wide">
                        {link.currency}
                      </span>
                    </div>

                    {/* Analytics */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {link.analytics?.clicks || 0}
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Clicks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {link.analytics?.conversions || 0}
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Conversions</div>
                      </div>
                    </div>

                    {/* Created Date */}
                    <div className="text-xs text-gray-400">
                      Created {link.createdAt ? formatDate(link.createdAt) : "N/A"}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-full border-gray-200 hover:bg-gray-50 text-black"
                        onClick={() => link.url && handleCopyLink(link.url)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-full border-gray-200 hover:bg-gray-50 text-black"
                        onClick={() => link.url && handleShareLink(link.url)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full border-gray-200 hover:bg-gray-50"
                        onClick={() => alert("Edit functionality to be implemented")}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline"
                        size="icon"
                        className="rounded-full border-red-200 hover:bg-red-50 text-red-600"
                        onClick={() => link._id && handleDeletePaymentLink(link._id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-12 px-2">
          <div className="text-lg text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-full border-gray-200 text-lg"
              onClick={() => {
                if (pagination.page > 1) {
                  setPagination({...pagination, page: pagination.page - 1});
                }
              }}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-full border-gray-200 text-lg"
              onClick={() => {
                if (pagination.page < pagination.totalPages) {
                  setPagination({...pagination, page: pagination.page + 1});
                }
              }}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create Payment Link Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh] overflow-hidden p-0 bg-white z-50 flex flex-col">
          {/* Header - Fixed */}
          <div className="bg-gradient-to-r from-[#1e8449] to-[#166e3b] p-6 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold text-white">Create Payment Link</DialogTitle>
                <DialogDescription className="text-white/90 mt-1">
                  Design and configure your payment link with live preview
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex flex-1 overflow-hidden">
            {/* Form Section - Left Side */}
            <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-100">
              <div className="space-y-6">
                {/* Business Selection */}
                <div className="space-y-3">
                  <Label htmlFor="business" className="text-sm font-semibold text-gray-900 flex items-center">
                    <span className="w-2 h-2 bg-[#1e8449] rounded-full mr-2"></span>
                    Business *
                  </Label>
                  <Select 
                    value={selectedBusinessId}
                    onValueChange={setSelectedBusinessId}
                  >
                    <SelectTrigger className="h-12 border-gray-200 focus:border-[#1e8449] focus:ring-[#1e8449] rounded-xl">
                      <SelectValue placeholder="Select a business" />
                    </SelectTrigger>
                    <SelectContent>
                     {businesses.length > 0 ? (
                       <>
                         {/* Real Businesses */}
                         {businesses.filter(b => !b._id.startsWith('507f1f77')).length > 0 && (
                           <>
                             <SelectItem value="_header_real" disabled className="font-semibold text-gray-500 bg-gray-100">
                               Your Businesses
                             </SelectItem>
                             {businesses
                               .filter(b => !b._id.startsWith('507f1f77'))
                               .map((business) => (
                                 <SelectItem key={business._id} value={business._id}>
                                   {business.name}
                                 </SelectItem>
                               ))
                             }
                           </>
                         )}
                         
                         {/* Demo Businesses */}
                         {businesses.filter(b => b._id.startsWith('507f1f77')).length > 0 && (
                           <>
                             <SelectItem value="_header_demo" disabled className="font-semibold text-gray-500 bg-gray-100 mt-2">
                               Demo Businesses
                             </SelectItem>
                             {businesses
                               .filter(b => b._id.startsWith('507f1f77'))
                               .map((business) => (
                                 <SelectItem key={business._id} value={business._id}>
                                   {business.name} (Demo)
                                 </SelectItem>
                               ))
                             }
                           </>
                         )}
                       </>
                     ) : (
                       <SelectItem value="" disabled>
                         No businesses available
                       </SelectItem>
                     )}
                    </SelectContent>
                  </Select>
                  {businesses.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      You need to create a business before creating payment links.
                    </p>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-sm font-semibold text-gray-900 flex items-center">
                    <span className="w-2 h-2 bg-[#1e8449] rounded-full mr-2"></span>
                    Title or Name *
                  </Label>
                  <Input
                    id="title"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    placeholder="e.g. Premium Subscription"
                    className="h-12 border-gray-200 focus:border-[#1e8449] focus:ring-[#1e8449] rounded-xl"
                  />
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-900 flex items-center">
                    <span className="w-2 h-2 bg-[#1e8449] rounded-full mr-2"></span>
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newLinkDescription}
                    onChange={(e) => setNewLinkDescription(e.target.value)}
                    placeholder="Describe what this payment is for"
                    className="resize-none h-20 border-gray-200 focus:border-[#1e8449] focus:ring-[#1e8449] rounded-xl"
                  />
                </div>

                {/* Amount & Currency */}
                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-sm font-semibold text-gray-900 flex items-center">
                    <span className="w-2 h-2 bg-[#1e8449] rounded-full mr-2"></span>
                    Amount *
                  </Label>
                  <div className="flex space-x-3">
                    <Input
                      id="amount"
                      type="number"
                      value={newLinkAmount}
                      onChange={(e) => setNewLinkAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 h-12 border-gray-200 focus:border-[#1e8449] focus:ring-[#1e8449] rounded-xl"
                      disabled={selectedProduct !== null}
                    />
                    <Select
                      value={newLinkCurrency}
                      onValueChange={setNewLinkCurrency}
                      disabled={selectedProduct !== null}
                    >
                      <SelectTrigger className="w-24 h-12 border-gray-200 focus:border-[#1e8449] focus:ring-[#1e8449] rounded-xl">
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Customer Email */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-900 flex items-center">
                    <span className="w-2 h-2 bg-[#1e8449] rounded-full mr-2"></span>
                    Customer Email (Optional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newLinkEmail}
                    onChange={(e) => setNewLinkEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="h-12 border-gray-200 focus:border-[#1e8449] focus:ring-[#1e8449] rounded-xl"
                  />
                </div>

                {/* Product Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900 flex items-center">
                    <span className="w-2 h-2 bg-[#1e8449] rounded-full mr-2"></span>
                    Select a product
                  </Label>
                  <Select
                    value={selectedProduct?._id || ""}
                    onValueChange={(value) => {
                      const product = products.find(p => p._id === value);
                      handleProductSelect(product || null);
                    }}
                  >
                    <SelectTrigger className="h-12 border-gray-200 focus:border-[#1e8449] focus:ring-[#1e8449] rounded-xl">
                      <SelectValue placeholder="Choose a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                          <div className="flex justify-between w-full">
                            <span>{product.name}</span>
                            <span className="text-gray-500 ml-2">{formatCurrency(product.price, product.currency)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedProduct && (
                    <div className="mt-3 p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex justify-between items-center">
                        <div className="font-semibold text-gray-900">{selectedProduct.name}</div>
                        <div className="font-bold text-[#1e8449]">{formatCurrency(selectedProduct.price, selectedProduct.currency)}</div>
                      </div>
                      {selectedProduct.description && (
                        <div className="text-sm text-gray-600 mt-1">
                          {selectedProduct.description}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900 flex items-center">
                    <span className="w-2 h-2 bg-[#1e8449] rounded-full mr-2"></span>
                    Product Image (Optional)
                  </Label>
                  <div className="flex space-x-2 mb-3">
                    <Button
                      variant={imageUploadMethod === "file" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImageUploadMethod("file")}
                      className={`rounded-full ${imageUploadMethod === "file" ? "bg-[#1e8449] hover:bg-[#166e3b]" : "border-gray-200"}`}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                    <Button
                      variant={imageUploadMethod === "url" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImageUploadMethod("url")}
                      className={`rounded-full ${imageUploadMethod === "url" ? "bg-[#1e8449] hover:bg-[#166e3b]" : "border-gray-200"}`}
                    >
                      <Link className="h-4 w-4 mr-2" />
                      Image URL
                    </Button>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
                    {uploadedImage ? (
                      <div className="relative">
                        <img
                          src={uploadedImage}
                          alt="Product"
                          className="mx-auto h-32 object-contain rounded-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 rounded-full"
                          onClick={() => {
                            setUploadedImage(null);
                            setImageUrl("");
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : imageUploadMethod === "file" ? (
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileUpload}
                        />
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Select Image
                        </Button>
                        <p className="text-sm text-gray-500 mt-2">
                          PNG, JPG, or GIF up to 10MB
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-3">
                        <Input
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/image.png"
                          className="border-gray-200 focus:border-[#1e8449] focus:ring-[#1e8449] rounded-xl"
                        />
                        <Button
                          variant="outline"
                          disabled={!imageUrl.trim()}
                          onClick={handleImageUrlSubmit}
                          className="rounded-full"
                        >
                          Add Image
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section - Right Side */}
            <div className="w-1/2 bg-gray-50 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                <div className="flex items-center gap-3">
                  {/* Color Picker */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Card Color:</span>
                    <div className="flex gap-1">
                      {[
                        { name: 'Primary Blue', value: '#0A2C73' },
                        { name: 'Accent Blue', value: '#2979FF' },
                        { name: 'Purple', value: '#8b5cf6' },
                        { name: 'Orange', value: '#f97316' },
                        { name: 'Pink', value: '#ec4899' }
                      ].map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setCardColor(color.value)}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${
                            cardColor === color.value ? 'border-gray-400 scale-110' : 'border-gray-200 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Device Toggle */}
                  <div className="flex space-x-2">
                    <Button
                      variant={previewDevice === "desktop" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewDevice("desktop")}
                      className={`rounded-full ${previewDevice === "desktop" ? "bg-[#1e8449] hover:bg-[#166e3b]" : "border-gray-200"}`}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={previewDevice === "mobile" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewDevice("mobile")}
                      className={`rounded-full ${previewDevice === "mobile" ? "bg-[#1e8449] hover:bg-[#166e3b]" : "border-gray-200"}`}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Required Fields Controls */}
              <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-[#1e8449] rounded-full mr-2"></span>
                  Required Customer Information
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="preview-customerName" 
                      checked={requiredFields.customerName}
                      onCheckedChange={(checked) => 
                        setRequiredFields({...requiredFields, customerName: !!checked})
                      }
                      className="border-gray-300 data-[state=checked]:bg-[#1e8449] data-[state=checked]:border-[#1e8449]"
                    />
                    <Label htmlFor="preview-customerName" className="text-sm font-normal">Full Name</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="preview-customerEmail" 
                      checked={requiredFields.customerEmail}
                      onCheckedChange={(checked) => 
                        setRequiredFields({...requiredFields, customerEmail: !!checked})
                      }
                      className="border-gray-300 data-[state=checked]:bg-[#1e8449] data-[state=checked]:border-[#1e8449]"
                    />
                    <Label htmlFor="preview-customerEmail" className="text-sm font-normal">Email Address</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="preview-customerPhone" 
                      checked={requiredFields.customerPhone}
                      onCheckedChange={(checked) => 
                        setRequiredFields({...requiredFields, customerPhone: !!checked})
                      }
                      className="border-gray-300 data-[state=checked]:bg-[#1e8449] data-[state=checked]:border-[#1e8449]"
                    />
                    <Label htmlFor="preview-customerPhone" className="text-sm font-normal">Phone Number</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="preview-shippingAddress" 
                      checked={requiredFields.shippingAddress}
                      onCheckedChange={(checked) => 
                        setRequiredFields({...requiredFields, shippingAddress: !!checked})
                      }
                      className="border-gray-300 data-[state=checked]:bg-[#1e8449] data-[state=checked]:border-[#1e8449]"
                    />
                    <Label htmlFor="preview-shippingAddress" className="text-sm font-normal">Shipping Address</Label>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex justify-center overflow-y-auto">
                <div
                  className={`bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden ${
                    previewDevice === "mobile" ? "w-80 max-w-full" : "w-[480px] max-w-full"
                  }`}
                  style={{ 
                    minHeight: previewDevice === "mobile" ? "680px" : "780px",
                    maxHeight: previewDevice === "mobile" ? "680px" : "780px"
                  }}
                >
                  {/* Stripe-inspired Payment Card */}
                  {/* Accent Bar */}
                  <div 
                    className="h-2 w-full rounded-t-3xl" 
                    style={{ backgroundColor: cardColor }}
                  />
                  
                  {/* Header with Product Image */}
                  <div className="px-8 pt-6 pb-4 relative">
                    {/* Product Image as Background */}
                    {uploadedImage && (
                      <div className="absolute inset-0 rounded-t-3xl overflow-hidden">
                        <img
                          src={uploadedImage}
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                        {/* Dark overlay for better text readability */}
                        <div className="absolute inset-0 bg-black/40"></div>
                      </div>
                    )}
                    
                    {/* Payment Information with relative positioning */}
                    <div className="relative z-10">
                      {/* Business Name */}
                      <div className="text-center mb-3">
                        <span className="text-white/80 text-xs font-medium tracking-wider uppercase">Payment to</span>
                        <div className="text-lg font-semibold text-white mt-1">
                          {selectedBusinessId ? (businesses.find(b => b._id === selectedBusinessId)?.name || "Business") : "Business"}
                        </div>
                      </div>
                      
                      {/* Amount */}
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold mb-2" style={{ color: cardColor }}>
                          {newLinkAmount
                            ? formatCurrency(parseFloat(newLinkAmount), newLinkCurrency)
                            : selectedProduct
                              ? formatCurrency(selectedProduct.price, selectedProduct.currency)
                              : formatCurrency(0, "USD")
                          }
                        </div>
                        <div className="text-lg font-medium text-white">
                          {newLinkTitle || "Payment Title"}
                        </div>
                        {newLinkDescription && (
                          <div className="text-white/80 text-sm mt-1 leading-relaxed">
                            {newLinkDescription}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Required Fields Preview - Vertical Layout */}
                  <div className="px-8 mb-4 flex-1">
                    <div className="space-y-2">
                      {requiredFields.customerName && (
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 text-gray-700">
                          <div className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center">
                            <svg className="h-3.5 w-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="font-medium text-sm">Full Name</span>
                        </div>
                      )}
                      {requiredFields.customerEmail && (
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 text-gray-700">
                          <div className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center">
                            <svg className="h-3.5 w-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="font-medium text-sm">Email Address</span>
                        </div>
                      )}
                      {requiredFields.customerPhone && (
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 text-gray-700">
                          <div className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center">
                            <svg className="h-3.5 w-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <span className="font-medium text-sm">Phone Number</span>
                        </div>
                      )}
                      {requiredFields.shippingAddress && (
                        <div className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-2.5 text-gray-700">
                          <div className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center mt-0.5">
                            <svg className="h-3.5 w-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243M15 11V7a2 2 0 00-2-2H7a2 2 0 00-2 2v4" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <span className="font-medium text-sm">Shipping Address</span>
                            <div className="text-xs text-gray-500 mt-0.5">
                              Street address, city, state, zip code
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Payment Methods */}
                  <div className="px-8 mb-4">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          selectedPaymentMethod === "card" 
                            ? "shadow-lg" 
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        style={{
                          borderColor: selectedPaymentMethod === "card" ? cardColor : undefined,
                          backgroundColor: selectedPaymentMethod === "card" ? `${cardColor}15` : undefined,
                          color: selectedPaymentMethod === "card" ? cardColor : undefined
                        }}
                        onClick={() => setSelectedPaymentMethod("card")}
                      >
                        <CreditCard className="h-4 w-4" />
                        Card
                      </button>
                      <button
                        type="button"
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          selectedPaymentMethod === "mobile" 
                            ? "shadow-lg" 
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        style={{
                          borderColor: selectedPaymentMethod === "mobile" ? cardColor : undefined,
                          backgroundColor: selectedPaymentMethod === "mobile" ? `${cardColor}15` : undefined,
                          color: selectedPaymentMethod === "mobile" ? cardColor : undefined
                        }}
                        onClick={() => setSelectedPaymentMethod("mobile")}
                      >
                        <Smartphone className="h-4 w-4" />
                        Mobile
                      </button>
                      <button
                        type="button"
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          selectedPaymentMethod === "bank" 
                            ? "shadow-lg" 
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        style={{
                          borderColor: selectedPaymentMethod === "bank" ? cardColor : undefined,
                          backgroundColor: selectedPaymentMethod === "bank" ? `${cardColor}15` : undefined,
                          color: selectedPaymentMethod === "bank" ? cardColor : undefined
                        }}
                        onClick={() => setSelectedPaymentMethod("bank")}
                      >
                        <DollarSign className="h-4 w-4" />
                        Bank
                      </button>
                    </div>
                  </div>
                  
                  {/* Pay Button */}
                  <div className="px-8 mb-6">
                    <Button 
                      className="w-full h-14 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      style={{ backgroundColor: cardColor }}
                    >
                      Pay {newLinkAmount
                        ? formatCurrency(parseFloat(newLinkAmount), newLinkCurrency)
                        : selectedProduct
                          ? formatCurrency(selectedProduct.price, selectedProduct.currency)
                          : formatCurrency(0, "USD")
                      }
                    </Button>
                  </div>
                  
                  {/* Powered by Paybord */}
                  <div className="w-full text-center text-xs text-gray-400 py-3 border-t border-gray-100 bg-gray-50 tracking-wide">
                    Powered by <span className="font-bold" style={{ color: cardColor }}>Paybord</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed at Bottom */}
          <div className="bg-white p-6 border-t border-gray-200 flex-shrink-0 shadow-lg relative">
            {/* Visual indicator */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
            
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
                className="rounded-full border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 h-12"
              >
                Cancel
              </Button>
              <Button 
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-full px-8 h-12 font-semibold shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105 border-2 border-emerald-500" 
                onClick={handleCreatePaymentLink}
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Payment Link...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    Create Payment Link
                  </>
                )}
              </Button>
            </div>
            
            {/* Additional visual indicator */}
            <div className="mt-2 text-center">
              <span className="text-xs text-gray-500">Click the green button above to create your payment link</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
