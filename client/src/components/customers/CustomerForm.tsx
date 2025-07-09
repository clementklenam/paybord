import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Address } from "@/services/customer.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  FileText, 
  MapPin, 
  Globe, 
  Clock, 
  Languages, 
  CreditCard, 
  Receipt 
} from "lucide-react";

// List of countries for dropdown
const COUNTRIES = [
  { name: 'Ghana', code: 'GH', phoneCode: '+233' },
  { name: 'Nigeria', code: 'NG', phoneCode: '+234' },
  { name: 'Kenya', code: 'KE', phoneCode: '+254' },
  { name: 'South Africa', code: 'ZA', phoneCode: '+27' },
  { name: 'United States', code: 'US', phoneCode: '+1' },
  { name: 'United Kingdom', code: 'GB', phoneCode: '+44' },
  { name: 'Canada', code: 'CA', phoneCode: '+1' },
  { name: 'Australia', code: 'AU', phoneCode: '+61' },
  { name: 'Germany', code: 'DE', phoneCode: '+49' },
  { name: 'France', code: 'FR', phoneCode: '+33' },
  { name: 'India', code: 'IN', phoneCode: '+91' },
  { name: 'China', code: 'CN', phoneCode: '+86' },
  { name: 'Japan', code: 'JP', phoneCode: '+81' },
  { name: 'Brazil', code: 'BR', phoneCode: '+55' },
  { name: 'Mexico', code: 'MX', phoneCode: '+52' }
];

// List of languages for dropdown
const LANGUAGES = [
  { name: 'English', code: 'en' },
  { name: 'French', code: 'fr' },
  { name: 'Spanish', code: 'es' },
  { name: 'Arabic', code: 'ar' },
  { name: 'Swahili', code: 'sw' },
  { name: 'Portuguese', code: 'pt' },
  { name: 'German', code: 'de' },
  { name: 'Chinese', code: 'zh' },
  { name: 'Japanese', code: 'ja' },
  { name: 'Hindi', code: 'hi' }
];

// List of timezones for dropdown
const TIMEZONES = [
  { name: '(GMT+0:00) Accra', value: 'Africa/Accra' },
  { name: '(GMT+1:00) Lagos', value: 'Africa/Lagos' },
  { name: '(GMT+3:00) Nairobi', value: 'Africa/Nairobi' },
  { name: '(GMT+2:00) Johannesburg', value: 'Africa/Johannesburg' },
  { name: '(GMT-5:00) New York', value: 'America/New_York' },
  { name: '(GMT+0:00) London', value: 'Europe/London' },
  { name: '(GMT+1:00) Berlin', value: 'Europe/Berlin' },
  { name: '(GMT+1:00) Paris', value: 'Europe/Paris' },
  { name: '(GMT+5:30) New Delhi', value: 'Asia/Kolkata' },
  { name: '(GMT+8:00) Beijing', value: 'Asia/Shanghai' },
  { name: '(GMT+9:00) Tokyo', value: 'Asia/Tokyo' },
  { name: '(GMT-3:00) São Paulo', value: 'America/Sao_Paulo' }
];

// List of currencies for dropdown
const CURRENCIES = [
  { name: 'Ghana Cedi (GHS)', code: 'GHS' },
  { name: 'Nigerian Naira (NGN)', code: 'NGN' },
  { name: 'Kenyan Shilling (KES)', code: 'KES' },
  { name: 'South African Rand (ZAR)', code: 'ZAR' },
  { name: 'US Dollar (USD)', code: 'USD' },
  { name: 'British Pound (GBP)', code: 'GBP' },
  { name: 'Euro (EUR)', code: 'EUR' },
  { name: 'Canadian Dollar (CAD)', code: 'CAD' },
  { name: 'Australian Dollar (AUD)', code: 'AUD' },
  { name: 'Indian Rupee (INR)', code: 'INR' },
  { name: 'Chinese Yuan (CNY)', code: 'CNY' },
  { name: 'Japanese Yen (JPY)', code: 'JPY' },
  { name: 'Brazilian Real (BRL)', code: 'BRL' },
  { name: 'Mexican Peso (MXN)', code: 'MXN' }
];

// Form data interface
interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  phoneCountry: string;
  description: string;
  billingAddress: Address;
  shippingAddress: Address;
  useShippingAsBilling: boolean;
  metadata: {
    timezone: string;
    language: string;
    currency: string;
    taxId: string;
  };
}

// Default form data
const defaultFormData: CustomerFormData = {
  name: '',
  email: '',
  phone: '',
  phoneCountry: '+233', // Default to Ghana
  description: '',
  billingAddress: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Ghana'
  },
  shippingAddress: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Ghana'
  },
  useShippingAsBilling: false,
  metadata: {
    timezone: '',
    language: '',
    currency: '',
    taxId: '',
  },
};

// Props interface
interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
  initialData?: Partial<CustomerFormData>;
  isLoading?: boolean;
}

