import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Mail, ArrowRight, Home, Shield, Lock, Sparkles, Heart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import SubscriptionService from '@/services/subscription.service';
import { formatCurrency } from '@/utils/currency';

export default function PaymentSuccessPage() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const subscriptionId = searchParams.get('subscription');
  const transactionRef = searchParams.get('trxref');

  useEffect(() => {
    if (subscriptionId) {
      fetchSubscription();
    }
  }, [subscriptionId]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await SubscriptionService.getSubscription(subscriptionId!);
      setSubscription(response);
    } catch (err: any) {
      console.error('Error fetching subscription:', err);
      toast({
        title: "Error",
        description: "Failed to load subscription details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    // Generate and download receipt
    const receiptData = {
      subscriptionId: subscription?._id,
      customerName: subscription?.customer?.name,
      productName: subscription?.product?.name,
      amount: subscription?.price,
      currency: subscription?.currency,
      date: new Date().toLocaleDateString(),
      transactionRef: transactionRef
    };

    const receiptText = `
PAYBORD - PAYMENT RECEIPT
=========================

Subscription ID: ${receiptData.subscriptionId}
Customer: ${receiptData.customerName}
Product: ${receiptData.productName}
Amount: ${formatCurrency(receiptData.amount, receiptData.currency)}
Date: ${receiptData.date}
Transaction Ref: ${receiptData.transactionRef}

Thank you for your payment!
Your subscription is now active.

For support, contact us at support@paybord.com
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${subscriptionId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#2d5a5a] border-t-[#FFD700] mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FFD700] animate-ping"></div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Processing your payment</h2>
          <p className="text-gray-400">Please wait while we confirm your transaction...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-sm text-gray-400">Payment Confirmation</p>
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          {/* Success Animation */}
          <div className="relative mx-auto mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-[#FFD700] to-[#FFC700] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="h-12 w-12 text-black" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-[#FFD700] animate-ping"></div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-300 mb-8">Your subscription has been activated successfully.</p>
          
          {/* Confetti Effect */}
          <div className="flex justify-center space-x-2 mb-8">
            <Sparkles className="h-6 w-6 text-[#FFD700] animate-bounce" />
            <Sparkles className="h-6 w-6 text-[#FFC700] animate-bounce" style={{ animationDelay: '0.2s' }} />
            <Sparkles className="h-6 w-6 text-[#2d5a5a] animate-bounce" style={{ animationDelay: '0.4s' }} />
            <Sparkles className="h-6 w-6 text-[#3a6b6b] animate-bounce" style={{ animationDelay: '0.6s' }} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Payment Details Card */}
          <Card className="border-gray-800 bg-[#2a2a2a]/80 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-white">
                <Download className="h-5 w-5 mr-2 text-gray-400" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#2d5a5a]/20 to-[#3a6b6b]/20 border border-[#2d5a5a] rounded-xl">
                  <span className="text-gray-300 font-medium">Amount Paid:</span>
                  <span className="text-2xl font-bold text-[#FFD700]">
                    {subscription ? formatCurrency(subscription.price, subscription.currency) : 'N/A'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {subscription?.customer?.name && (
                    <div className="flex justify-between items-center p-3 bg-[#1a1a1a] rounded-lg border border-gray-800">
                      <span className="text-gray-400">Customer:</span>
                      <span className="font-medium text-white">{subscription.customer.name}</span>
                    </div>
                  )}
                  
                  {subscription?.product?.name && (
                    <div className="flex justify-between items-center p-3 bg-[#1a1a1a] rounded-lg border border-gray-800">
                      <span className="text-gray-400">Product:</span>
                      <span className="font-medium text-white">{subscription.product.name}</span>
                    </div>
                  )}
                  
                  {transactionRef && (
                    <div className="flex justify-between items-center p-3 bg-[#1a1a1a] rounded-lg border border-gray-800">
                      <span className="text-gray-400">Transaction Ref:</span>
                      <span className="font-mono text-sm text-white">{transactionRef}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center p-3 bg-[#1a1a1a] rounded-lg border border-gray-800">
                    <span className="text-gray-400">Date:</span>
                    <span className="font-medium text-white">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-center">
                <Badge className="bg-[#2d5a5a] text-white border-[#2d5a5a] px-4 py-2 text-base">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Active Subscription
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps Card */}
          <Card className="border-gray-800 bg-gradient-to-br from-[#2d5a5a] to-[#3a6b6b] text-white shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-xl">
                <Sparkles className="h-5 w-5 mr-2" />
                What's Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Access Your Account</h3>
                    <p className="text-gray-300 text-sm">You can now access all features of your subscription</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Check Your Email</h3>
                    <p className="text-gray-300 text-sm">We've sent you a confirmation email with details</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Download Receipt</h3>
                    <p className="text-gray-300 text-sm">Keep your receipt for your records</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleDownloadReceipt} 
                  className="w-full bg-[#FFD700] text-black hover:bg-[#FFC700] font-semibold py-3"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                
                <Button 
                  onClick={() => window.location.href = '/dashboard/subscriptions'} 
                  className="w-full bg-white/20 text-white hover:bg-white/30 border border-white/30"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-[#2a2a2a]/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-[#FFD700] mr-3" />
              <h3 className="text-xl font-semibold text-white">Thank You!</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Your payment has been processed successfully. A confirmation email has been sent to your email address. 
              If you have any questions or need assistance, our support team is available 24/7.
            </p>
            <div className="flex justify-center space-x-6">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                <ArrowRight className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

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