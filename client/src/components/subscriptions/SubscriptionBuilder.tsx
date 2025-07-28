import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  User, 
  Package, 
  CreditCard, 
  Settings, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  X,
  Sparkles,
  DollarSign,
  Clock,
  Users,
  Zap
} from "lucide-react";
import { Product, ProductService } from "@/services/product.service";
import CustomerService, { Customer } from "@/services/customer.service";
import SubscriptionService, { Subscription } from "@/services/subscription.service";
import BusinessService from "@/services/business.service";
import { useToast } from "@/components/ui/use-toast";
import { AddCustomerModal } from "./AddCustomerModal";

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
  
  // Trial & Settings
  trialDays: number;
  autoCharge: boolean;
  collectTax: boolean;
  
  // Advanced
  metadata: Record<string, string>;
  description: string;
  invoiceMemo: string;
}

const STEPS = [
  { id: 'customer', title: 'Customer', icon: User, description: 'Select or create customer' },
  { id: 'product', title: 'Product', icon: Package, description: 'Choose subscription product' },
  { id: 'billing', title: 'Billing', icon: CreditCard, description: 'Set billing details' },
  { id: 'settings', title: 'Settings', icon: Settings, description: 'Configure options' },
  { id: 'review', title: 'Review', icon: CheckCircle, description: 'Review and create' }
];

const BILLING_INTERVALS = [
  { value: 'day', label: 'Daily', description: 'Charge every day' },
  { value: 'week', label: 'Weekly', description: 'Charge every week' },
  { value: 'month', label: 'Monthly', description: 'Charge every month' },
  { value: 'year', label: 'Yearly', description: 'Charge every year' }
];

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'NGN', label: 'NGN (₦)', symbol: '₦' },
  { value: 'KES', label: 'KES (KSh)', symbol: 'KSh' },
  { value: 'GHS', label: 'GHS (₵)', symbol: '₵' }
];

