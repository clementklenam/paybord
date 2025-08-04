import {useState, useEffect} from "react";
import {DashboardLayout} from "@/components/dashboard/DashboardLayout";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";
import {Plus, Sparkles, Users, TrendingUp, Clock, DollarSign, Shield, MoreHorizontal, HelpCircle} from "lucide-react";
import {SubscriptionBuilder} from "@/components/subscriptions/SubscriptionBuilder";
import SubscriptionService, { Subscription } from '@/services/subscription.service';
import { useToast } from "@/components/ui/use-toast";
import { safeRender, sanitizeArray, validateNoObjects } from "@/utils/safeRender";

// Global error handler to catch React errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.error && event.error.message && event.error.message.includes('Minified React error #31')) {
      console.error('🔍 React Error #31 caught:', event.error);
      console.error('🔍 Error details:', event.error.message);
    }
  });
}

export default function SubscriptionsPage() {
  const [builderOpen, setBuilderOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSubscriptions() {
      setLoading(true);
      setError(null);
      try {
        const subs = await SubscriptionService.listSubscriptions();
        console.log('🔍 Fetched subscriptions:', subs);
        
        // Don't use sanitizeArray here as it removes populated data
        // Instead, we'll handle sanitization in the rendering step
        setSubscriptions(subs);
      } catch (err: unknown) {
        console.error('🔍 Error fetching subscriptions:', err);
        setError(safeRender((err as any)?.response?.data?.error || (err as any)?.message || 'Failed to load subscriptions'));
      } finally {
        setLoading(false);
      }
    }
    fetchSubscriptions();
  }, [builderOpen]);

  // Create safe subscription data for rendering
  const safeSubscriptions = subscriptions.map((sub, index) => {
    // Extract only the properties we need for rendering
    const safeSub = {
      _id: safeRender(sub._id || `sub-${index}`),
      status: safeRender(sub.status || 'pending'),
      price: typeof sub.price === 'number' ? sub.price : 0,
      currency: safeRender(sub.currency || 'USD'),
      interval: safeRender(sub.interval || 'month'),
      createdAt: safeRender(sub.createdAt),
      customerEmail: safeRender(sub.customer?.email || 'unknown@example.com'),
      customerName: safeRender(sub.customer?.name || 'Unknown Customer'),
      customerDescription: safeRender(sub.customer?.description || 'No description available'),
      productName: safeRender(sub.product?.name || 'Unknown Product'),
    };
    
    // Log the actual data for debugging
    console.log(`🔍 Subscription ${index} data:`, {
      original: {
        customer: sub.customer,
        product: sub.product,
        _id: sub._id,
        status: sub.status,
        price: sub.price,
        currency: sub.currency,
        interval: sub.interval,
        createdAt: sub.createdAt
      },
      safe: safeSub
    });
    
    // Validate that no objects remain
    Object.entries(safeSub).forEach(([key, value]) => {
      if (!validateNoObjects(value, `subscription ${index} property ${key}`)) {
        console.error(`🔍 CRITICAL: Object found in subscription ${index}, property ${key}:`, value);
        // Force convert to string
        (safeSub as any)[key] = safeRender(value);
      }
    });
    
    return safeSub;
  });

  const totalSubscriptions = safeSubscriptions.length;
  const activeSubscriptions = safeSubscriptions.filter(s => s.status === 'active').length;
  const trialingSubscriptions = safeSubscriptions.filter(s => s.status === 'trialing').length;
  const monthlyRevenue = safeSubscriptions
    .filter(s => s.status === 'active' && s.interval === 'month')
    .reduce((sum, s) => sum + (s.price || 0), 0);

  try {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Header and Tabs */}
          <div className="max-w-7xl mx-auto px-0 pt-2 pb-2">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
              <Button variant="default" size="lg" onClick={() => setBuilderOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create subscription
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="max-w-7xl mx-auto px-0 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Total Subscriptions</p>
                      <p className="text-2xl font-bold text-gray-900">{totalSubscriptions}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Active</p>
                      <p className="text-2xl font-bold text-gray-900">{activeSubscriptions}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${monthlyRevenue.toFixed(2)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Trial Period</p>
                      <p className="text-2xl font-bold text-gray-900">{trialingSubscriptions}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Subscriptions List */}
          <div className="max-w-7xl mx-auto px-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-gray-600">Loading subscriptions...</span>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 mb-2">Error loading subscriptions</div>
                <div className="text-sm text-gray-500">{error}</div>
              </div>
            ) : safeSubscriptions.length === 0 ? (
              <div className="flex flex-col items-center py-16">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-full p-8 mb-6">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-3">Create your first subscription</div>
                <div className="text-gray-600 mb-8 text-center max-w-lg">
                  Start collecting recurring payments with flexible pricing models. 
                  Support flat rate, seat-based, tiered, and usage-based billing.
                </div>
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="default" 
                    size="lg"
                    className="font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200" 
                    onClick={() => setBuilderOpen(true)}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Subscription
                  </Button>
                  <Button variant="outline" size="lg" className="px-6 py-3">
                    View Documentation
                  </Button>
                </div>
                
                {/* Feature highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl">
                  <Card className="text-center p-6 border-2 border-dashed border-gray-200 hover:border-primary/30 transition-colors">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Flexible Pricing</h3>
                      <p className="text-sm text-gray-600">
                        Support multiple pricing models and billing intervals
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center p-6 border-2 border-dashed border-gray-200 hover:border-primary/30 transition-colors">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
                      <p className="text-sm text-gray-600">
                        PCI-compliant payment processing with encryption
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center p-6 border-2 border-dashed border-gray-200 hover:border-primary/30 transition-colors">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Automated Billing</h3>
                      <p className="text-sm text-gray-600">
                        Automatic recurring charges and invoice generation
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">All Subscriptions</h2>
                  <Badge variant="outline" className="px-3 py-1">
                    {totalSubscriptions} total
                  </Badge>
                </div>
                
                {/* Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                              Tax calculation
                              <HelpCircle className="h-3 w-3 text-gray-400" />
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average monthly total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {safeSubscriptions.map((sub, index) => {
                          const createdDate = sub.createdAt ? 
                            new Date(sub.createdAt).toLocaleDateString('en-US', { 
                              day: 'numeric', 
                              month: 'short' 
                            }) + ', ' + new Date(sub.createdAt).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              hour12: false 
                            }) : 'N/A';

                          const statusDisplay = sub.status === 'trialing' ? 'Trial ends 6 Aug' : sub.status;
                          
                          return (
                            <tr key={sub._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {sub.customerEmail}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge 
                                  variant="outline" 
                                  className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-1 rounded-full"
                                >
                                  {statusDisplay}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {sub.customerName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {sub.customerDescription}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 text-xs px-2 py-1 rounded-full">
                                  Auto
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 text-xs px-2 py-1 rounded-full">
                                  None
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {sub.productName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {createdDate}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {sub.currency} {sub.price.toLocaleString()} / month
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-gray-400 hover:text-gray-600">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Results count */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <p className="text-sm text-gray-500">{totalSubscriptions} result{totalSubscriptions !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <SubscriptionBuilder 
          open={builderOpen} 
          onOpenChange={setBuilderOpen}
          onSuccess={() => {
            toast({
              title: "Success!",
              description: "Subscription created successfully",
            });
          }}
        />
      </DashboardLayout>
    );
  } catch (renderError) {
    console.error('🔍 Render error caught:', renderError);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Render Error</h1>
          <p className="text-gray-600 mb-4">An error occurred while rendering the subscriptions page.</p>
          <pre className="text-sm text-gray-500 bg-gray-100 p-4 rounded overflow-auto max-w-2xl">
            {safeRender(renderError)}
          </pre>
        </div>
      </div>
    );
  }
}