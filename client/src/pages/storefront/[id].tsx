// PUBLIC VIEW: This page always uses light mode for public storefront, regardless of app or system dark mode.
// All dark: classes are removed and backgrounds/text are forced to light theme.
import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'wouter';
import { StorefrontService, Storefront } from '@/services/storefront.service';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, ShoppingBag, Search, ShoppingCart, CreditCard, Plus, Minus } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import AnalyticsService from '@/services/analytics.service';
import { getAuthHeader } from '@/services/auth-header';
import { usePaymentContext } from "@/contexts/PaymentContext";
import { paystackService } from "@/services/paystack.service";
import TransactionService from "@/services/transaction.service";

// @ts-ignore
 
declare global {
  interface Window {
    PaystackPop?: any;
  }
}

// Separate loading component to avoid conditional hooks
function LoadingView() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Skeleton className="h-64 w-full mb-6" />
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div>
            <Skeleton className="h-40 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Separate error component to avoid conditional hooks
function ErrorView({ message }: { message: string | null }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
          <p>{message || 'An error occurred while loading the storefront.'}</p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    </div>
  );
}

// Extended Product interface with optional fields for UI display
interface ExtendedProduct {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  currency?: string;
  image?: string;
  description?: string;
  discountPrice?: number;
  inStock?: boolean;
}

// Cart item component
interface CartItem {
  product: ExtendedProduct;
  quantity: number;
}

