import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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
  CreditCard,
  Phone,
  Lock,
  Shield,
  Upload
} from "lucide-react";

// Mock data for products
const products = [
  { id: 1, name: "Premium Plan", price: 99.99, currency: "USD", description: "This is a premium plan" },
  { id: 2, name: "Basic Plan", price: 49.99, currency: "USD", description: "This is a basic plan" },
  { id: 3, name: "Enterprise Solution", price: 299.99, currency: "USD", description: "This is an enterprise solution" },
  { id: 4, name: "Consulting Package", price: 199.99, currency: "USD", description: "This is a consulting package" },
  { id: 5, name: "Starter Kit", price: 29.99, currency: "USD", description: "This is a starter kit" }
];

// Mock data for payment links
const mockPaymentLinks = [
  { 
    id: "pl_1234567890", 
    title: "Premium Subscription", 
    description: "Monthly subscription for premium features", 
    amount: 99.99, 
    currency: "USD", 
    created: "2025-05-01T10:30:00Z", 
    status: "active", 
    url: "https://pay.paymesa.com/pl_1234567890",
    clicks: 45,
    conversions: 23
  },
  { 
    id: "pl_0987654321", 
    title: "Consulting Services", 
    description: "One-time payment for consulting services", 
    amount: 199.99, 
    currency: "USD", 
    created: "2025-05-03T14:15:00Z", 
    status: "active", 
    url: "https://pay.paymesa.com/pl_0987654321",
    clicks: 32,
    conversions: 18
  },
  { 
    id: "pl_5678901234", 
    title: "Basic Package", 
    description: "Entry level package with essential features", 
    amount: 49.99, 
    currency: "USD", 
    created: "2025-05-05T09:45:00Z", 
    status: "active", 
    url: "https://pay.paymesa.com/pl_5678901234",
    clicks: 28,
    conversions: 12
  },
  { 
    id: "pl_3456789012", 
    title: "Enterprise Solution", 
    description: "Complete enterprise solution with premium support", 
    amount: 299.99, 
    currency: "USD", 
    created: "2025-05-07T16:20:00Z", 
    status: "inactive", 
    url: "https://pay.paymesa.com/pl_3456789012",
    clicks: 15,
    conversions: 5
  }
];

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
  const [paymentLinks, setPaymentLinks] = useState(mockPaymentLinks);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkDescription, setNewLinkDescription] = useState("");
  const [newLinkAmount, setNewLinkAmount] = useState("");
  const [newLinkCurrency, setNewLinkCurrency] = useState("USD");
  const [newLinkEmail, setNewLinkEmail] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("desktop");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"card" | "mobile" | null>("card");
  const [showCardForm, setShowCardForm] = useState(false);
  const [showMobileForm, setShowMobileForm] = useState(false);
  
  const handleCreatePaymentLink = () => {
    // In a real app, this would make an API call to create the payment link
    const newLink = {
      id: `pl_${Math.random().toString(36).substr(2, 9)}`,
      title: newLinkTitle,
      description: newLinkDescription,
      amount: selectedProduct !== null ? products[selectedProduct].price : parseFloat(newLinkAmount),
      currency: newLinkCurrency,
      created: new Date().toISOString(),
      status: "active",
      url: `https://pay.paymesa.com/pl_${Math.random().toString(36).substr(2, 9)}`,
      clicks: 0,
      conversions: 0
    };
    
    setPaymentLinks([newLink, ...paymentLinks]);
    setIsCreateDialogOpen(false);
    resetForm();
  };
  
  const resetForm = () => {
    setNewLinkTitle("");
    setNewLinkDescription("");
    setNewLinkAmount("");
    setNewLinkCurrency("USD");
    setNewLinkEmail("");
    setSelectedProduct(null);
  };
  
  const handleProductSelect = (productId: number) => {
    if (selectedProduct === productId) {
      setSelectedProduct(null);
      setNewLinkAmount("");
    } else {
      setSelectedProduct(productId);
      setNewLinkAmount(products[productId].price.toString());
      setNewLinkCurrency(products[productId].currency);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Payment Links</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1e8449] hover:bg-[#166e3b]">
              <Plus className="mr-2 h-4 w-4" />
              Create Payment Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] w-full h-[90vh]">
            <DialogHeader>
              <DialogTitle>Create Payment Link</DialogTitle>
              <DialogDescription>
                Create a payment link to share with your customers.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="space-y-6 md:col-span-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title or Name*</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g. Premium Subscription" 
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea 
                      id="description" 
                      placeholder="e.g. Monthly subscription for premium features" 
                      value={newLinkDescription}
                      onChange={(e) => setNewLinkDescription(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="product-select" className="text-sm font-medium">Product</Label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setSelectedProduct(null);
                          setUploadedImage(null);
                        }}
                        className="text-xs h-7 px-2"
                      >
                        Clear
                      </Button>
                    </div>
                      <Select
                        value={selectedProduct !== null ? selectedProduct.toString() : ""}
                        onValueChange={(value) => setSelectedProduct(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {/* Product Image Upload */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Product Image</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          {uploadedImage ? (
                            <div className="space-y-2">
                              <img 
                                src={uploadedImage} 
                                alt="Uploaded product" 
                                className="max-h-40 mx-auto rounded-md"
                              />
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setUploadedImage(null)}
                              >
                                Remove Image
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="text-gray-500 text-sm">
                                Drag & drop an image or click to browse
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  // In a real app, this would open a file picker
                                  // For demo purposes, we'll use a placeholder image
                                  setUploadedImage("https://source.unsplash.com/random/800x600?product");
                                }}
                              >
                                Upload Image
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount*</Label>
                      <Input 
                        id="amount" 
                        type="number" 
                        placeholder="0.00" 
                        value={newLinkAmount}
                        onChange={(e) => setNewLinkAmount(e.target.value)}
                        disabled={selectedProduct !== null}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Customer Email (optional)</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="customer@example.com" 
                      value={newLinkEmail}
                      onChange={(e) => setNewLinkEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Select a Product (optional)</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {products.map((product) => (
                        <div 
                          key={product.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedProduct === product.id - 1 
                              ? "border-[#1e8449] bg-[#1e8449]/5" 
                              : "border-gray-200 hover:border-[#1e8449]/50"
                          }`}
                          onClick={() => handleProductSelect(product.id - 1)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.description}</div>
                            </div>
                            <div className="font-semibold">
                              {formatCurrency(product.price, product.currency)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 md:col-span-3">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-base font-medium">Payment Preview</Label>
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <button
                      className={`p-1.5 rounded ${previewDevice === "mobile" ? "bg-white shadow" : ""}`}
                      onClick={() => setPreviewDevice("mobile")}
                      title="Mobile view"
                    >
                      <Smartphone className="h-4 w-4" />
                    </button>
                    <button
                      className={`p-1.5 rounded ${previewDevice === "desktop" ? "bg-white shadow" : ""}`}
                      onClick={() => setPreviewDevice("desktop")}
                      title="Desktop view"
                    >
                      <Monitor className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Payment Preview Container */}
                <div className={previewDevice === "mobile" ? "max-w-md mx-auto" : "w-full max-w-4xl mx-auto"}>
                  {/* Main Payment Card */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    {/* Header with Logo and Test Mode */}
                    <div className="px-6 pt-6 pb-2 flex items-center justify-between border-b border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-800 font-bold text-sm">P</span>
                        </div>
                        <span className="font-medium text-gray-800">PayAfric</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">TEST MODE</span>
                    </div>

                    {/* Main Content */}
                    <div className={`${previewDevice === "mobile" ? "flex flex-col" : "grid grid-cols-5 gap-0"}`}>
                      {/* Left Column - Product Info */}
                      <div className={`${previewDevice === "mobile" ? "" : "col-span-2 border-r border-gray-200"} p-6`}>
                        {/* Payment Title */}
                        <h3 className="text-xl font-medium text-gray-900 mb-4">{newLinkTitle || "Payment"}</h3>
                        
                        {/* Product Display */}
                        {selectedProduct !== null ? (
                          <div className="space-y-4">
                            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                              <img 
                                src={uploadedImage || `https://source.unsplash.com/random/800x400?product=${selectedProduct}`} 
                                alt="Product" 
                                className="w-full h-40 object-cover"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-start">
                                <p className="font-medium text-gray-900">
                                  {products[selectedProduct]?.name || "Product Name"}
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                  {newLinkAmount ? formatCurrency(parseFloat(newLinkAmount), newLinkCurrency) : "$0.00"}
                                </p>
                              </div>
                              <p className="text-sm text-gray-500">
                                {products[selectedProduct]?.description || "Product description"}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="text-2xl font-bold text-gray-900">
                              {newLinkAmount ? formatCurrency(parseFloat(newLinkAmount), newLinkCurrency) : "$0.00"}
                            </div>
                            {newLinkDescription && <p className="text-sm text-gray-500">{newLinkDescription}</p>}
                          </div>
                        )}
                      </div>

                      {/* Right Column - Payment Methods */}
                      <div className={`${previewDevice === "mobile" ? "border-t border-gray-200" : "col-span-3"} p-6 bg-gray-50`}>
                        {/* Email Field */}
                        <div className="space-y-2 mb-6">
                          <Label htmlFor="preview-email" className="text-sm font-medium text-gray-700">Email</Label>
                          <Input 
                            id="preview-email" 
                            placeholder="email@example.com" 
                            disabled 
                            className="bg-white border-gray-300" 
                          />
                        </div>
                        
                        {/* Payment Method Title */}
                        <div className="mb-4">
                          <Label className="text-sm font-medium text-gray-700">Payment method</Label>
                        </div>
                        
                        {/* Apple Pay */}
                        <div className="mb-4">
                          <Button className="w-full bg-black hover:bg-gray-900 text-white py-3 flex items-center justify-center rounded-md">
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.6 12.9c0-1.3.7-2.4 1.8-3.1-.7-1-1.9-1.7-3.3-1.8-1.4-.1-2.7.8-3.4.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.5 2.2 2.6 2.1 1.1 0 1.5-.7 2.8-.7 1.3 0 1.7.7 2.8.7 1.2 0 1.9-1 2.6-2.1.5-.8.9-1.6 1.2-2.5-1.4-.5-2.3-1.9-2.3-3.4z"/>
                              <path d="M15.4 6.5c.6-.8 1-1.8 1-2.8-1 .1-1.9.5-2.6 1.2-.7.7-1.1 1.6-1.1 2.5 1 0 1.9-.3 2.7-.9z"/>
                            </svg>
                            <span>Pay</span>
                          </Button>
                        </div>
                        
                        <div className="text-center text-sm text-gray-500 my-4">Or</div>
                        
                        {/* Card Option */}
                        <div className="mb-2">
                          <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
                            <div 
                              className="flex items-center p-3 cursor-pointer" 
                              onClick={() => {
                                setSelectedPaymentMethod("card");
                                setShowCardForm(true);
                                setShowMobileForm(false);
                              }}
                            >
                              <input 
                                type="radio" 
                                id="card-option" 
                                name="payment-method" 
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                                checked={selectedPaymentMethod === "card"}
                                onChange={() => {}}
                              />
                              <label htmlFor="card-option" className="ml-3 flex items-center justify-between w-full">
                                <div className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-gray-500">
                                    <rect width="20" height="14" x="2" y="5" rx="2" />
                                    <line x1="2" x2="22" y1="10" y2="10" />
                                  </svg>
                                  <span className="text-sm font-medium text-gray-900">Card</span>
                                </div>
                                <div className="flex space-x-1">
                                  <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" alt="Visa" className="h-5" />
                                  <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" className="h-5" />
                                  <img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46273d4cd44048db7a7a258f5.svg" alt="Amex" className="h-5" />
                                  <img src="https://js.stripe.com/v3/fingerprinted/img/discover-ac52cd46f89fa40a29a0bfb954e33173.svg" alt="Discover" className="h-5" />
                                </div>
                              </label>
                            </div>
                            
                            {/* Card Form */}
                            {showCardForm && (
                              <div className="p-3 border-t border-gray-200 bg-gray-50">
                                <div className="space-y-3">
                                  <div className="space-y-1">
                                    <Label htmlFor="card-number" className="text-xs font-medium text-gray-700">Card number</Label>
                                    <Input 
                                      id="card-number" 
                                      placeholder="1234 5678 9012 3456" 
                                      className="bg-white border-gray-300 h-9 text-sm" 
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <Label htmlFor="card-expiry" className="text-xs font-medium text-gray-700">Expiration</Label>
                                      <Input 
                                        id="card-expiry" 
                                        placeholder="MM / YY" 
                                        className="bg-white border-gray-300 h-9 text-sm" 
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label htmlFor="card-cvc" className="text-xs font-medium text-gray-700">CVC</Label>
                                      <Input 
                                        id="card-cvc" 
                                        placeholder="123" 
                                        className="bg-white border-gray-300 h-9 text-sm" 
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Mobile Money Option */}
                        <div className="mb-6">
                          <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
                            <div 
                              className="flex items-center p-3 cursor-pointer"
                              onClick={() => {
                                setSelectedPaymentMethod("mobile");
                                setShowMobileForm(true);
                                setShowCardForm(false);
                              }}
                            >
                              <input 
                                type="radio" 
                                id="mobile-option" 
                                name="payment-method" 
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                                checked={selectedPaymentMethod === "mobile"}
                                onChange={() => {}}
                              />
                              <label htmlFor="mobile-option" className="ml-3 flex items-center w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-gray-500">
                                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                                  <path d="M12 18h.01" />
                                </svg>
                                <span className="text-sm font-medium text-gray-900">Mobile Money</span>
                              </label>
                            </div>
                            
                            {/* Mobile Money Form */}
                            {showMobileForm && (
                              <div className="p-3 border-t border-gray-200 bg-gray-50">
                                <div className="space-y-3">
                                  <div className="space-y-1">
                                    <Label htmlFor="mobile-number" className="text-xs font-medium text-gray-700">Mobile number</Label>
                                    <Input 
                                      id="mobile-number" 
                                      placeholder="+233 XX XXX XXXX" 
                                      className="bg-white border-gray-300 h-9 text-sm" 
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor="mobile-provider" className="text-xs font-medium text-gray-700">Provider</Label>
                                    <Select>
                                      <SelectTrigger id="mobile-provider" className="bg-white border-gray-300 h-9 text-sm">
                                        <SelectValue placeholder="Select provider" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                                        <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                                        <SelectItem value="airtel">AirtelTigo Money</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Pay Button */}
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-base font-medium rounded-md mb-4">
                          Pay
                        </Button>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                        <span>Powered by <span className="font-semibold">PayAfric</span></span>
                        <span>Terms</span>
                        <span>Privacy</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-[#1e8449] hover:bg-[#166e3b]"
                onClick={handleCreatePaymentLink}
                disabled={!newLinkTitle || (!newLinkAmount && selectedProduct === null)}
              >
                Create Payment Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Your Payment Links</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input className="pl-8 w-[200px]" placeholder="Search links..." />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <div className="font-medium">{link.title}</div>
                    {link.description && (
                      <div className="text-sm text-gray-500 truncate max-w-[200px]">
                        {link.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(link.amount, link.currency)}</TableCell>
                  <TableCell>{formatDate(link.created)}</TableCell>
                  <TableCell>
                    <Badge className={link.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {link.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{link.clicks}</TableCell>
                  <TableCell>{link.conversions}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        {link.status === "active" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
