import { useState } from "react";
import { Product, ProductCreateData, ProductService } from "@/services/product.service";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Package, Upload, X, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProductFormProps {
  businessId: string;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
  onPreview?: () => void;
  isLoading?: boolean;
}

// Available currencies from products-new.tsx
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

// Product categories from products-new.tsx
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

export function ProductForm({ businessId, onSubmit, onCancel, onPreview, isLoading = false }: ProductFormProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<ProductCreateData>({
    businessId,
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "Subscription",
    currency: "USD",
    billingPeriod: "monthly"
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

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
      setForm(prev => ({
        ...prev,
        image: base64
      }));
    };
    reader.readAsDataURL(file);
  };
  
  // Remove uploaded image
  const removeImage = () => {
    setForm(prev => ({
      ...prev,
      image: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const productService = new ProductService();
      const created = await productService.createProduct({ 
        ...form, 
        image: form.image || 'https://via.placeholder.com/800x600?text=Product+Image'
      });
      onSubmit(created);
    } catch (error) {
      console.error("Failed to create product:", error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Utility function for currency formatting
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(amount);
    } catch (e) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount) + (currency ? ` (${currency})` : '');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Form Fields */}
        <div className="space-y-5">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
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
              value={form.description}
              onChange={handleInputChange}
              placeholder="Describe your product..."
              rows={3}
            />
          </div>
          
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={form.category}
              onValueChange={(value) => setForm(prev => ({ ...prev, category: value }))}
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
                value={form.price}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                className="flex-1"
              />
              <Select
                value={form.currency}
                onValueChange={(value) => setForm(prev => ({ ...prev, currency: value }))}
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
              {form.image ? (
                <div className="relative">
                  <img 
                    src={form.image} 
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
          {form.category === "Subscription" && (
            <div className="space-y-2">
              <Label htmlFor="billingPeriod">Billing Period</Label>
              <Select
                value={form.billingPeriod ?? ''}
                onValueChange={(value) => setForm(prev => ({ ...prev, billingPeriod: value as ProductCreateData['billingPeriod'] }))}
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
      <div className="border-t pt-5">
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
              {form.image ? (
                <img src={form.image} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <Package className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-lg">{form.name || "Product Name"}</h4>
              <p className="text-gray-600 text-sm">{form.description || "No description"}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-semibold text-lg">
                  {formatCurrency(form.price, form.currency)}
                </span>
                <Badge variant="outline">{form.category}</Badge>
                {form.category === "Subscription" && (
                  <Badge variant="secondary">
                    {form.billingPeriod}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={onPreview}
            disabled={!form.name || !form.price}
          >
            <Package className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isLoading || !form.name || !form.price}
            className="min-w-[120px] bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
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
    </form>
  );
} 