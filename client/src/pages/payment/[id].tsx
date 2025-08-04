import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  CreditCard, 
  User, 
  Phone, 
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Plus,
  Search,
  Download,
  ArrowRight,
  Eye,
  EyeOff,
  Shield,
  Lock,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import SubscriptionService from '@/services/subscription.service';
import { formatCurrency } from '@/utils/currency';

export default function PaymentPage() {
  const { toast } = useToast();
  
  // Get subscription ID from URL params
  const [, params] = useRoute<{ id: string }>('/payment/:id');
  const [location] = useLocation();
  
  // Extract subscription ID from URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const subscriptionIdFromQuery = urlParams.get('subscription');
  
  // Use route param if it's a valid ObjectId, otherwise use query param
  const subscriptionId = params?.id && params.id.length === 24 ? params.id : subscriptionIdFromQuery;
  
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  // Debug: Log state changes
  useEffect(() => {
    console.log('showPaymentForm state changed to:', showPaymentForm);
  }, [showPaymentForm]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [billingInfo, setBillingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const [showCardNumber, setShowCardNumber] = useState(false);

  useEffect(() => {
    if (subscriptionId) {
      fetchSubscription();
    }
  }, [subscriptionId]);

  // Check if user is returning from a successful payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('status');
    const transactionRef = urlParams.get('trxref');
    
    if (paymentStatus === 'success' || transactionRef) {
      // User returned from successful payment, refresh subscription data
      console.log('Payment successful, refreshing subscription data');
      fetchSubscription();
      
      // Show success message
      toast({
        title: "Payment Successful!",
        description: "Your payment method has been added successfully.",
      });
      
      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Check subscription status periodically to update payment method status
  useEffect(() => {
    if (subscription && subscription.status !== 'active' && subscription.paystackPaymentUrl) {
      // If subscription is not active but has a payment URL, check status periodically
      const interval = setInterval(() => {
        console.log('Checking subscription status...');
        fetchSubscription();
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [subscription]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await SubscriptionService.getSubscription(subscriptionId!);
      console.log('Subscription data:', response);
      setSubscription(response);
    } catch (err: any) {
      console.error('Error fetching subscription:', err);
      setError(err.response?.data?.error || 'Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      // Redirect to Paystack payment page
      if (subscription.paystackPaymentUrl) {
        window.location.href = subscription.paystackPaymentUrl;
      } else {
        // Fallback: create a new payment link
        toast({
          title: "Processing Payment",
          description: "Redirecting to payment gateway...",
        });
        
        // Call the backend to get a fresh payment link
        const response = await SubscriptionService.sendInvoice(subscription._id);
        if (response.paystackUrl) {
          window.location.href = response.paystackUrl;
        } else {
          throw new Error('No payment URL available');
        }
      }
    } catch (err: any) {
      toast({
        title: "Payment Error",
        description: err.message || "There was an error processing your payment.",
        variant: "destructive"
      });
    }
  };

  const handleAddPaymentMethod = async () => {
    try {
      console.log('Adding payment method with data:', { paymentMethod, cardData, billingInfo });
      
      // Validate form data
      if (paymentMethod === 'card') {
        if (!cardData.number || !cardData.expiry || !cardData.cvc || !cardData.name) {
          toast({
            title: "Validation Error",
            description: "Please fill in all card details.",
            variant: "destructive"
          });
          return;
        }
      } else if (paymentMethod === 'mobile') {
        if (!billingInfo.phone) {
          toast({
            title: "Validation Error",
            description: "Please enter your phone number.",
            variant: "destructive"
          });
          return;
        }
      }

      // Show processing message
      toast({
        title: "Processing Payment Method",
        description: "Redirecting to payment gateway...",
      });

      // Close the dialog
      setShowPaymentForm(false);

      // Redirect to Paystack for payment processing
      if (subscription.paystackPaymentUrl) {
        // If we already have a Paystack URL, use it directly
        window.location.href = subscription.paystackPaymentUrl;
      } else {
        // Only create a new payment link if we don't have one
        try {
          const response = await SubscriptionService.sendInvoice(subscription._id);
          if (response.paystackUrl) {
            window.location.href = response.paystackUrl;
          } else {
            throw new Error('No payment URL available');
          }
        } catch (invoiceError: any) {
          // If invoice already sent, try to get the existing payment URL
          if (invoiceError.response?.status === 400 && invoiceError.response?.data?.error === 'Invoice already sent') {
            console.log('Invoice already sent, using existing payment URL');
            // Refresh subscription data to get the existing payment URL
            await fetchSubscription();
            if (subscription.paystackPaymentUrl) {
              window.location.href = subscription.paystackPaymentUrl;
            } else {
              throw new Error('No payment URL available');
            }
          } else {
            throw invoiceError;
          }
        }
      }
    } catch (err: any) {
      toast({
        title: "Payment Error",
        description: err.message || "There was an error processing your payment method.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#2d5a5a] border-t-[#FFD700] mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FFD700] animate-ping"></div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading your subscription</h2>
          <p className="text-gray-400">Please wait while we fetch your details...</p>
        </div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-800 bg-[#2a2a2a]">
          <CardContent className="text-center p-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-900/20 mb-6">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Subscription Not Found</h1>
            <p className="text-gray-400 mb-6">{error || 'The subscription you are looking for does not exist.'}</p>
            <Button onClick={() => window.history.back()} className="w-full bg-[#FFD700] text-black hover:bg-[#FFC700]">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isTrial = subscription.status === 'trialing';
  const trialEndDate = subscription.trialEndDate ? new Date(subscription.trialEndDate) : null;
  const daysUntilTrialEnd = trialEndDate ? Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]"></div>
      
      {/* Right side background - muted teal/greenish-blue */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-br from-[#2d5a5a] via-[#3a6b6b] to-[#2d5a5a] opacity-10"></div>

      {/* Header */}
      <div className="relative z-10 bg-[#1a1a1a]/95 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FFD700] to-[#FFC700] rounded-xl flex items-center justify-center">
                <span className="text-black font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Paybord</h1>
                <p className="text-sm text-gray-400">Secure Payment Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-[#2d5a5a]/20 text-[#2d5a5a] border-[#2d5a5a]">
                <Shield className="h-3 w-3 mr-1" />
                Secure
              </Badge>
              <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                <Lock className="h-3 w-3 mr-1" />
                SSL Encrypted
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Subscription Overview Card */}
            <Card className="border-gray-800 bg-[#2a2a2a]/80 backdrop-blur-sm shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#FFD700] to-[#FFC700] rounded-xl flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-white">
                        {subscription.product?.name || 'Subscription'}
                      </CardTitle>
                      <p className="text-gray-400">Active subscription</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#FFD700]">
                      {formatCurrency(subscription.price, subscription.currency)}
                    </div>
                    <div className="text-sm text-gray-400">per {subscription.interval}</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {isTrial && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-[#2d5a5a]/20 to-[#3a6b6b]/20 border border-[#2d5a5a] rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-[#FFD700]" />
                      <div>
                        <h3 className="font-semibold text-[#FFD700]">Trial Period Active</h3>
                        <p className="text-sm text-gray-300">
                          Your trial ends {formatDate(subscription.trialEndDate)} ({daysUntilTrialEnd} days remaining)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="font-medium text-white">{subscription.customer?.name || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="font-medium text-white">{subscription.customer?.email || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span className="font-medium text-white">{subscription.customer?.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      Billing Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Start Date:</span>
                        <span className="font-medium text-white">{formatDate(subscription.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Billing Cycle:</span>
                        <span className="font-medium text-white capitalize">{subscription.interval}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'} className="bg-[#2d5a5a] text-white">
                          {subscription.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Card */}
            <Card className="border-gray-800 bg-[#2a2a2a]/80 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-xl text-white">
                    <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
                    Payment Method
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={fetchSubscription}
                    className="text-gray-400 hover:text-white"
                    title="Refresh payment status"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {subscription?.status === 'active' ? (
                  // Payment method exists (subscription is active)
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#2d5a5a]/20 to-[#3a6b6b]/20 border border-[#2d5a5a] rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#2d5a5a] rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-[#FFD700]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Payment Method Added</h3>
                        <p className="text-sm text-gray-300">
                          Payment completed successfully • Active subscription
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowPaymentForm(true)}
                      variant="outline"
                      className="border-[#2d5a5a] text-[#2d5a5a] hover:bg-[#2d5a5a]/20"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Update
                    </Button>
                  </div>
                ) : subscription?.paystackPaymentUrl && subscription?.invoiceStatus === 'sent' ? (
                  // Payment method added but not yet processed
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#2d5a5a]/20 to-[#3a6b6b]/20 border border-[#2d5a5a] rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#2d5a5a] rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-[#FFD700]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Payment Method Processing</h3>
                        <p className="text-sm text-gray-300">Your payment method is being verified</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowPaymentForm(true)}
                      variant="outline"
                      className="border-[#2d5a5a] text-[#2d5a5a] hover:bg-[#2d5a5a]/20"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another
                    </Button>
                  </div>
                ) : (
                  // No payment method
                  <div className="flex items-center justify-between p-6 bg-[#1a1a1a] rounded-xl border border-gray-800">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">No payment method added</h3>
                        <p className="text-sm text-gray-400">Add a payment method to continue your subscription</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        console.log('Add Payment Method clicked, setting showPaymentForm to true');
                        setShowPaymentForm(true);
                      }}
                      className="bg-[#FFD700] text-black hover:bg-[#FFC700] font-semibold"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invoice History */}
            <Card className="border-gray-800 bg-[#2a2a2a]/80 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-xl text-white">
                    <Download className="h-5 w-5 mr-2 text-gray-400" />
                    Invoice History
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#2d5a5a]/20 to-[#3a6b6b]/20 border border-[#2d5a5a] rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-[#2d5a5a] rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-[#FFD700]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {formatDate(subscription.createdAt)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {isTrial ? 'Trial period' : 'Subscription'} for {subscription.product?.name || 'Subscription'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-[#FFD700]">
                        {isTrial ? formatCurrency(0, subscription.currency) : formatCurrency(subscription.price, subscription.currency)}
                      </div>
                      <Badge variant={isTrial ? "default" : "secondary"} className="mt-1 bg-[#2d5a5a] text-white">
                        {isTrial ? 'Trial' : subscription.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            
            {/* Payment Summary Card */}
            <Card className="border-gray-800 bg-gradient-to-br from-[#2d5a5a] to-[#3a6b6b] text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Subscription:</span>
                    <span className="font-medium">{subscription.product?.name || 'Subscription'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Billing Cycle:</span>
                    <span className="font-medium capitalize">{subscription.interval}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Amount:</span>
                    <span className="font-medium">{formatCurrency(subscription.price, subscription.currency)}</span>
                  </div>
                  {isTrial && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Trial Discount:</span>
                      <span className="font-medium text-[#FFD700]">-{formatCurrency(subscription.price, subscription.currency)}</span>
                    </div>
                  )}
                  <div className="border-t border-[#2d5a5a] pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Due:</span>
                      <span className="text-[#FFD700]">{isTrial ? formatCurrency(0, subscription.currency) : formatCurrency(subscription.price, subscription.currency)}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handlePayment}
                  className="w-full bg-[#FFD700] text-black hover:bg-[#FFC700] font-semibold py-3"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Secure Payment
                </Button>
                
                <div className="text-center text-xs text-gray-300">
                  <p>🔒 Your payment is secured with bank-level encryption</p>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>
      </div>

      {/* Payment Method Dialog */}
      <Dialog open={showPaymentForm} onOpenChange={(open) => {
        console.log('Dialog onOpenChange called with:', open);
        setShowPaymentForm(open);
      }}>
        <DialogContent className="max-w-md bg-[#2a2a2a] border-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center text-white">
              <CreditCard className="h-5 w-5 mr-2" />
              Add Payment Method
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Payment Method Tabs */}
            <div className="flex space-x-2 p-1 bg-[#1a1a1a] rounded-lg">
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPaymentMethod('card')}
                className="flex-1 bg-[#FFD700] text-black hover:bg-[#FFC700]"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Card
              </Button>
              <Button
                variant={paymentMethod === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPaymentMethod('mobile')}
                className="flex-1 bg-[#FFD700] text-black hover:bg-[#FFC700]"
              >
                <Phone className="h-4 w-4 mr-2" />
                Mobile Money
              </Button>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber" className="text-white">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      type={showCardNumber ? 'text' : 'password'}
                      placeholder="1234 5678 9012 3456"
                      value={cardData.number}
                      onChange={(e) => setCardData({...cardData, number: e.target.value})}
                      className="pr-12 bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-400"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
                      onClick={() => setShowCardNumber(!showCardNumber)}
                    >
                      {showCardNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry" className="text-white">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                      className="bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc" className="text-white">CVC</Label>
                    <Input
                      id="cvc"
                      type="password"
                      placeholder="123"
                      value={cardData.cvc}
                      onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
                      className="bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="cardName" className="text-white">Name on Card</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardData.name}
                    onChange={(e) => setCardData({...cardData, name: e.target.value})}
                    className="bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'mobile' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone" className="text-white">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+233 XX XXX XXXX"
                    value={billingInfo.phone}
                    onChange={(e) => setBillingInfo({...billingInfo, phone: e.target.value})}
                    className="bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="mobileProvider" className="text-white">Mobile Money Provider</Label>
                  <Select>
                    <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2a2a2a] border-gray-700">
                      <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                      <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                      <SelectItem value="airtel">Airtel Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button variant="outline" onClick={() => setShowPaymentForm(false)} className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800">
                Cancel
              </Button>
              <Button onClick={handleAddPaymentMethod} className="flex-1 bg-[#FFD700] text-black hover:bg-[#FFC700]">
                <Lock className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <div className="relative z-10 bg-[#1a1a1a] border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#FFD700] to-[#FFC700] rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">P</span>
                </div>
                <span className="font-semibold text-white">Paybord</span>
              </div>
              <div className="text-sm text-gray-400">
                Powered by <strong>Paystack</strong>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 