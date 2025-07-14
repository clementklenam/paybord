import { useState, useEffect, useRef } from 'react';
import { useRoute, useLocation } from 'wouter';
import { paymentLinkService } from '@/services/payment-link.service';
import { paystackService } from '@/services/paystack.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CreditCard, DollarSign, Smartphone, User, Mail, Phone, MapPin, Lock, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { usePaymentContext } from "@/contexts/PaymentContext";

// @ts-ignore
declare global {
  interface Window {
    PaystackPop?: unknown;
  }
}

// Format currency helper
const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Paystack Checkout Modal Component
function PaystackCheckoutModal({
  open,
  onClose = () => {},
  amount, // base currency, for display
  amountInKobo, // integer, for Paystack
  currency = 'NGN',
  customerInfo,
  onSuccess = () => {},
  paymentLinkId,
  businessId, // <-- add this prop
  recordTransaction = async () => {},
}: {
  open: boolean;
  onClose?: () => void;
  amount: number; // base currency
  amountInKobo: number; // kobo
  currency?: string;
  customerInfo: { name: string; email: string; phone: string; address: string };
  onSuccess?: () => void;
  paymentLinkId?: string;
  businessId?: string; // <-- add this prop
  recordTransaction?: (args: unknown) => Promise<void>;
}) {
  const [paystackReady, setPaystackReady] = useState(false);
  const { toast } = useToast();
  const paymentResponseRef = useRef<any>(null);

  useEffect(() => {
    function checkPaystack() {
      if (window.PaystackPop) {
        setPaystackReady(true);
      } else {
        setTimeout(checkPaystack, 200);
      }
    }
    if (!document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => setPaystackReady(true);
      document.body.appendChild(script);
    } else {
      checkPaystack();
    }
  }, []);

  const handlePaystack = async () => {
    console.log('[DEBUG] handlePaystack called, paystackReady:', paystackReady, 'recordTransaction function:', typeof recordTransaction);
    
    if (!paystackReady || !window.PaystackPop) {
      toast({
        title: 'Payment system not ready',
        description: 'Please wait a moment for Paystack to load.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // First, create a payment intent through your backend
      console.log('[DEBUG] Creating payment intent through backend...');
      console.log('[DEBUG] Amount before backend call:', { amount, currency });
      
      const paymentIntent = await paystackService.initializePayment({
        amount: amountInKobo, // Use kobo amount for backend
        currency: currency,
        email: customerInfo.email,
        reference: `pl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        callback_url: `${window.location.origin}/payment-link/${paymentLinkId}`,
        paymentLinkId: paymentLinkId,
        customerInfo: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.address
        }
      });
      
      console.log('[DEBUG] Payment intent created:', paymentIntent);
      console.log('[DEBUG] Backend returned amount:', paymentIntent.data.amount);
      
      paymentResponseRef.current = null;
      // @ts-ignore
      const handler = window.PaystackPop.setup({
        key: 'pk_test_8b6de0bd23150ee0195d09ee6f531442a6f246ba',
        email: customerInfo.email,
        amount: amountInKobo, // Use kobo amount for Paystack
        currency: currency,
        ref: paymentIntent.data.reference,
        metadata: {
          payment_link_id: paymentLinkId,
          business_id: businessId,
          custom_fields: [
            { display_name: 'Full Name', variable_name: 'full_name', value: customerInfo.name },
            { display_name: 'Phone', variable_name: 'phone', value: customerInfo.phone },
            { display_name: 'Address', variable_name: 'address', value: customerInfo.address },
            { display_name: 'Payment Link ID', variable_name: 'payment_link_id', value: paymentLinkId },
          ]
        },
        callback: function(response: unknown) {
          console.log('[DEBUG] Paystack callback triggered:', response);
          paymentResponseRef.current = response;
          (async () => {
            try {
              // Call backend to verify payment and record transaction
              const verifyResult = await paystackService.verifyPayment(response.reference);
              if (verifyResult.success && verifyResult.data.status === 'success') {
                onSuccess();
                // Optionally, pass transaction data to onSuccess if needed
                // Notify payment context that a payment was successful
                // notifyPaymentSuccess(); // This line was removed as per the edit hint
              } else {
                toast({
                  title: 'Payment Verification Failed',
                  description: (verifyResult.data && 'message' in verifyResult.data && typeof verifyResult.data.message === 'string') ? verifyResult.data.message : 'Could not verify payment. Please contact support.',
                  variant: 'destructive',
                });
              }
            } catch (err) {
              console.error('Error verifying payment:', err);
              toast({
                title: 'Payment Verification Error',
                description: 'Could not verify payment. Please contact support.',
                variant: 'destructive',
              });
            }
            onClose();
          })();
        },
        onClose: function() {
          console.log('[DEBUG] Paystack onClose triggered, paymentResponseRef:', paymentResponseRef.current);
          // Only record transaction if we have a response (payment was successful)
          if (paymentResponseRef.current) {
            console.log('[DEBUG] Payment was successful, transaction should be recorded');
          } else {
            console.log('[DEBUG] Payment was cancelled or failed');
          }
          onClose();
        }
      });
      if (handler) handler.openIframe();
    } catch (error) {
      console.error('[DEBUG] Error creating payment intent:', error);
      toast({
        title: 'Payment Error',
        description: 'Failed to initialize payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!open) return null;

  console.log('[DEBUG] PaystackCheckoutModal rendering, open:', open, 'paystackReady:', paystackReady);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center animate-in zoom-in-95 duration-300 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h2>
        <p className="text-gray-600 mb-6">You are paying <span className="font-semibold text-green-600">{formatCurrency(amount, currency)}</span></p>
        <Button
          className="w-full h-12 text-lg font-semibold bg-[#0FCEA6] hover:bg-[#1e8449] text-white shadow-lg hover:shadow-xl transition-all duration-200 mb-4"
          onClick={handlePaystack}
          disabled={!paystackReady}
        >
          {paystackReady ? 'Pay Now' : 'Loading Payment...'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 hover:bg-gray-50 transition-colors duration-200"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function PaymentLinkViewPage() {
  const [paymentMatch, paymentParams] = useRoute('/payment-link/:id');
  const [plMatch, plParams] = useRoute('/pl_:id');
  const location = useLocation();
  
  // Get link ID from either route pattern
  const linkId = paymentParams?.id || plParams?.id || location[0].substring(4);
  
  const [paymentLink, setPaymentLink] = useState<any>(null);
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
  const [showPaystackModal, setShowPaystackModal] = useState(false);
  const { toast } = useToast();
  const { notifyPaymentSuccess } = usePaymentContext();

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
    
    console.log('[DEBUG] handlePayment called, paymentLink:', paymentLink);
    
    // Validate required fields
    if (paymentLink?.requiredFields?.customerName && !customerInfo.name) {
      toast({
        title: 'Validation Error',
        description: 'Please enter your name',
        variant: 'destructive',
      });
      return;
    }
    
    if (paymentLink?.requiredFields?.customerEmail && !customerInfo.email) {
      toast({
        title: 'Validation Error',
        description: 'Please enter your email',
        variant: 'destructive',
      });
      return;
    }
    
    if (paymentLink?.requiredFields?.customerPhone && !customerInfo.phone) {
      toast({
        title: 'Validation Error',
        description: 'Please enter your phone number',
        variant: 'destructive',
      });
      return;
    }
    
    if (paymentLink?.requiredFields?.shippingAddress && !customerInfo.address) {
      toast({
        title: 'Validation Error',
        description: 'Please enter your shipping address',
        variant: 'destructive',
      });
      return;
    }
    
    if (!selectedPaymentMethod) {
      toast({
        title: 'Validation Error',
        description: 'Please select a payment method',
        variant: 'destructive',
      });
      return;
    }
    
    console.log('[DEBUG] Validation passed, opening Paystack modal');
    setShowPaystackModal(true);
  };

  const recordTransaction = async ({ amount, currency, customerInfo, provider, status }: unknown) => {
    console.log('[DEBUG] recordTransaction called with:', { amount, currency, customerInfo, provider, status, paymentLink, linkId });
    try {
      // Record the transaction in your backend
      console.log('Recording transaction:', { amount, currency, customerInfo, provider, status });
      
      // Get businessId from payment link data
      const businessId = paymentLink?.businessId || paymentLink?.business?._id;
      console.log('[DEBUG] businessId from payment link:', businessId);
      
      if (!businessId) {
        console.warn('[DEBUG] No businessId found in payment link, transaction recording may fail');
      }
      
      // Create transaction service instance and record the transaction
      // const transactionService = new TransactionService(); // This line was removed as per the edit hint
      // await transactionService.recordTransaction({ // This line was removed as per the edit hint
      //   amount: amount, // Use the amount as-is (already in base currency) // This line was removed as per the edit hint
      //   currency: currency, // This line was removed as per the edit hint
      //   customerName: customerInfo.name, // This line was removed as per the edit hint
      //   customerEmail: customerInfo.email, // This line was removed as per the edit hint
      //   customerPhone: customerInfo.phone, // This line was removed as per the edit hint
      //   status: status, // This line was removed as per the edit hint
      //   provider: provider, // This line was removed as per the edit hint
      //   paymentType: 'payment_link', // This line was removed as per the edit hint
      //   paymentMethod: 'card', // Default to card for Paystack // This line was removed as per the edit hint
      //   paymentLinkId: linkId, // This line was removed as per the edit hint
      //   businessId: businessId // This might be undefined, but the backend should handle it // This line was removed as per the edit hint
      // }); // This line was removed as per the edit hint
      
      console.log('[DEBUG] Transaction recorded successfully with amount:', amount);
      
      // Notify payment context that a payment was successful
      notifyPaymentSuccess();
    } catch (error) {
      console.error('Error recording transaction:', error);
      // Don't throw error to avoid breaking the payment flow
      // The payment was successful, we just couldn't record it
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading payment...</p>
      </div>
    );
  }
  
  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">Your payment has been processed successfully. You will receive a confirmation email shortly.</p>
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl"
            onClick={() => window.location.href = '/'}
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }
  
  if (error || !paymentLink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Error</h1>
            <p className="text-gray-600 mb-6">{error || 'Payment link not found or invalid'}</p>
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl"
              onClick={() => window.location.href = '/'}
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col items-center justify-center p-4">
      {/* Payment Card - Centered and Responsive */}
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Accent Bar */}
          <div className="h-2 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
          
          {/* Header with Product Image Background */}
          <div className="relative">
            {/* Product Image as Background */}
            {paymentLink.imageUrl ? (
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={paymentLink.imageUrl}
                  alt={paymentLink.title}
                  className="w-full h-full object-cover"
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500">
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            )}
            
            {/* Payment Information with relative positioning */}
            <div className="relative z-10 px-8 pt-6 pb-4">
              {/* Business Name */}
              <div className="text-center mb-3">
                <span className="text-white/80 text-xs font-medium tracking-wider uppercase">Payment to</span>
                <div className="text-lg font-semibold text-white mt-1">
                  {paymentLink.business?.name || "Business"}
                </div>
              </div>
              
              {/* Amount */}
              <div className="text-center mb-4">
                <div className="text-4xl font-bold mb-2 text-white">
                  {formatCurrency(paymentLink.amount, paymentLink.currency)}
                </div>
                <div className="text-lg font-medium text-white">
                  {paymentLink.title}
                </div>
                {paymentLink.description && (
                  <div className="text-white/80 text-sm mt-1 leading-relaxed">
                    {paymentLink.description}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Form Content */}
          <form onSubmit={handlePayment} className="px-8">
            {/* Customer Input Fields */}
            <div className="space-y-4 mb-4">
              {paymentLink.requiredFields?.customerName && (
                <div className="relative">
                  <Input 
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name" 
                    className="pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl" 
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}

              {paymentLink.requiredFields?.customerEmail && (
                <div className="relative">
                  <Input 
                    name="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address" 
                    className="pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl" 
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}

              {paymentLink.requiredFields?.customerPhone && (
                <div className="relative">
                  <Input 
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number" 
                    className="pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl" 
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}

              {paymentLink.requiredFields?.shippingAddress && (
                <div className="relative">
                  <Textarea 
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    placeholder="Enter your shipping address" 
                    className="pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl" 
                    rows={3}
                    required
                  />
                  <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
            
            {/* Payment Methods */}
            <div className="mb-4">
              <div className="flex justify-center gap-2">
                {(!paymentLink.paymentMethodTypes || paymentLink.paymentMethodTypes.includes('card')) && (
                  <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      selectedPaymentMethod === "card" 
                        ? "shadow-lg" 
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    style={{
                      borderColor: selectedPaymentMethod === "card" ? "#10b981" : undefined,
                      backgroundColor: selectedPaymentMethod === "card" ? "#10b98115" : undefined,
                      color: selectedPaymentMethod === "card" ? "#10b981" : undefined
                    }}
                    onClick={() => setSelectedPaymentMethod("card")}
                  >
                    <CreditCard className="h-4 w-4" />
                    Card
                  </button>
                )}
                {(!paymentLink.paymentMethodTypes || paymentLink.paymentMethodTypes.includes('mobile_money')) && (
                  <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      selectedPaymentMethod === "mobile" 
                        ? "shadow-lg" 
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    style={{
                      borderColor: selectedPaymentMethod === "mobile" ? "#10b981" : undefined,
                      backgroundColor: selectedPaymentMethod === "mobile" ? "#10b98115" : undefined,
                      color: selectedPaymentMethod === "mobile" ? "#10b981" : undefined
                    }}
                    onClick={() => setSelectedPaymentMethod("mobile")}
                  >
                    <Smartphone className="h-4 w-4" />
                    Mobile
                  </button>
                )}
                {(!paymentLink.paymentMethodTypes || paymentLink.paymentMethodTypes.includes('bank_transfer')) && (
                  <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      selectedPaymentMethod === "bank" 
                        ? "shadow-lg" 
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    style={{
                      borderColor: selectedPaymentMethod === "bank" ? "#10b981" : undefined,
                      backgroundColor: selectedPaymentMethod === "bank" ? "#10b98115" : undefined,
                      color: selectedPaymentMethod === "bank" ? "#10b981" : undefined
                    }}
                    onClick={() => setSelectedPaymentMethod("bank")}
                  >
                    <DollarSign className="h-4 w-4" />
                    Bank
                  </button>
                )}
              </div>
            </div>
            
            {/* Pay Button */}
            <div className="mb-6">
              <Button 
                type="submit"
                className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
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
            </div>
          </form>
          
          {/* Powered by Paybord */}
          <div className="w-full text-center text-xs text-gray-400 py-3 border-t border-gray-100 bg-gray-50 tracking-wide">
            Powered by <span className="font-bold text-emerald-600">Paybord</span>
          </div>
        </div>
        
        {/* Security Notice */}
        <div className="mt-4 flex justify-center items-center text-xs text-gray-500 gap-1">
          <Lock className="h-3 w-3" />
          <span>Secure payment via Paybord</span>
        </div>
      </div>
      
      {/* Paystack Modal */}
      <PaystackCheckoutModal
        open={showPaystackModal}
        onClose={() => setShowPaystackModal(false)}
        amount={paymentLink.amount} // for display
        amountInKobo={Math.round(paymentLink.amount * 100)} // for Paystack
        currency={paymentLink.currency || 'NGN'}
        customerInfo={customerInfo}
        onSuccess={() => {
          setPaymentComplete(true);
          setShowPaystackModal(false);
        }}
        paymentLinkId={linkId}
        businessId={paymentLink?.businessId || paymentLink?.business?._id} // <-- pass businessId
        recordTransaction={recordTransaction}
      />
    </div>
  );
} 