import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PaymesaCalendar } from "@/components/ui/paymesa-calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  CheckCircle, 
  Plus, 
  X,
  Sparkles,
  Calendar as CalendarIcon,
  FileText,
  Phone,
  Mail,
  Info,
  ChevronDown,
  ChevronRight,
  User,
  CreditCard,
  Settings,
  Package
} from "lucide-react";
import { Product, ProductService } from "@/services/product.service";
import CustomerService, { Customer } from "@/services/customer.service";
import SubscriptionService, { Subscription } from "@/services/subscription.service";
import BusinessService from "@/services/business.service";
import { useToast } from "@/components/ui/use-toast";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { ProductForm } from "@/components/products/ProductForm";
import { cn } from "@/lib/utils";
import { safeRender, sanitizeArray } from "@/utils/safeRender";

interface SubscriptionBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (subscription: Subscription) => void;
}

interface SubscriptionFormData {
  // Customer
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  // Product & Pricing
  productId: string;
  productName: string;
  price: number;
  currency: string;
  quantity: number;
  
  // Billing
  interval: 'day' | 'week' | 'month' | 'year';
  startDate: Date;
  endDate?: Date;
  forever: boolean;
  
  // Payment Settings
  paymentMethod: 'auto' | 'manual';
  billingMode: 'classic' | 'flexible';
  invoiceTemplate: string;
  
  // Trial & Settings
  trialDays: number;
  autoCharge: boolean;
  collectTax: boolean;
  
  // Advanced
  description: string;
  invoiceMemo: string;
  invoiceFooter: string;
  customFields: boolean;
}

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'NGN', label: 'NGN (₦)', symbol: '₦' },
  { value: 'KES', label: 'KES (KSh)', symbol: 'KSh' },
  { value: 'GHS', label: 'GHS (₵)', symbol: '₵' }
];

const INVOICE_TEMPLATES = [
  { value: 'default', label: 'Default Template' },
  { value: 'minimal', label: 'Minimal Template' },
  { value: 'detailed', label: 'Detailed Template' }
];

const SECTIONS = [
  { id: 'customer', title: 'Customer', icon: User, required: true },
  { id: 'duration', title: 'Duration', icon: CalendarIcon, required: true },
  { id: 'pricing', title: 'Pricing', icon: Package, required: true },
  { id: 'billing', title: 'Billing', icon: CreditCard, required: true },
  { id: 'settings', title: 'Subscription Settings', icon: Settings, required: false }
];