export function CustomerForm({ onSubmit, onCancel, initialData, isLoading = false }: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>({
    ...defaultFormData,
    ...initialData
  });
  const [activeTab, setActiveTab] = useState('account');
  const { toast } = useToast();

  // Handle input change
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle billing address change
  const handleBillingAddressChange = (field: keyof Address, value: string) => {
    setFormData(prev => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: value
      }
    }));
  };

  // Handle shipping address change
  const handleShippingAddressChange = (field: keyof Address, value: string) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value
      },
      // If using shipping as billing, update billing address too
      ...(prev.useShippingAsBilling && {
        billingAddress: {
          ...prev.billingAddress,
          [field]: value
        }
      })
    }));
  };

  // Handle metadata change
  const handleMetadataChange = (field: keyof CustomerFormData['metadata'], value: string) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
    }));
  };

  // Handle shipping as billing toggle
  const handleShippingAsBillingChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      useShippingAsBilling: checked,
      // If checked, copy shipping address to billing address
      ...(checked && {
        billingAddress: { ...prev.shippingAddress }
      })
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    // Prepare data for submission
    const submitData = {
      ...formData,
      phone: formData.phoneCountry + ' ' + formData.phone
    };
    
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account Information</TabsTrigger>
          <TabsTrigger value="billing">Billing Details</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        {/* Account Information Tab */}
        <TabsContent value="account" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Name *</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter customer name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Email Address *</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="customer@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Phone Number</span>
              </Label>
              <div className="flex gap-2">
                <Select
                  value={formData.phoneCountry}
                  onValueChange={(value) => handleInputChange('phoneCountry', value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.phoneCode}>
                        {country.name} ({country.phoneCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Description</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Add notes or description about this customer"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </TabsContent>
        
        {/* Billing Details Tab */}
        <TabsContent value="billing" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Shipping Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Shipping Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipping-line1">Address Line 1</Label>
                  <Input
                    id="shipping-line1"
                    placeholder="Street address"
                    value={formData.shippingAddress.line1}
                    onChange={(e) => handleShippingAddressChange('line1', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping-line2">Address Line 2</Label>
                  <Input
                    id="shipping-line2"
                    placeholder="Apt, Suite, Building (optional)"
                    value={formData.shippingAddress.line2}
                    onChange={(e) => handleShippingAddressChange('line2', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping-city">City</Label>
                  <Input
                    id="shipping-city"
                    placeholder="City"
                    value={formData.shippingAddress.city}
                    onChange={(e) => handleShippingAddressChange('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping-state">State/Province</Label>
                  <Input
                    id="shipping-state"
                    placeholder="State or Province"
                    value={formData.shippingAddress.state}
                    onChange={(e) => handleShippingAddressChange('state', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping-postal">Postal Code</Label>
                  <Input
                    id="shipping-postal"
                    placeholder="Postal or ZIP code"
                    value={formData.shippingAddress.postalCode}
                    onChange={(e) => handleShippingAddressChange('postalCode', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping-country">Country</Label>
                  <Select
                    value={formData.shippingAddress.country}
                    onValueChange={(value) => handleShippingAddressChange('country', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="use-shipping-as-billing"
                checked={formData.useShippingAsBilling}
                onCheckedChange={(checked) => 
                  handleShippingAsBillingChange(checked as boolean)
                }
              />
              <Label htmlFor="use-shipping-as-billing">
                Use shipping address as billing address
              </Label>
            </div>
            
            {/* Billing Address (only show if not using shipping as billing) */}
            {!formData.useShippingAsBilling && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Billing Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billing-line1">Address Line 1</Label>
                    <Input
                      id="billing-line1"
                      placeholder="Street address"
                      value={formData.billingAddress.line1}
                      onChange={(e) => handleBillingAddressChange('line1', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing-line2">Address Line 2</Label>
                    <Input
                      id="billing-line2"
                      placeholder="Apt, Suite, Building (optional)"
                      value={formData.billingAddress.line2}
                      onChange={(e) => handleBillingAddressChange('line2', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing-city">City</Label>
                    <Input
                      id="billing-city"
                      placeholder="City"
                      value={formData.billingAddress.city}
                      onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing-state">State/Province</Label>
                    <Input
                      id="billing-state"
                      placeholder="State or Province"
                      value={formData.billingAddress.state}
                      onChange={(e) => handleBillingAddressChange('state', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing-postal">Postal Code</Label>
                    <Input
                      id="billing-postal"
                      placeholder="Postal or ZIP code"
                      value={formData.billingAddress.postalCode}
                      onChange={(e) => handleBillingAddressChange('postalCode', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing-country">Country</Label>
                    <Select
                      value={formData.billingAddress.country}
                      onValueChange={(value) => handleBillingAddressChange('country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Time Zone</span>
              </Label>
              <Select
                value={formData.metadata?.timezone || ''}
                onValueChange={(value) => handleMetadataChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((timezone) => (
                    <SelectItem key={timezone.value} value={timezone.value}>
                      {timezone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                <span>Language</span>
              </Label>
              <Select
                value={formData.metadata?.language || ''}
                onValueChange={(value) => handleMetadataChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Preferred Currency</span>
              </Label>
              <Select
                value={formData.metadata?.currency || ''}
                onValueChange={(value) => handleMetadataChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxId" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                <span>Tax ID</span>
              </Label>
              <Input
                id="taxId"
                placeholder="Tax ID or VAT number"
                value={formData.metadata?.taxId || ''}
                onChange={(e) => handleMetadataChange('taxId', e.target.value)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Separator />
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Customer"}
        </Button>
      </div>
    </form>
  );
}