function CartItem({
  item,
  onUpdateQuantity,
  onRemove
}: {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}) {
  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      {item.product.image && (
        <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
          <img
            src={item.product.image}
            alt={item.product.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="ml-4 flex-1">
        <h4 className="font-medium">{item.product.name}</h4>
        <p className="text-gray-600">{item.product.currency || 'USD'} {(item.product.price ?? 0).toFixed(2)}</p>
      </div>
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            const productId = item.product.id || item.product._id;
            if (productId) {
              onUpdateQuantity(productId, Math.max(1, item.quantity - 1));
            }
          }}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="mx-2 w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            const productId = item.product.id || item.product._id;
            if (productId) {
              onUpdateQuantity(productId, item.quantity + 1);
            }
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="ml-2"
        onClick={() => {
          const productId = item.product.id || item.product._id;
          if (productId) {
            onRemove(productId);
          }
        }}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Product detail modal
function ProductDetailModal({
  product,
  onClose,
  onAddToCart
}: {
  product: ExtendedProduct;
  onClose: () => void;
  onAddToCart: (product: ExtendedProduct) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.image && (
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold">{product.currency || 'USD'} {(product.price ?? 0).toFixed(2)}</span>
                  {product.discountPrice && (
                    <span className="ml-2 text-gray-500 line-through">
                      {product.currency || 'USD'} {(product.discountPrice ?? 0).toFixed(2)}
                    </span>
                  )}
                </div>
                {product.inStock ? (
                  <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">Out of Stock</Badge>
                )}
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              <Button
                className="w-full"
                size="lg"
                onClick={() => onAddToCart(product)}
                disabled={!product.inStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

function StripeCheckoutModal({
  open,
  onClose,
  amount,
  currency = 'usd',
  onSuccess,
  businessId,
  storefrontId
}: {
  open: boolean;
  onClose: () => void;
  amount: number;
  currency?: string;
  onSuccess: () => void;
  businessId?: string;
  storefrontId?: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDeclined, setPaymentDeclined] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate customer information
    if (!customerInfo.fullName.trim() || !customerInfo.email.trim() || !customerInfo.phone.trim()) {
      setError('Please fill in all customer information fields.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 1. Create PaymentIntent on backend
      const res = await fetch('/api/payments/stripe-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount, 
          currency,
          customerInfo: {
            name: customerInfo.fullName || '',
            email: customerInfo.email || '',
            phone: customerInfo.phone || ''
          },
          businessId,
          storefrontId
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }
      
      const data = await res.json();
      if (!data.clientSecret) throw new Error('Failed to create payment intent');

      // 2. Confirm card payment
      const result = await stripe?.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements?.getElement(CardElement)!,
          billing_details: {
            name: customerInfo.fullName || '',
            email: customerInfo.email || '',
            phone: customerInfo.phone || ''
          }
        },
      });
      
      if (result?.error) {
        setPaymentDeclined(true);
        setError(result.error.message || 'Payment was declined');
        
        // Update transaction status to failed
        try {
          await fetch('/api/payments/update-transaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentIntentId: result.error.payment_intent?.id || data.paymentIntentId,
              status: 'failed',
              paymentIntent: result.error
            })
          });
        } catch (updateError) {
          console.error('Failed to update transaction status:', updateError);
        }
      } else if (result?.paymentIntent?.status === 'succeeded') {
        // Update transaction status to success
        try {
          await fetch('/api/payments/update-transaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentIntentId: result.paymentIntent.id,
              status: 'success',
              paymentIntent: result.paymentIntent
            })
          });
        } catch (updateError) {
          console.error('Failed to update transaction status:', updateError);
        }
        
        setPaymentSuccess(true);
        toast({ 
          title: 'Payment Successful! 🎉', 
          description: 'Thank you for your purchase. You will receive a confirmation email shortly.',
          variant: "default"
        });
        // Clear cart after a short delay
        setTimeout(() => {
          onSuccess();
          onClose();
          setPaymentSuccess(false);
          setPaymentDeclined(false);
          setCustomerInfo({ fullName: '', email: '', phone: '' });
        }, 3000);
      } else {
        setPaymentDeclined(true);
        setError('Payment was not successful.');
      }
    } catch (err: any) {
      setPaymentDeclined(true);
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  if (!open) return null;

  // Success State
  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        {/* Celebration Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            >
              <div className="w-2 h-2 bg-yellow-400 rounded-full opacity-75"></div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center animate-in zoom-in-95 duration-300 shadow-2xl">
          {/* Success Animation */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your payment of <span className="font-semibold text-green-600">{formatCurrency(amount, currency)}</span> has been processed successfully.
            </p>
          </div>
          
          {/* Success Details */}
          <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Transaction completed</span>
            </div>
          </div>

          {/* Loading Animation */}
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
            <span className="text-sm">Redirecting to storefront...</span>
          </div>
        </div>
      </div>
    );
  }

  // Declined State
  if (paymentDeclined) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center animate-in zoom-in-95 duration-300 shadow-2xl">
          {/* Error Animation */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Declined</h2>
            <p className="text-gray-600 mb-6">
              We couldn't process your payment. Please try again with a different payment method.
            </p>
          </div>
          
          {/* Error Details */}
          <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-200">
            <div className="text-red-700 text-sm">
              <p className="font-medium mb-1">Error Details:</p>
              <p>{error}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => {
                setPaymentDeclined(false);
                setError(null);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Payment Form
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300 relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 rounded-2xl flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Processing your payment...</p>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Purchase</h2>
          <p className="text-gray-600">Enter your details and payment information</p>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Display */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 text-center border border-blue-100">
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(amount, currency)}
            </p>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
            </div>
            
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={customerInfo.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full pl-10"
                  required
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email Address *</label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10"
                  required
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
              <div className="relative">
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full pl-10"
                  required
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Visual Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Payment Information</span>
            </div>
          </div>

          {/* Card Element */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Card Information</label>
            <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
              <CardElement 
                options={{ 
                  hidePostalCode: true,
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#374151',
                      '::placeholder': {
                        color: '#9CA3AF',
                      },
                    },
                  },
                }} 
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center space-x-2 text-red-700">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200" 
              disabled={loading || !stripe}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing Payment...</span>
                </div>
              ) : (
                `Pay ${formatCurrency(amount, currency)}`
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-12 hover:bg-gray-50 transition-colors duration-200" 
              onClick={onClose} 
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Your payment is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Paystack payment modal component
function PaystackCheckoutModal({
  open,
  onClose = () => {},
  amount,
  currency = 'NGN',
  customerInfo,
  onSuccess = () => {},
  businessId,
  storefrontId,
  recordTransaction = async () => {},
}: {
  open: boolean;
  onClose?: () => void;
  amount: number;
  currency?: string;
  customerInfo: { fullName: string; email: string; phone: string };
  onSuccess?: () => void;
  businessId?: string;
  storefrontId?: string;
  recordTransaction?: (args: any) => Promise<void>;
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

  const handlePaystack = () => {
    if (!paystackReady || !window.PaystackPop) {
      toast({
        title: 'Payment system not ready',
        description: 'Please wait a moment for Paystack to load.',
        variant: 'destructive',
      });
      return;
    }
    paymentResponseRef.current = null;
    // @ts-ignore
    const handler = window.PaystackPop.setup({
      key: 'pk_test_8b6de0bd23150ee0195d09ee6f531442a6f246ba',
      email: customerInfo.email,
      amount: amount,
      currency: currency,
      ref: `PSK-${Date.now()}`,
      metadata: {
        custom_fields: [
          { display_name: 'Full Name', variable_name: 'full_name', value: customerInfo.fullName },
          { display_name: 'Phone', variable_name: 'phone', value: customerInfo.phone },
          { display_name: 'Business ID', variable_name: 'business_id', value: businessId },
          { display_name: 'Storefront ID', variable_name: 'storefront_id', value: storefrontId },
        ]
      },
      callback: function(response: any) {
        paymentResponseRef.current = response;
        onSuccess();
        onClose();
      },
      onClose: function() {
        if (paymentResponseRef.current) {
          // Run async recordTransaction after modal closes
          setTimeout(() => {
            recordTransaction({
              amount,
              currency,
              customerInfo,
              provider: 'paystack',
              status: 'success',
            });
          }, 0);
        }
        onClose();
      }
    });
    if (handler) handler.openIframe();
  };

  if (!open) return null;

  // Convert amount from smallest unit to base unit for display
  const displayAmount = amount / 100; // Convert from cents/pesewas to base unit

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center animate-in zoom-in-95 duration-300 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h2>
        <p className="text-gray-600 mb-6">You are paying <span className="font-semibold text-green-600">{formatCurrency(displayAmount, currency)}</span></p>
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

// Format currency helper
const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Main StorefrontPreview component
export default function StorefrontPreview() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  
  const [storefront, setStorefront] = useState<Storefront | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProduct | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<ExtendedProduct[]>([]);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [showPaystackModal, setShowPaystackModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ fullName: '', email: '', phone: '' });
  const isCustomerInfoValid = customerInfo.fullName && customerInfo.email && customerInfo.phone;
  // Calculate total in base currency unit for display
  const totalAmountBase = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  // Calculate total in smallest unit for Paystack
  const totalAmountSmallest = Math.round(totalAmountBase * 100); // in cents/pesewas
  
  const { toast } = useToast();
  const { notifyPaymentSuccess } = usePaymentContext();
  const storefrontService = useMemo(() => new StorefrontService(), []);

  if (!id) {
    return <ErrorView message="Storefront ID is missing from URL" />;
  }

  // Prevent multiple simultaneous API calls
  const [fetchPromise, setFetchPromise] = useState<Promise<any> | null>(null);

  useEffect(() => {
    async function fetchStorefront() {
      if (!id) return; // Don't fetch if no ID

      // If there's already a fetch in progress, wait for it
      if (fetchPromise) {
        try {
          await fetchPromise;
          return;
        } catch (error) {
          // Continue with new fetch if previous failed
        }
      }

      setLoading(true);
      setError(null);
      console.log('Fetching storefront with ID:', id);

      const promise = (async () => {
        try {
          const data = await storefrontService.getStorefrontById(id);
          if ((data as any).business && !data.businessId) {
            data.businessId = (data as any).business;
          }
          console.log('[DEBUG] Storefront loaded with businessId:', data.businessId, 'Raw business:', (data as any).business);
          setStorefront(data);
        } catch (err) {
          console.error('Error fetching storefront:', err);
          setError(err instanceof Error ? err.message : 'Failed to load storefront. Please try again later.');
          throw err;
        } finally {
          setLoading(false);
          setFetchPromise(null);
        }
      })();

      setFetchPromise(promise);
    }

    fetchStorefront();
  }, [id, storefrontService]);

  useEffect(() => {
    if (storefront) {
      document.title = `${storefront.name} | Paymesa Storefront`;
    }
    return () => {
      document.title = 'Paymesa';
    };
  }, [storefront]);

  useEffect(() => {
    if (storefront) {
      const root = document.documentElement;
      root.style.setProperty('--primary-color', storefront.primaryColor || '#3b82f6');
      root.style.setProperty('--accent-color', storefront.accentColor || '#27ae60');

      // Clean up when component unmounts
      return () => {
        root.style.removeProperty('--primary-color');
        root.style.removeProperty('--accent-color');
      };
    }
  }, [storefront]);

  useEffect(() => {
    if (storefront?.products) {
      const filtered = storefront.products.filter((product: ExtendedProduct) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
        );
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [storefront, searchQuery]);

  const handleAddToCart = (product: ExtendedProduct) => {
    console.log('Adding product to cart:', product);
    
    // Check for both id and _id since MongoDB uses _id
    const productId = product.id || product._id;
    if (!productId) {
      console.error('Cannot add product - missing ID');
      toast({
        title: 'Error',
        description: 'This product cannot be added to cart',
        variant: 'destructive'
      });
      return;
    }
    
    setCart(prevCart => {
      console.log('Current cart:', prevCart);
      const existingIndex = prevCart.findIndex(
        item => {
          const itemId = item?.product?.id || item?.product?._id;
          return itemId && String(itemId) === String(productId);
        }
      );
      
      if (existingIndex >= 0) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        console.log('Updated existing item:', updated);
        return updated;
      }
      
      const newCart = [...prevCart, { product, quantity: 1 }];
      console.log('Added new item:', newCart);
      return newCart;
    });
    
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => {
        const itemId = item?.product?.id || item?.product?._id;
        return itemId && String(itemId) === String(productId)
          ? { ...item, quantity }
          : item;
      })
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart(prevCart => 
      prevCart.filter(item => {
        const itemId = item?.product?.id || item?.product?._id;
        return !(itemId && String(itemId) === String(productId));
      })
    );
  };

  // Determine the cart currency (assume all products in cart have the same currency, fallback to NGN)
  const cartCurrency = cart.length > 0
    ? (cart[0].product.currency || 'NGN')
    : 'NGN';

  const recordTransaction = async ({ amount, currency, customerInfo, provider, status }: any) => {
    console.log('recordTransaction called with:', { amount, currency, customerInfo, provider, status });
    try {
      if (!storefront) return;
      const businessId = storefront.businessId || (storefront as any).business;
      if (!businessId) {
        toast({
          title: 'Payment Error',
          description: 'Cannot process payment: missing business information. Please contact support.',
          variant: 'destructive',
        });
        console.error('Payment blocked: storefront.businessId is missing', storefront);
        return;
      }
      const payload: any = {
        amount,
        currency,
        customerName: customerInfo.fullName,
        customerEmail: customerInfo.email,
        status,
        provider,
        storefrontId: storefront?.id,
        businessId,
        paymentType: 'storefront_purchase',
      };
      console.log('Posting transaction payload:', payload);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/payments`,
        payload,
        { headers: getAuthHeader() }
      );
      
      // Notify payment context that a payment was successful
      notifyPaymentSuccess();
      
      AnalyticsService.getDashboardOverview();
    } catch (err) {
      console.error('Failed to record transaction:', err);
      toast({
        title: 'Payment Error',
        description: 'Failed to record your payment. Please try again or contact support.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <LoadingView />;
  }

  if (error || !storefront) {
    return <ErrorView message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center ml-2">
              {storefront.logo ? (
                <img 
                  src={storefront.logo}
                  alt={`${storefront.name} logo`} 
                  className="h-8 w-8 rounded-full mr-2 object-cover"
                />
              ) : (
                <div 
                  className="h-8 w-8 rounded-full mr-2 flex items-center justify-center"
                  style={{ backgroundColor: storefront.primaryColor || '#1e8449' }}
                >
                  <span className="text-white font-bold">
                    {storefront.name.charAt(0)}
                  </span>
                </div>
              )}
              <h1 className="text-xl font-bold">{storefront.name}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowCart(!showCart)}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            {/* Banner */}
            {storefront.banner && (
              <div className="h-64 rounded-lg overflow-hidden mb-6 relative">
                <img
                  src={storefront.banner}
                  alt={storefront.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h2 className="text-2xl font-bold">{storefront.name}</h2>
                    {storefront.description && (
                      <p className="text-white/90">{storefront.description}</p>
                    )}
                    {storefront.socialLinks && Object.keys(storefront.socialLinks).length > 0 && (
                      <div className="flex gap-4 mt-4">
                        {storefront.socialLinks.instagram && (
                          <a 
                            href={`https://instagram.com/${storefront.socialLinks.instagram}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white hover:text-white/80 transition-colors"
                          >
                            {/* <Instagram className="h-5 w-5" /> */}
                          </a>
                        )}
                        {storefront.socialLinks.twitter && (
                          <a 
                            href={`https://twitter.com/${storefront.socialLinks.twitter}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white hover:text-white/80 transition-colors"
                          >
                            {/* <Twitter className="h-5 w-5" /> */}
                          </a>
                        )}
                        {storefront.socialLinks.facebook && (
                          <a 
                            href={`https://facebook.com/${storefront.socialLinks.facebook}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white hover:text-white/80 transition-colors"
                          >
                            {/* <Facebook className="h-5 w-5" /> */}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product: ExtendedProduct, index) => (
                  <div 
                    key={`product-${product?.id || index}`}
                    className="border rounded-lg overflow-hidden"
                  >
                    {/* Product image */}
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    
                    {/* Product details */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      
                      {/* Price with currency */}
                      <p className="text-gray-700 mt-2">
                        {product.currency || 'USD'} {(product.price ?? 0).toFixed(2)}
                      </p>
                      
                      {/* Add to cart button */}
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        className="mt-4 w-full"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar / Cart */}
          <div className={`fixed md:static top-0 right-0 h-full md:h-auto w-full md:w-auto max-w-md bg-white shadow-xl md:shadow-none z-40 transform transition-transform duration-300 ${showCart ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Your Cart</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setShowCart(false)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="max-h-[60vh] overflow-auto">
                    {cart.map((item, index) => (
                      <CartItem
                        key={`cart-item-${item?.product?.id || index}-${index}`}
                        item={item}
                        onUpdateQuantity={(productId, quantity) => handleUpdateQuantity(productId, quantity)}
                        onRemove={(productId) => handleRemoveItem(productId)}
                      />
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between mb-4">
                      <span className="font-medium">Total</span>
                      <span className="font-bold">{cart.reduce((total, item) => {
                        return total + ((item.product.price ?? 0) * item.quantity);
                      }, 0).toFixed(2)}</span>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        value={customerInfo.fullName}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                        className="mb-2"
                        required
                      />
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="mb-2"
                        required
                      />
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className="mb-2"
                        required
                      />
                    </div>
                    <Button className="w-full" onClick={() => setShowPaystackModal(true)} disabled={!isCustomerInfoValid}>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Checkout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} {storefront.name} | Powered by Paymesa
              </p>
            </div>

            {storefront.socialLinks && (
              <div className="flex space-x-4">
                {storefront.socialLinks.instagram && (
                  <a
                    href={`https://instagram.com/${storefront.socialLinks.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {/* <Instagram className="h-5 w-5" /> */}
                  </a>
                )}
                {storefront.socialLinks.twitter && (
                  <a
                    href={`https://twitter.com/${storefront.socialLinks.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {/* <Twitter className="h-5 w-5" /> */}
                  </a>
                )}
                {storefront.socialLinks.facebook && (
                  <a
                    href={`https://facebook.com/${storefront.socialLinks.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {/* <Facebook className="h-5 w-5" /> */}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </footer>

      {/* Product detail modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product: ExtendedProduct) => handleAddToCart(product)}
        />
      )}

      {/* Stripe Payment Modal */}
      <Elements stripe={stripePromise}>
        <StripeCheckoutModal
          open={showStripeModal}
          onClose={() => setShowStripeModal(false)}
          amount={totalAmountBase}
          currency="usd"
          onSuccess={async () => {
            console.log('Stripe payment succeeded, calling recordTransaction');
            await recordTransaction({
              amount: totalAmountBase,
              currency: 'USD',
              customerInfo,
              provider: 'stripe',
              status: 'success'
            });
            setCart([]);
          }}
          businessId={storefront?.businessId || (storefront as any)?.business}
          storefrontId={storefront.id}
        />
      </Elements>

      {/* Paystack Payment Modal */}
      <PaystackCheckoutModal
        open={showPaystackModal}
        onClose={() => setShowPaystackModal(false)}
        amount={totalAmountSmallest} // Pass smallest amount, modal will handle conversion for display
        currency={cartCurrency}
        customerInfo={customerInfo}
        onSuccess={async () => {
          console.log('Paystack payment succeeded, calling recordTransaction');
          await recordTransaction({
            amount: totalAmountBase, // Use base amount for transaction record
            currency: cartCurrency,
            customerInfo,
            provider: 'paystack',
            status: 'success',
          });
          setCart([]);
          toast({ title: 'Payment Successful!', description: 'Thank you for your purchase.', variant: 'default' });
        }}
        businessId={storefront?.businessId || (storefront as any)?.business}
        storefrontId={storefront?.id}
        recordTransaction={recordTransaction}
      />
    </div>
  );
}
