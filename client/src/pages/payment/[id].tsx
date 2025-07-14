import {useState, useEffect} from 'react';
import {useRoute, useLocation} from 'wouter';
import {paymentLinkService} from '@/services/payment-link.service';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {CreditCard, DollarSign, Smartphone, User, Mail, Phone, MapPin, Lock} from 'lucide-react';

// Format currency
const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

interface PaymentLink {
  imageUrl?: string;
  title?: string;
  description?: string;
  amount?: number;
  currency?: string;
  requiredFields?: {
    customerName?: boolean;
    customerEmail?: boolean;
    customerPhone?: boolean;
    shippingAddress?: boolean;
  };
  paymentMethodTypes?: string[];
  // Add any other fields you expect
}

export default function PaymentPage() {
  const [paymentMatch, paymentParams] = useRoute('/payment/:id');
  const [plMatch, plParams] = useRoute('/pl_:id');
  const location = useLocation();
  
  // Get link ID from either route pattern
  const linkId = paymentParams?.id || plParams?.id || location[0].substring(4); // Handle both route formats
  
  const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"card" | "mobile" | "bank" | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Fetch payment link data
  useEffect(() => {
    const fetchPaymentLink = async () => {
      if (!linkId) return;
      
      try {
        setLoading(true);
        const data = await paymentLinkService.getPublicPaymentLink(linkId);
        setPaymentLink(data);
        
        // Set default payment method based on available options
        if (data.paymentMethodTypes && data.paymentMethodTypes.length > 0) {
          const method = data.paymentMethodTypes[0];
          if (method === 'card') setSelectedPaymentMethod('card');
          else if (method === 'mobile_money') setSelectedPaymentMethod('mobile');
          else if (method === 'bank_transfer') setSelectedPaymentMethod('bank');
        }
      } catch (err: unknown) {
        console.error('Error fetching payment link:', err);
        setError(err.message || 'Failed to load payment link. It may be expired or invalid.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaymentLink();
  }, [linkId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (paymentLink?.requiredFields?.customerName && !customerInfo.name) {
      alert('Please enter your name');
      return;
    }
    
    if (paymentLink?.requiredFields?.customerEmail && !customerInfo.email) {
      alert('Please enter your email');
      return;
    }
    
    if (paymentLink?.requiredFields?.customerPhone && !customerInfo.phone) {
      alert('Please enter your phone number');
      return;
    }
    
    if (paymentLink?.requiredFields?.shippingAddress && !customerInfo.address) {
      alert('Please enter your shipping address');
      return;
    }
    
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    // Simulate payment processing
    setProcessingPayment(true);
    
    // This would be replaced with actual payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentComplete(true);
    }, 2000);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e8449]"></div>
        <p className="mt-4 text-gray-600">Loading payment...</p>
      </div>
    );
  }
  
  if (error || !paymentLink) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Error</h1>
          <p className="text-gray-700">{error || 'Payment link not found or invalid'}</p>
          <Button className="mt-6 w-full" onClick={() => window.location.href = '/'}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }
  
  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">Thank you for your payment. A receipt has been sent to your email.</p>
            <p className="text-xl font-bold text-[#1e8449] mb-8">
              {formatCurrency(paymentLink.amount, paymentLink.currency)}
            </p>
            <Button className="w-full" onClick={() => window.location.href = '/'}>
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto p-4">
        {/* Payment Link Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden my-8">
          {/* Product Image Section */}
          <div className="relative">
            {/* Large Featured Image */}
            {paymentLink.imageUrl ? (
              <div className="w-full aspect-[16/9] overflow-hidden">
                <img
                  src={paymentLink.imageUrl}
                  alt={paymentLink.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            ) : (
              <div className="w-full aspect-[16/9] bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <DollarSign size={80} className="text-white/80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            )}

            {/* Floating Header */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
              <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <DollarSign className="h-4 w-4 text-[#1e8449]" />
                <span className="text-sm font-semibold ml-1">Paymesa</span>
              </div>
            </div>

            {/* Title & Amount Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {paymentLink.title}
              </h2>
              {paymentLink.description && (
                <p className="text-white/90 mt-2 line-clamp-2">
                  {paymentLink.description}
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handlePayment}>
            {/* Payment Info Section */}
            <div className="p-6">
              {/* Large Price Display */}
              <div className="flex justify-between items-center border-b border-gray-100 pb-6 mb-6">
                <div className="font-medium text-gray-500">Total Amount</div>
                <div className="text-3xl font-bold text-[#1e8449]">
                  {formatCurrency(paymentLink.amount, paymentLink.currency)}
                </div>
              </div>
              
              {/* Customer Info Fields */}
              <div className="space-y-5 mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">Customer Details</h3>
                  <span className="text-xs text-gray-500">Required fields</span>
                </div>

                <div className="grid gap-4">
                  {paymentLink.requiredFields?.customerName && (
                    <div className="relative">
                      <Label htmlFor="name" className="sr-only">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        placeholder="Full Name" 
                        className="pl-9 border-gray-200 focus:border-[#1e8449] focus:ring-[#1e8449] rounded-lg" 
                        required
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  )}

                  {paymentLink.requiredFields?.customerEmail && (
                    <div className="relative">
                      <Label htmlFor="email" className="sr-only">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        placeholder="Email Address" 
                        className="pl-9 border-gray-200 focus:border-[#1e8449] focus:ring-[#1e8449] rounded-lg" 
                        required
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  )}

                  {paymentLink.requiredFields?.customerPhone && (
                    <div className="relative">
                      <Label htmlFor="phone" className="sr-only">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number" 
                        className="pl-9 border-gray-200 focus:border-[#1e8449] focus:ring-[#1e8449] rounded-lg" 
                        required
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  )}

                  {paymentLink.requiredFields?.shippingAddress && (
                    <div className="relative">
                      <Label htmlFor="address" className="sr-only">Shipping Address</Label>
                      <Textarea 
                        id="address" 
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        placeholder="Shipping Address" 
                        className="pl-9 border-gray-200 focus:border-[#1e8449] focus:ring-[#1e8449] rounded-lg" 
                        required
                      />
                      <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">Payment Method</h3>
                  <span className="text-xs text-gray-500">Choose one</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(!paymentLink.paymentMethodTypes || paymentLink.paymentMethodTypes.includes('card')) && (
                    <div
                      className={`relative border border-gray-200 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPaymentMethod === "card"
                          ? "border-[#1e8449] bg-green-50 shadow"
                          : "hover:border-gray-300 hover:shadow-sm"
                      }`}
                      onClick={() => setSelectedPaymentMethod("card")}
                    >
                      <div className="flex flex-col items-center">
                        <CreditCard className={`h-6 w-6 mb-2 ${selectedPaymentMethod === "card" ? "text-[#1e8449]" : "text-gray-400"}`} />
                        <span className="text-sm font-medium">Credit Card</span>
                      </div>
                      {selectedPaymentMethod === "card" && (
                        <div className="absolute top-2 right-2 h-2 w-2 bg-[#1e8449] rounded-full"></div>
                      )}
                    </div>
                  )}

                  {(!paymentLink.paymentMethodTypes || paymentLink.paymentMethodTypes.includes('mobile_money')) && (
                    <div
                      className={`relative border border-gray-200 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPaymentMethod === "mobile"
                          ? "border-[#1e8449] bg-green-50 shadow"
                          : "hover:border-gray-300 hover:shadow-sm"
                      }`}
                      onClick={() => setSelectedPaymentMethod("mobile")}
                    >
                      <div className="flex flex-col items-center">
                        <Smartphone className={`h-6 w-6 mb-2 ${selectedPaymentMethod === "mobile" ? "text-[#1e8449]" : "text-gray-400"}`} />
                        <span className="text-sm font-medium">Mobile Money</span>
                      </div>
                      {selectedPaymentMethod === "mobile" && (
                        <div className="absolute top-2 right-2 h-2 w-2 bg-[#1e8449] rounded-full"></div>
                      )}
                    </div>
                  )}

                  {(!paymentLink.paymentMethodTypes || paymentLink.paymentMethodTypes.includes('bank_transfer')) && (
                    <div
                      className={`relative border border-gray-200 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPaymentMethod === "bank"
                          ? "border-[#1e8449] bg-green-50 shadow"
                          : "hover:border-gray-300 hover:shadow-sm"
                      }`}
                      onClick={() => setSelectedPaymentMethod("bank")}
                    >
                      <div className="flex flex-col items-center">
                        <DollarSign className={`h-6 w-6 mb-2 ${selectedPaymentMethod === "bank" ? "text-[#1e8449]" : "text-gray-400"}`} />
                        <span className="text-sm font-medium">Bank Transfer</span>
                      </div>
                      {selectedPaymentMethod === "bank" && (
                        <div className="absolute top-2 right-2 h-2 w-2 bg-[#1e8449] rounded-full"></div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Pay Button */}
              <div className="mt-6">
                <Button 
                  type="submit"
                  className="w-full h-12 bg-[#1e8449] hover:bg-[#166e3b] transition-all rounded-lg font-semibold"
                  disabled={processingPayment}
                >
                  {processingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Pay ${formatCurrency(paymentLink.amount, paymentLink.currency)}`
                  )}
                </Button>
                
                <div className="mt-4 flex justify-center items-center text-xs text-gray-500 gap-1">
                  <Lock className="h-3 w-3" />
                  <span>Secure payment via Paymesa</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 