export function SubscriptionBuilder({ open, onOpenChange, onSuccess }: SubscriptionBuilderProps) {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    productId: '',
    productName: '',
    price: 0,
            currency: '',
    quantity: 1,
    interval: 'month',
    startDate: new Date(),
    endDate: undefined,
    forever: true,
    paymentMethod: 'auto',
    billingMode: 'classic',
    invoiceTemplate: 'default',
    trialDays: 0,
    autoCharge: true,
    collectTax: false,
    description: '',
    invoiceMemo: '',
    invoiceFooter: '',
    customFields: false
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [isCreatingProduct] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>('');
  const [previewTab, setPreviewTab] = useState<'summary' | 'invoice' | 'code'>('invoice');
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['customer', 'duration', 'pricing']));
  
  const { toast } = useToast();

  // Load data when component opens
  useEffect(() => {
    if (open) {
      loadBusinessId();
      loadCustomers();
      loadProducts();
    }
  }, [open]);

  const loadBusinessId = async () => {
    try {
      const businessService = new BusinessService();
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
      setBusinessName(business.businessName || 'Your Business');
    } catch (error) {
      console.error('Failed to load business ID:', error);
      toast({
        title: "Error",
        description: "Failed to load business information. Please try again.",
        variant: "destructive"
      });
    }
  };

  const loadCustomers = async () => {
    try {
      const customerService = new CustomerService();
      const customersList = await customerService.getCustomers();
      
      // Sanitize customer data to prevent React errors
      const sanitizedCustomers = sanitizeArray(customersList.customers || []);
      
      setCustomers(sanitizedCustomers as Customer[]);
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const productService = new ProductService();
      const productsList = await productService.getProducts({ active: true });
      
      // Sanitize product data to prevent React errors
      const sanitizedProducts = sanitizeArray(productsList.data || []);
      
      setProducts(sanitizedProducts as Product[]);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find(c => c._id === customerId);
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customerId: customer._id || '',
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone || ''
      }));
    }
  };

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      setFormData(prev => ({
        ...prev,
        productId: product._id || '',
        productName: product.name,
        price: product.price,
        currency: product.currency || 'USD'
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.customerId || !formData.productId) {
      toast({
        title: "Missing Information",
        description: "Please select a customer and product",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const subscriptionData = {
        customer: formData.customerId,
        product: formData.productId,
        price: formData.price * formData.quantity,
        currency: formData.currency,
        interval: formData.interval,
        startDate: formData.startDate.toISOString(),
        endDate: formData.forever ? undefined : formData.endDate?.toISOString(),
        metadata: {
          description: formData.description,
          invoiceMemo: formData.invoiceMemo,
          trialDays: formData.trialDays,
          autoCharge: formData.autoCharge,
          collectTax: formData.collectTax,
          paymentMethod: formData.paymentMethod,
          billingMode: formData.billingMode
        }
      };

      const subscription = await SubscriptionService.createSubscription(subscriptionData);
      
      // After creating subscription, send invoice
      try {
        const { paymentLink } = await SubscriptionService.sendInvoice(subscription._id!);
        
        toast({
          title: "Success!",
          description: `Subscription created and invoice sent to ${formData.customerEmail}`,
        });

        // Show payment link in a new window
        if (paymentLink) {
          window.open(paymentLink, '_blank');
        }
      } catch (invoiceError: any) {
        console.error('Invoice sending error:', invoiceError);
        toast({
          title: "Partial Success",
          description: "Subscription created but failed to send invoice. You can send it manually later.",
          variant: "default",
        });
      }

      onSuccess?.(subscription);
      onOpenChange(false);
      
      // Reset form
      setFormData({
        customerId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        productId: '',
        productName: '',
        price: 0,
        currency: '',
        quantity: 1,
        interval: 'month',
        startDate: new Date(),
        endDate: undefined,
        forever: true,
        paymentMethod: 'auto',
        billingMode: 'classic',
        invoiceTemplate: 'default',
        trialDays: 0,
        autoCharge: true,
        collectTax: false,
        description: '',
        invoiceMemo: '',
        invoiceFooter: '',
        customFields: false
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create subscription",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return formData.price * formData.quantity;
  };

  const getCurrencySymbol = () => {
    if (!formData.currency) return '';
    return CURRENCIES.find(c => c.value === formData.currency)?.symbol || formData.currency;
  };

  const generateInvoiceNumber = () => {
    return `INV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getEndDate = () => {
    if (formData.forever) return 'Forever';
    if (formData.endDate) return formatDate(formData.endDate);
    return 'Ongoing';
  };

  const getDurationText = () => {
    const start = formatDate(formData.startDate);
    const end = getEndDate();
    return `${start} → ${end}`;
  };

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  const isSectionComplete = (sectionId: string) => {
    switch (sectionId) {
      case 'customer': return !!formData.customerId;
      case 'duration': return !!formData.startDate;
      case 'pricing': return !!formData.productId && formData.price > 0;
      case 'billing': return !!formData.startDate;
      default: return true;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] h-[95vh] p-0 flex flex-col">
        <div className="flex h-full bg-gray-50">
          {/* Left Panel - Form with Collapsible Sections */}
          <div className="w-1/2 flex flex-col bg-white overflow-hidden">
            {/* Header */}
            <div className="border-b px-8 py-6 flex-shrink-0 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create a subscription</h1>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Form Content - Scrollable with Sections */}
            <div className="h-[calc(95vh-200px)] overflow-y-auto">
              <div className="px-8 py-6 max-w-xl space-y-4 pb-20">
                {SECTIONS.map((section) => (
                  <Collapsible
                    key={section.id}
                    open={openSections.has(section.id)}
                    onOpenChange={() => toggleSection(section.id)}
                    className="border rounded-lg"
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-4 h-auto hover:bg-[#2d5a5a]/5"
                      >
                        <div className="flex items-center space-x-3">
                          <section.icon className="h-5 w-5 text-gray-500" />
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">{section.title}</div>
                            {section.required && (
                              <div className="text-sm text-gray-500">Required</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isSectionComplete(section.id) && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {openSections.has(section.id) ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="px-4 pb-4">
                      {section.id === 'customer' && (
                        <div className="space-y-4">
                          <Select value={formData.customerId} onValueChange={handleCustomerSelect}>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Find or add a customer..." />
                            </SelectTrigger>
                            <SelectContent>
                              {customers.map(customer => (
                                <SelectItem key={customer._id} value={customer._id || ''}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{safeRender(customer.name)}</span>
                                    <span className="text-sm text-gray-500">{safeRender(customer.email)}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowAddCustomer(true)}
                            className="w-full"
                            disabled={!businessId}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add new customer
                          </Button>
                          
                          {customers.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">RECENT</p>
                              {customers.slice(0, 3).map(customer => (
                                <div 
                                  key={customer._id}
                                  className="flex items-center justify-between p-3 rounded-lg border border-[#2d5a5a]/20 cursor-pointer hover:bg-[#2d5a5a]/5"
                                  onClick={() => handleCustomerSelect(customer._id || '')}
                                >
                                  <div>
                                    <div className="font-medium">{safeRender(customer.name)}</div>
                                    <div className="text-sm text-gray-500">{safeRender(customer.email)}</div>
                                  </div>
                                  {formData.customerId === customer._id && (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {section.id === 'duration' && (
                        <div className="space-y-4">
                          <Popover open={showDurationPicker} onOpenChange={setShowDurationPicker}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal h-12"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {getDurationText()}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 mr-4" align="start">
                              <div className="flex">
                                <div className="p-6">
                                  <PaymesaCalendar
                                    selected={formData.startDate}
                                    onSelect={(date: Date) => setFormData(prev => ({ ...prev, startDate: date }))}
                                  />
                                </div>
                                <div className="border-l p-4 pr-10 w-48 bg-gray-50">
                                  <h4 className="font-medium mb-3 text-sm text-gray-700">Shortcuts</h4>
                                  <div className="space-y-1">
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start text-[#2d5a5a] hover:text-[#1f4a4a] hover:bg-[#2d5a5a]/5 text-sm py-2 px-3 rounded-md"
                                      onClick={() => {
                                        setFormData(prev => ({ ...prev, forever: true, endDate: undefined }));
                                        setShowDurationPicker(false);
                                      }}
                                    >
                                      Forever
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start text-sm py-2 px-3 rounded-md hover:bg-gray-100"
                                      onClick={() => {
                                        const endDate = new Date(formData.startDate);
                                        endDate.setMonth(endDate.getMonth() + 1);
                                        setFormData(prev => ({ ...prev, forever: false, endDate }));
                                        setShowDurationPicker(false);
                                      }}
                                    >
                                      1 month ({formatDate(new Date(formData.startDate.getTime() + 30 * 24 * 60 * 60 * 1000))})
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start text-sm py-2 px-3 rounded-md hover:bg-gray-100"
                                      onClick={() => {
                                        const endDate = new Date(formData.startDate);
                                        endDate.setMonth(endDate.getMonth() + 2);
                                        setFormData(prev => ({ ...prev, forever: false, endDate }));
                                        setShowDurationPicker(false);
                                      }}
                                    >
                                      2 months ({formatDate(new Date(formData.startDate.getTime() + 60 * 24 * 60 * 60 * 1000))})
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start text-sm py-2 px-3 rounded-md hover:bg-gray-100"
                                      onClick={() => {
                                        const endDate = new Date(formData.startDate);
                                        endDate.setMonth(endDate.getMonth() + 3);
                                        setFormData(prev => ({ ...prev, forever: false, endDate }));
                                        setShowDurationPicker(false);
                                      }}
                                    >
                                      3 months ({formatDate(new Date(formData.startDate.getTime() + 90 * 24 * 60 * 60 * 1000))})
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start text-sm py-2 px-3 rounded-md hover:bg-gray-100"
                                      onClick={() => {
                                        const endDate = new Date(formData.startDate);
                                        endDate.setMonth(endDate.getMonth() + 6);
                                        setFormData(prev => ({ ...prev, forever: false, endDate }));
                                        setShowDurationPicker(false);
                                      }}
                                    >
                                      6 months ({formatDate(new Date(formData.startDate.getTime() + 180 * 24 * 60 * 60 * 1000))})
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start text-sm py-2 px-3 rounded-md hover:bg-gray-100"
                                      onClick={() => {
                                        const endDate = new Date(formData.startDate);
                                        endDate.setFullYear(endDate.getFullYear() + 1);
                                        setFormData(prev => ({ ...prev, forever: false, endDate }));
                                        setShowDurationPicker(false);
                                      }}
                                    >
                                      12 months ({formatDate(new Date(formData.startDate.getTime() + 365 * 24 * 60 * 60 * 1000))})
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start text-[#2d5a5a] hover:text-[#1f4a4a] hover:bg-[#2d5a5a]/5 text-sm py-2 px-3 rounded-md"
                                      onClick={() => {
                                        setFormData(prev => ({ ...prev, forever: false }));
                                        setShowDurationPicker(false);
                                      }}
                                    >
                                      custom
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}

                      {section.id === 'pricing' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                            <div>PRODUCT</div>
                            <div>QTY</div>
                            <div>TOTAL</div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 items-center">
                            <div>
                              <Select value={formData.productId} onValueChange={handleProductSelect}>
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder="Find or add a product..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {products.map(product => (
                                    <SelectItem key={product._id} value={product._id || ''}>
                                      <div className="flex items-center justify-between w-full">
                                        <span>{safeRender(product.name)}</span>
                                        <span className="text-sm text-gray-500">
                                          {safeRender(product.currency)} {safeRender(product.price)}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Input
                                type="number"
                                min="1"
                                value={formData.quantity}
                                onChange={(e) => setFormData(prev => ({ 
                                  ...prev, 
                                  quantity: parseInt(e.target.value) || 1 
                                }))}
                                className="h-10"
                              />
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {formData.price > 0 ? `${getCurrencySymbol()}${calculateTotal()}` : '—'}
                              </div>
                              <div className="text-sm text-gray-500">per {formData.interval}</div>
                            </div>
                          </div>
                          
                                                      <div className="flex space-x-4 text-sm">
                              <Button 
                                variant="link" 
                                className="p-0 h-auto text-[#2d5a5a] hover:text-[#1f4a4a]"
                                onClick={() => setShowAddProduct(true)}
                              >
                                Add product
                              </Button>
                              <Button variant="link" className="p-0 h-auto text-[#2d5a5a] hover:text-[#1f4a4a]">
                                Add coupon
                              </Button>
                            </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={formData.collectTax}
                                onCheckedChange={(checked) => 
                                  setFormData(prev => ({ ...prev, collectTax: checked }))
                                }
                              />
                              <Label className="text-sm">Collect tax automatically</Label>
                            </div>
                            <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
                              Add tax manually
                            </Button>
                          </div>
                        </div>
                      )}

                      {section.id === 'billing' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                                                      <div className="flex items-center space-x-2 p-3 border border-[#2d5a5a]/20 rounded-lg bg-[#2d5a5a]/5">
                            <CalendarIcon className="h-5 w-5 text-[#2d5a5a]" />
                            <span className="text-gray-900">{formatDate(formData.startDate)}</span>
                          </div>
                            <p className="text-sm text-gray-500">
                              This is also when the next invoice will be generated.
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Free trial days</h4>
                                                      <Button variant="outline" className="w-full justify-start border-[#2d5a5a] text-[#2d5a5a] hover:bg-[#2d5a5a]/10">
                            <Plus className="h-4 w-4 mr-2" />
                            Add trial days
                          </Button>
                          </div>
                          

                        </div>
                      )}

                      {section.id === 'settings' && (
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-lg font-semibold mb-4">Payment</h4>
                            <RadioGroup 
                              value={formData.paymentMethod} 
                              onValueChange={(value: 'auto' | 'manual') => 
                                setFormData(prev => ({ ...prev, paymentMethod: value }))
                              }
                              className="space-y-4"
                            >
                              <div className="flex items-start space-x-3">
                                <RadioGroupItem value="auto" id="auto" />
                                <div className="flex-1">
                                  <Label htmlFor="auto" className="text-base font-medium">
                                    Automatically charge a payment method on file
                                  </Label>
                                  <p className="text-sm text-gray-500 mt-1">
                                    This customer doesn't have any valid payment methods on file.
                                  </p>
                                  <Button variant="outline" className="mt-2 border-[#2d5a5a] text-[#2d5a5a] hover:bg-[#2d5a5a]/10">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add a payment method
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3">
                                <RadioGroupItem value="manual" id="manual" />
                                <div className="flex-1">
                                  <Label htmlFor="manual" className="text-base font-medium">
                                    Email invoice to the customer to pay manually
                                  </Label>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Set your payment preferences, and we'll take care of the rest.
                                  </p>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold mb-4">Advanced settings</h4>
                            <div className="space-y-6">
                              <div>
                                <div className="flex items-center space-x-2 mb-3">
                                  <Label className="text-base font-medium">Billing mode</Label>
                                  <Info className="h-4 w-4 text-gray-400" />
                                </div>
                                <RadioGroup 
                                  value={formData.billingMode} 
                                  onValueChange={(value: 'classic' | 'flexible') => 
                                    setFormData(prev => ({ ...prev, billingMode: value }))
                                  }
                                  className="space-y-3"
                                >
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="classic" id="classic" />
                                    <Label htmlFor="classic">Classic</Label>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="flexible" id="flexible" />
                                    <Label htmlFor="flexible">Flexible</Label>
                                  </div>
                                </RadioGroup>
                              </div>

                              <div>
                                <Label className="text-base font-medium mb-3 block">Invoice template</Label>
                                <Select 
                                  value={formData.invoiceTemplate} 
                                  onValueChange={(value) => 
                                    setFormData(prev => ({ ...prev, invoiceTemplate: value }))
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a template..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {INVOICE_TEMPLATES.map(template => (
                                      <SelectItem key={template.value} value={template.value}>
                                        {template.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="checkbox"
                                    id="description"
                                    className="h-4 w-4"
                                  />
                                  <div className="flex items-center space-x-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Info className="h-4 w-4 text-gray-400" />
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="checkbox"
                                    id="invoiceMemo"
                                    className="h-4 w-4"
                                  />
                                  <Label htmlFor="invoiceMemo">Invoice memo</Label>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="checkbox"
                                    id="invoiceFooter"
                                    className="h-4 w-4"
                                  />
                                  <Label htmlFor="invoiceFooter">Invoice footer</Label>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="checkbox"
                                    id="customFields"
                                    className="h-4 w-4"
                                  />
                                  <div className="flex items-center space-x-2">
                                    <Label htmlFor="customFields">Custom invoice fields</Label>
                                    <Info className="h-4 w-4 text-gray-400" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                ))}

                {/* Add Phase Button */}
                <div className="pt-4">
                  <Button variant="outline" className="w-full h-12 border-[#2d5a5a] text-[#2d5a5a] hover:bg-[#2d5a5a]/10">
                    <Plus className="h-4 w-4 mr-2" />
                    Add phase
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer - Always Visible */}
            <div className="border-t px-8 py-4 bg-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <Button variant="link" className="p-0 h-auto text-gray-500">
                  Feedback?
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !formData.customerId || !formData.productId}
                  className="bg-[#2d5a5a] hover:bg-[#1f4a4a] text-white px-6 py-2 font-medium"
                >
                  {submitting ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create subscription'
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview (Stripe Style) */}
          <div className="w-1/2 bg-white border-l overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Preview</h3>
                <Button variant="ghost" size="sm">
                  Close preview
                </Button>
              </div>
              
              {/* Preview Tabs */}
              <div className="flex space-x-6 mt-4">
                <button
                  onClick={() => setPreviewTab('summary')}
                  className={cn(
                    "pb-2 border-b-2 font-medium text-sm",
                    previewTab === 'summary' 
                      ? 'border-[#2d5a5a] text-[#2d5a5a]' 
                      : 'border-transparent text-gray-500'
                  )}
                >
                  Summary
                </button>
                <button
                  onClick={() => setPreviewTab('invoice')}
                  className={cn(
                    "pb-2 border-b-2 font-medium text-sm",
                    previewTab === 'invoice' 
                      ? 'border-[#2d5a5a] text-[#2d5a5a]' 
                      : 'border-transparent text-gray-500'
                  )}
                >
                  Invoice
                </button>
                <button
                  onClick={() => setPreviewTab('code')}
                  className={cn(
                    "pb-2 border-b-2 font-medium text-sm",
                    previewTab === 'code' 
                      ? 'border-[#2d5a5a] text-[#2d5a5a]' 
                      : 'border-transparent text-gray-500'
                  )}
                >
                  Code
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {previewTab === 'summary' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{formatDate(formData.startDate)}</span>
                  </div>
                  <p className="text-sm text-gray-600">Subscription starts</p>
                  
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">First invoice</div>
                      <div className="text-sm text-gray-600">Amount due: {getCurrencySymbol()}{calculateTotal()}</div>
                      <div className="text-sm text-gray-500">Bills immediately for 1 month</div>
                    </div>
                  </div>
                </div>
              )}

              {previewTab === 'invoice' && (
                <div className="bg-white border rounded-lg p-8 space-y-8 max-w-2xl mx-auto">
                  {/* Invoice Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">Invoice</h2>
                      <p className="text-sm text-gray-600 mt-2">
                        Invoice number {generateInvoiceNumber()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Date due {formatDate(formData.startDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold text-gray-700">{businessName}</div>
                      <div className="text-sm text-gray-600">United States</div>
                    </div>
                  </div>

                  {/* Amount Due - Prominent Display */}
                  <div className="text-center py-6 border-b">
                    <div className="text-4xl font-bold text-gray-900">
                      {getCurrencySymbol()}{calculateTotal()} due {formatDate(formData.startDate)}
                    </div>
                  </div>

                  {/* Billing Info - Two Column Layout */}
                  <div className="grid grid-cols-2 gap-8 text-sm">
                    <div>
                      <div className="font-semibold text-gray-900 mb-3 text-base">Bill to</div>
                      <div className="space-y-1 text-gray-600">
                        <div>{formData.customerName || 'Customer Name'}</div>
                        <div>Ghana</div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {formData.customerPhone || '+233 55 666 6666'}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {formData.customerEmail || 'customer@example.com'}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-3 text-base">Ship to</div>
                      <div className="space-y-1 text-gray-600">
                        <div>{formData.customerName || 'Customer Name'}</div>
                        <div>Ghana</div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {formData.customerPhone || '+233 55 666 6666'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="border-t pt-6">
                    <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 border-b pb-3">
                      <div>Description</div>
                      <div className="text-center">Qty</div>
                      <div className="text-center">Unit price</div>
                      <div className="text-right">Amount</div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 py-4 text-sm border-b">
                      <div>
                        <div className="font-medium text-gray-900">{safeRender(formData.productName)}</div>
                        <div className="text-gray-500 text-xs mt-1">
                          {formatDate(formData.startDate)} – {getEndDate()}
                        </div>
                      </div>
                      <div className="text-center">{formData.quantity}</div>
                      <div className="text-center">{getCurrencySymbol()}{safeRender(formData.price)}</div>
                      <div className="text-right font-medium">{getCurrencySymbol()}{calculateTotal()}</div>
                    </div>
                  </div>

                  {/* Totals Section */}
                  <div className="flex justify-end">
                    <div className="space-y-3 text-sm w-48">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>{getCurrencySymbol()}{calculateTotal()}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{getCurrencySymbol()}{calculateTotal()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Amount due</span>
                        <span>{getCurrencySymbol()}{calculateTotal()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t pt-4 text-left text-xs text-gray-500">
                    {generateInvoiceNumber()} · {getCurrencySymbol()}{calculateTotal()} due {formatDate(formData.startDate)}
                  </div>
                </div>
              )}

              {previewTab === 'code' && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm text-gray-500">API code will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
      
      {/* Add Customer Dialog */}
      <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <h2 className="text-xl font-semibold">New Customer</h2>
              <p className="text-sm text-muted-foreground">
                Create a new customer for this subscription. Fill in the required information below.
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowAddCustomer(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <CustomerForm
            onSubmit={async (customerData) => {
              try {
                // Transform CustomerFormData to CustomerCreationData
                const apiData = {
                  name: customerData.name,
                  email: customerData.email,
                  phone: customerData.phone,
                  description: customerData.description,
                  billingAddress: customerData.billingAddress,
                  shippingAddress: customerData.shippingAddress,
                  metadata: {
                    ...customerData.metadata,
                    phoneCountry: customerData.phoneCountry,
                    useShippingAsBilling: customerData.useShippingAsBilling.toString()
                  },
                  businessId: businessId || ''
                };
                
                console.log('Sending customer data to API:', apiData);
                
                // Create customer using CustomerService
                const customerService = new CustomerService();
                const createdCustomer = await customerService.createCustomer(apiData);
                
                setCustomers(prev => [...prev, createdCustomer]);
                setFormData(prev => ({
                  ...prev,
                  customerId: createdCustomer._id || '',
                  customerName: createdCustomer.name,
                  customerEmail: createdCustomer.email,
                  customerPhone: createdCustomer.phone || ''
                }));
                setShowAddCustomer(false);
                
                toast({
                  title: "Success!",
                  description: "Customer created successfully",
                });
              } catch (error) {
                console.error('Customer creation error:', error);
                toast({
                  title: "Error",
                  description: "Failed to create customer. Please try again.",
                  variant: "destructive"
                });
              }
            }}
            onCancel={() => setShowAddCustomer(false)}
            isLoading={false}
          />
        </DialogContent>
      </Dialog>
      
      {/* Add Product Dialog */}
      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <h2 className="text-xl font-semibold">New Product</h2>
              <p className="text-sm text-muted-foreground">
                Create a new product for this subscription. Fill in the required information below.
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowAddProduct(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <ProductForm
            businessId={businessId || ''}
            onSubmit={(createdProduct) => {
              setProducts(prev => [...prev, createdProduct]);
              setFormData(prev => ({
                ...prev,
                productId: createdProduct._id || createdProduct.id || '',
                productName: createdProduct.name,
                price: createdProduct.price,
                currency: createdProduct.currency || 'USD'
              }));
              setShowAddProduct(false);
              
              toast({
                title: "Success!",
                description: "Product created successfully",
              });
            }}
            onCancel={() => setShowAddProduct(false)}
            onPreview={() => {
              // Handle preview functionality
              toast({
                title: "Preview",
                description: "Product preview functionality coming soon",
              });
            }}
            isLoading={isCreatingProduct}
          />
        </DialogContent>
      </Dialog>
    </Dialog>
  );
} 