export function SubscriptionBuilder({ open, onOpenChange, onSuccess }: SubscriptionBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SubscriptionFormData>({
    customerId: '',
    customerName: '',
    customerEmail: '',
    productId: '',
    productName: '',
    price: 0,
    currency: 'USD',
    quantity: 1,
    interval: 'month',
    startDate: new Date(),
    endDate: undefined,
    forever: true,
    trialDays: 0,
    autoCharge: true,
    collectTax: false,
    metadata: {},
    description: '',
    invoiceMemo: ''
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  
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
      setBusinessId(business._id);
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
      setCustomers(customersList.customers || []);
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const productService = new ProductService();
      const productsList = await productService.getProducts({ active: true });
      setProducts(productsList.data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find(c => c._id === customerId);
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customerId: customer._id || '',
        customerName: customer.name,
        customerEmail: customer.email
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
          ...formData.metadata,
          description: formData.description,
          invoiceMemo: formData.invoiceMemo,
          trialDays: formData.trialDays,
          autoCharge: formData.autoCharge,
          collectTax: formData.collectTax
        }
      };

      const subscription = await SubscriptionService.createSubscription(subscriptionData);
      
      toast({
        title: "Success!",
        description: "Subscription created successfully",
      });

      onSuccess?.(subscription);
      onOpenChange(false);
      
      // Reset form
      setFormData({
        customerId: '',
        customerName: '',
        customerEmail: '',
        productId: '',
        productName: '',
        price: 0,
        currency: 'USD',
        quantity: 1,
        interval: 'month',
        startDate: new Date(),
        endDate: undefined,
        forever: true,
        trialDays: 0,
        autoCharge: true,
        collectTax: false,
        metadata: {},
        description: '',
        invoiceMemo: ''
      });
      setCurrentStep(0);
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

  const getStepValidation = () => {
    switch (currentStep) {
      case 0: return formData.customerId;
      case 1: return formData.productId;
      case 2: return formData.price > 0 && formData.interval;
      case 3: return true; // Settings are optional
      case 4: return formData.customerId && formData.productId;
      default: return false;
    }
  };

  const calculateTotal = () => {
    return formData.price * formData.quantity;
  };

  const getCurrencySymbol = () => {
    return CURRENCIES.find(c => c.value === formData.currency)?.symbol || '$';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Left Panel - Form */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <DialogHeader className="px-8 py-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold">Create Subscription</DialogTitle>
                  <p className="text-gray-600 mt-1">Set up recurring billing for your customers</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Step Indicator */}
              <div className="flex items-center mt-6 space-x-4">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      index <= currentStep 
                        ? 'bg-primary border-primary text-white' 
                        : 'border-gray-300 text-gray-500'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <step.icon className="h-4 w-4" />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className={`text-sm font-medium ${
                        index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-400">{step.description}</div>
                    </div>
                    {index < STEPS.length - 1 && (
                      <ArrowRight className="h-4 w-4 mx-4 text-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            </DialogHeader>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Select Customer</h3>
                    <div className="space-y-4">
                      <Select value={formData.customerId} onValueChange={handleCustomerSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an existing customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map(customer => (
                            <SelectItem key={customer._id} value={customer._id || ''}>
                              <div className="flex flex-col">
                                <span className="font-medium">{customer.name}</span>
                                <span className="text-sm text-gray-500">{customer.email}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <div className="flex items-center">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="px-4 text-sm text-gray-500">or</span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddCustomer(true)}
                        className="w-full"
                        disabled={!businessId}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Customer
                      </Button>
                    </div>
                  </div>

                  {formData.customerId && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{formData.customerName}</div>
                            <div className="text-sm text-gray-500">{formData.customerEmail}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Select Product</h3>
                    <div className="space-y-4">
                      <Select value={formData.productId} onValueChange={handleProductSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(product => (
                            <SelectItem key={product._id} value={product._id || ''}>
                              <div className="flex items-center justify-between">
                                <span>{product.name}</span>
                                <span className="text-sm text-gray-500">
                                  {product.currency} {product.price}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Product (Coming Soon)
                      </Button>
                    </div>
                  </div>

                  {formData.productId && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{formData.productName}</div>
                              <div className="text-sm text-gray-500">Product</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              {getCurrencySymbol()}{formData.price}
                            </div>
                            <div className="text-sm text-gray-500">Base price</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Billing Configuration</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label>Billing Interval</Label>
                        <Select value={formData.interval} onValueChange={(value: any) => 
                          setFormData(prev => ({ ...prev, interval: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {BILLING_INTERVALS.map(interval => (
                              <SelectItem key={interval.value} value={interval.value}>
                                <div>
                                  <div className="font-medium">{interval.label}</div>
                                  <div className="text-sm text-gray-500">{interval.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Currency</Label>
                        <Select value={formData.currency} onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, currency: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CURRENCIES.map(currency => (
                              <SelectItem key={currency.value} value={currency.value}>
                                {currency.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={formData.quantity}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            quantity: parseInt(e.target.value) || 1 
                          }))}
                          className="w-32"
                        />
                      </div>

                      <div>
                        <Label>Start Date</Label>
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => date && setFormData(prev => ({ ...prev, startDate: date }))}
                          className="rounded-md border"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="forever"
                          checked={formData.forever}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ ...prev, forever: !!checked }))
                          }
                        />
                        <Label htmlFor="forever">No end date (forever)</Label>
                      </div>

                      {!formData.forever && (
                        <div>
                          <Label>End Date</Label>
                          <Calendar
                            mode="single"
                            selected={formData.endDate}
                            onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                            disabled={(date) => date < formData.startDate}
                            className="rounded-md border"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pricing Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Base Price</span>
                          <span>{getCurrencySymbol()}{formData.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quantity</span>
                          <span>× {formData.quantity}</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between font-semibold">
                          <span>Total per {formData.interval}</span>
                          <span>{getCurrencySymbol()}{calculateTotal()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Advanced Settings</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <Label>Trial Period (Days)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.trialDays}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            trialDays: parseInt(e.target.value) || 0 
                          }))}
                          className="w-32"
                          placeholder="0"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Number of days before first charge
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Auto-charge customer</Label>
                            <p className="text-sm text-gray-500">
                              Automatically charge the customer on billing dates
                            </p>
                          </div>
                          <Switch
                            checked={formData.autoCharge}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({ ...prev, autoCharge: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Collect tax automatically</Label>
                            <p className="text-sm text-gray-500">
                              Apply tax rates based on customer location
                            </p>
                          </div>
                          <Switch
                            checked={formData.collectTax}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({ ...prev, collectTax: checked }))
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            description: e.target.value 
                          }))}
                          placeholder="Optional description for this subscription"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Invoice Memo</Label>
                        <Textarea
                          value={formData.invoiceMemo}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            invoiceMemo: e.target.value 
                          }))}
                          placeholder="Optional memo to appear on invoices"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Review & Create</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Customer Info */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            Customer
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm text-gray-500">Name:</span>
                              <div className="font-medium">{formData.customerName}</div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Email:</span>
                              <div className="font-medium">{formData.customerEmail}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Product Info */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Package className="h-5 w-5 mr-2" />
                            Product
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm text-gray-500">Name:</span>
                              <div className="font-medium">{formData.productName}</div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Price:</span>
                              <div className="font-medium">
                                {getCurrencySymbol()}{formData.price} × {formData.quantity}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Billing Info */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <CreditCard className="h-5 w-5 mr-2" />
                            Billing
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm text-gray-500">Interval:</span>
                              <div className="font-medium capitalize">{formData.interval}</div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Start Date:</span>
                              <div className="font-medium">
                                {formData.startDate.toLocaleDateString()}
                              </div>
                            </div>
                            {!formData.forever && formData.endDate && (
                              <div>
                                <span className="text-sm text-gray-500">End Date:</span>
                                <div className="font-medium">
                                  {formData.endDate.toLocaleDateString()}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Settings */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Settings className="h-5 w-5 mr-2" />
                            Settings
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Trial Days:</span>
                              <span className="font-medium">{formData.trialDays}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Auto-charge:</span>
                              <Badge variant={formData.autoCharge ? "default" : "secondary"}>
                                {formData.autoCharge ? "Yes" : "No"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Collect Tax:</span>
                              <Badge variant={formData.collectTax ? "default" : "secondary"}>
                                {formData.collectTax ? "Yes" : "No"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Final Summary */}
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">Total Amount</h4>
                            <p className="text-sm text-gray-600">
                              {getCurrencySymbol()}{calculateTotal()} per {formData.interval}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-primary">
                              {getCurrencySymbol()}{calculateTotal()}
                            </div>
                            <div className="text-sm text-gray-500">per {formData.interval}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t px-8 py-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                
                <div className="flex items-center space-x-2">
                  {currentStep < STEPS.length - 1 ? (
                    <Button
                      onClick={handleNext}
                      disabled={!getStepValidation()}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting || !getStepValidation()}
                      className="min-w-[140px]"
                    >
                      {submitting ? (
                        <>
                          <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Create Subscription
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-96 bg-gray-50 border-l p-6 overflow-y-auto">
            <div className="sticky top-0">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="invoice">Invoice</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{formData.customerName || 'Select customer'}</div>
                            <div className="text-sm text-gray-500">Customer</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{formData.productName || 'Select product'}</div>
                            <div className="text-sm text-gray-500">Product</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium capitalize">{formData.interval}</div>
                            <div className="text-sm text-gray-500">Billing interval</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {getCurrencySymbol()}{calculateTotal()}
                            </div>
                            <div className="text-sm text-gray-500">Per {formData.interval}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="invoice" className="mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center text-gray-500 py-8">
                        <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-sm">Invoice preview will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="code" className="mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center text-gray-500 py-8">
                        <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-sm">API code will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
      
      {/* Add Customer Modal */}
      <AddCustomerModal
        open={showAddCustomer}
        onOpenChange={setShowAddCustomer}
        onAdd={(customer) => {
          setCustomers(prev => [...prev, customer]);
          setFormData(prev => ({
            ...prev,
            customerId: customer._id,
            customerName: customer.name,
            customerEmail: customer.email
          }));
          setShowAddCustomer(false);
        }}
        businessId={businessId || ''}
      />
    </Dialog>
  );
} 