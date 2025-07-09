import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Phone,
  Building,
  Shield,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

// Mock payment methods and country data
const countries = [
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
  { code: "GH", name: "Ghana" },
  { code: "ZA", name: "South Africa" },
  { code: "EG", name: "Egypt" },
  { code: "CM", name: "Cameroon" },
  { code: "TZ", name: "Tanzania" },
  { code: "UG", name: "Uganda" },
  { code: "RW", name: "Rwanda" },
  { code: "SN", name: "Senegal" },
];

const currencies = [
  { code: "USD", name: "US Dollar (USD)" },
  { code: "NGN", name: "Nigerian Naira (NGN)" },
  { code: "KES", name: "Kenyan Shilling (KES)" },
  { code: "GHS", name: "Ghanaian Cedi (GHS)" },
  { code: "ZAR", name: "South African Rand (ZAR)" },
  { code: "EGP", name: "Egyptian Pound (EGP)" },
  { code: "XAF", name: "Central African CFA franc (XAF)" },
  { code: "TZS", name: "Tanzanian Shilling (TZS)" },
  { code: "UGX", name: "Ugandan Shilling (UGX)" },
  { code: "RWF", name: "Rwandan Franc (RWF)" },
];

const mobileMoney = [
  { id: "mtn", name: "MTN Mobile Money", countries: ["NG", "GH", "UG", "RW", "CM"] },
  { id: "mpesa", name: "M-Pesa", countries: ["KE", "TZ"] },
  { id: "airtel", name: "Airtel Money", countries: ["NG", "KE", "UG", "TZ", "RW"] },
  { id: "orange", name: "Orange Money", countries: ["CM", "SN"] },
  { id: "vodafone", name: "Vodafone Cash", countries: ["GH"] },
];

export type CheckoutFormProps = {
  amount?: number;
  currency?: string;
  companyName?: string;
  companyLogo?: string;
  customerEmail?: string;
  allowedPaymentMethods?: string[];
  onPaymentSuccess?: (paymentData: any) => void;
  onPaymentError?: (error: any) => void;
};

export function CheckoutForm({
  amount = 1000,
  currency = "USD",
  companyName = "PayAfric Demo",
  companyLogo = "",
  customerEmail = "",
  allowedPaymentMethods = ["card", "mobileMoney", "bankTransfer"],
  onPaymentSuccess,
  onPaymentError,
}: CheckoutFormProps) {
  const [activeTab, setActiveTab] = useState(allowedPaymentMethods[0] || "card");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [selectedCountry, setSelectedCountry] = useState("NG");
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [selectedMobileProvider, setSelectedMobileProvider] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showCardCVC, setShowCardCVC] = useState(false);
  
  // Filtered mobile money providers based on selected country
  const filteredMobileProviders = mobileMoney.filter(provider => 
    provider.countries.includes(selectedCountry)
  );
  
  // Form data
  const [formData, setFormData] = useState({
    // Card payment
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardName: "",
    
    // Customer details
    email: customerEmail,
    name: "",
    phone: "",
    
    // Mobile Money
    mobileNumber: "",
    
    // Bank Transfer
    accountNumber: "",
    bankName: "",
    
    // Address
    country: selectedCountry,
    address: "",
    city: "",
    postalCode: "",
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
      
      setFormData({ ...formData, [name]: formatted });
      return;
    }
    
    // Format expiry date
    if (name === "cardExpiry") {
      const expiry = value
        .replace(/\D/g, "")
        .replace(/^(.{2})/, "$1/")
        .slice(0, 5);
      
      setFormData({ ...formData, [name]: expiry });
      return;
    }
    
    // Regular input handling
    setFormData({ ...formData, [name]: value });
  };
  
  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setFormData({ ...formData, country: value });
    
    // Reset mobile provider if not available in the new country
    const providerAvailable = mobileMoney.some(
      provider => provider.id === selectedMobileProvider && provider.countries.includes(value)
    );
    
    if (!providerAvailable) {
      setSelectedMobileProvider("");
    }
  };
  
  const handlePayment = () => {
    // Basic validation
    if (!formData.email || !formData.name) {
      setErrorMessage("Please fill in all required fields");
      setPaymentStatus("error");
      return;
    }
    
    if (activeTab === "card" && (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvc)) {
      setErrorMessage("Please fill in all card details");
      setPaymentStatus("error");
      return;
    }
    
    if (activeTab === "mobileMoney" && (!selectedMobileProvider || !formData.mobileNumber)) {
      setErrorMessage("Please select a mobile money provider and enter your mobile number");
      setPaymentStatus("error");
      return;
    }
    
    setPaymentStatus("processing");
    setErrorMessage("");
    
    // Simulate payment processing
    setTimeout(() => {
      // 90% success rate for demo
      if (Math.random() > 0.1) {
        setPaymentStatus("success");
        if (onPaymentSuccess) {
          onPaymentSuccess({
            amount,
            currency: selectedCurrency,
            paymentMethod: activeTab,
            customer: {
              email: formData.email,
              name: formData.name,
            },
            transactionId: `TX-${Math.floor(Math.random() * 1000000)}`,
          });
        }
      } else {
        setPaymentStatus("error");
        setErrorMessage("Payment failed. Please try again or use a different payment method.");
        if (onPaymentError) {
          onPaymentError({
            message: "Payment failed",
            code: "payment_failed",
          });
        }
      }
    }, 2000);
  };
  
  const formatCurrency = (value: number, currencyCode = selectedCurrency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(value / 100);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2 border-b bg-gradient-to-r from-green-500/10 to-yellow-500/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">{companyName}</CardTitle>
              <CardDescription>Secure payment powered by PayAfric</CardDescription>
            </div>
            {companyLogo && (
              <img 
                src={companyLogo} 
                alt={`${companyName} logo`} 
                className="h-8 w-auto" 
              />
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          {/* Amount display */}
          <div className="flex items-center justify-between mb-6 p-3 bg-gradient-to-r from-green-500/10 to-yellow-500/10 rounded-md">
            <div>
              <p className="text-sm text-gray-500">Amount due</p>
              <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
            </div>
            <Select 
              defaultValue={selectedCurrency}
              onValueChange={setSelectedCurrency}
            >
              <SelectTrigger className="w-[130px] bg-white">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Customer Information */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900">Customer Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="email" className="text-gray-700">Email address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                  className="mt-1 border-gray-300 focus:border-[#1e8449] focus:ring-[#1e8449]"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="name" className="text-gray-700">Full name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  className="mt-1 border-gray-300 focus:border-[#1e8449] focus:ring-[#1e8449]"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="phone" className="text-gray-700">Phone number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+234 800 123 4567"
                  className="mt-1 border-gray-300 focus:border-[#1e8449] focus:ring-[#1e8449]"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="country" className="text-gray-700">Country *</Label>
                <Select
                  value={selectedCountry}
                  onValueChange={handleCountryChange}
                >
                  <SelectTrigger id="country" className="mt-1 border-gray-300 focus:border-[#1e8449] focus:ring-[#1e8449]">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Payment Method</h3>
            
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full bg-gray-100">
                {allowedPaymentMethods.includes("card") && (
                  <TabsTrigger 
                    value="card"
                    className={activeTab === "card" ? "data-[state=active]:bg-white data-[state=active]:text-[#1e8449]" : ""}
                  >
                    <CreditCard className="h-4 w-4 mr-1" /> Card
                  </TabsTrigger>
                )}
                
                {allowedPaymentMethods.includes("mobileMoney") && (
                  <TabsTrigger 
                    value="mobileMoney"
                    className={activeTab === "mobileMoney" ? "data-[state=active]:bg-white data-[state=active]:text-[#1e8449]" : ""}
                  >
                    <Phone className="h-4 w-4 mr-1" /> Mobile
                  </TabsTrigger>
                )}
                
                {allowedPaymentMethods.includes("bankTransfer") && (
                  <TabsTrigger 
                    value="bankTransfer"
                    className={activeTab === "bankTransfer" ? "data-[state=active]:bg-white data-[state=active]:text-[#1e8449]" : ""}
                  >
                    <Building className="h-4 w-4 mr-1" /> Bank
                  </TabsTrigger>
                )}
              </TabsList>
              
              {/* Card Payment Form */}
              <TabsContent value="card" className="pt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber" className="text-gray-700">Card number *</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="mt-1 border-gray-300 focus:border-[#1e8449] focus:ring-[#1e8449] font-mono"
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry" className="text-gray-700">Expiry date *</Label>
                      <Input
                        id="cardExpiry"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="mt-1 border-gray-300 focus:border-[#1e8449] focus:ring-[#1e8449] font-mono"
                        maxLength={5}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cardCvc" className="text-gray-700">CVC *</Label>
                      <div className="relative mt-1">
                        <Input
                          id="cardCvc"
                          name="cardCvc"
                          type={showCardCVC ? "text" : "password"}
                          value={formData.cardCvc}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="border-gray-300 focus:border-[#1e8449] focus:ring-[#1e8449] pr-10 font-mono"
                          maxLength={4}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
                          onClick={() => setShowCardCVC(!showCardCVC)}
                        >
                          {showCardCVC ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="cardName" className="text-gray-700">Name on card *</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="mt-1 border-gray-300 focus:border-[#1e8449] focus:ring-[#1e8449]"
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Mobile Money Form */}
              <TabsContent value="mobileMoney" className="pt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mobileProvider" className="text-gray-700">Mobile money provider *</Label>
                    <Select
                      value={selectedMobileProvider}
                      onValueChange={setSelectedMobileProvider}
                    >
                      <SelectTrigger 
                        id="mobileProvider" 
                        className="mt-1 border-gray-300 focus:border-[#1e8449] focus:ring-[#1e8449]"
                      >
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredMobileProviders.length > 0 ? (
                          filteredMobileProviders.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No providers available in your country
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="mobileNumber" className="text-gray-700">Mobile number *</Label>
                    <Input
                      id="mobileNumber"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., 08012345678"
                      className="mt-1 border-gray-300 focus:border-[#1e8449] focus:ring-[#1e8449]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      We'll send a payment request to this mobile number
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              {/* Bank Transfer Form */}
              <TabsContent value="bankTransfer" className="pt-4">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-md text-sm">
                    <p className="text-yellow-800">
                      Pay via bank transfer to complete your transaction. Bank details will be provided after you submit.
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="bankName" className="text-gray-700">Bank name *</Label>
                    <Select
                      value={formData.bankName}
                      onValueChange={(value) => setFormData({ ...formData, bankName: value })}
                    >
                      <SelectTrigger 
                        id="bankName" 
                        className="mt-1 border-gray-300 focus:border-[#1e8449] focus:ring-[#1e8449]"
                      >
                        <SelectValue placeholder="Select your bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zenith">Zenith Bank</SelectItem>
                        <SelectItem value="gtb">Guaranty Trust Bank</SelectItem>
                        <SelectItem value="access">Access Bank</SelectItem>
                        <SelectItem value="firstbank">First Bank</SelectItem>
                        <SelectItem value="uba">United Bank for Africa</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Error message */}
          {paymentStatus === "error" && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {errorMessage || "Payment failed. Please try again."}
            </div>
          )}
          
          {/* Success message */}
          {paymentStatus === "success" && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-sm flex items-start">
              <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Payment successful!</p>
                <p>Thank you for your payment. A receipt has been sent to your email.</p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col items-stretch gap-4 pt-6 border-t">
          <Button 
            onClick={handlePayment} 
            className="w-full bg-[#1e8449] hover:bg-[#196f3d] h-12 text-base"
            disabled={paymentStatus === "processing" || paymentStatus === "success"}
          >
            {paymentStatus === "processing" ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : paymentStatus === "success" ? (
              "Payment Complete"
            ) : (
              `Pay ${formatCurrency(amount)}`
            )}
          </Button>
          
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Shield className="h-4 w-4" />
            <span>Secure payment processed by PayAfric</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
