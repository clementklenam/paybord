import {useState, useEffect} from "react";
import {DashboardLayout} from "@/components/dashboard/DashboardLayout";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";
import {Plus, Download, Info, ArrowRight, Sparkles, Users, TrendingUp, Clock, DollarSign, Shield} from "lucide-react";
import {SubscriptionBuilder} from "@/components/subscriptions/SubscriptionBuilder";
import SubscriptionService, { Subscription } from '@/services/subscription.service';
import { useToast } from "@/components/ui/use-toast";

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [showBanner, setShowBanner] = useState(true);
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
        setSubscriptions(subs);
      } catch (err: unknown) {
        setError((err as any)?.response?.data?.error || (err as any)?.message || 'Failed to load subscriptions');
      } finally {
        setLoading(false);
      }
    }
    fetchSubscriptions();
  }, [builderOpen]); // refetch when builder closes (new sub created)

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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All subscriptions</TabsTrigger>
              <TabsTrigger value="test-clocks">Test clocks</TabsTrigger>
              <TabsTrigger value="migrations">Migrations</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>



        {/* Info Banner */}
        {showBanner && (
          <div className="max-w-7xl mx-auto px-0 mb-6">
            <div className="flex items-center justify-between bg-primary/10 text-primary rounded-xl px-6 py-4 shadow border border-primary/20">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-lg">5 steps to go</div>
                  <div className="text-sm opacity-80">Next up: Set up your product catalogue</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" className="text-primary px-3 py-1" size="sm">
                  View steps <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
                <Button variant="ghost" className="text-primary px-3 py-1" size="sm" onClick={() => setShowBanner(false)}>
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-0 mb-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Input placeholder="Active" className="w-32 bg-white border border-gray-200 rounded-md text-sm" />
            <Input placeholder="Scheduled" className="w-32 bg-white border border-gray-200 rounded-md text-sm" />
            <Input placeholder="Cancelled" className="w-32 bg-white border border-gray-200 rounded-md text-sm" />
            <Input placeholder="Simulated" className="w-32 bg-white border border-gray-200 rounded-md text-sm" />
            <Input placeholder="All" className="w-32 bg-white border border-gray-200 rounded-md text-sm" />
            <Badge variant="outline" className="px-3 py-1 rounded-full">Price</Badge>
            <Badge variant="outline" className="px-3 py-1 rounded-full">Simulated</Badge>
            <Badge variant="outline" className="px-3 py-1 rounded-full">Created date</Badge>
            <Badge variant="outline" className="px-3 py-1 rounded-full">Status</Badge>
            <Badge variant="outline" className="px-3 py-1 rounded-full">Customer ID</Badge>
            <Badge variant="outline" className="px-3 py-1 rounded-full">More filters</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="px-3 py-1 rounded-md text-sm">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
            <Button variant="outline" className="px-3 py-1 rounded-md text-sm">
              Analyse
            </Button>
            <Button variant="outline" className="px-3 py-1 rounded-md text-sm">
              Edit columns
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-0 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Subscriptions</p>
                    <p className="text-3xl font-bold">{subscriptions.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Active</p>
                    <p className="text-3xl font-bold">
                      {subscriptions.filter(s => s.status === 'active').length}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Monthly Revenue</p>
                    <p className="text-3xl font-bold">
                      ${subscriptions
                        .filter(s => s.status === 'active' && s.interval === 'month')
                        .reduce((sum, s) => sum + s.price, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Trial Period</p>
                    <p className="text-3xl font-bold">
                      {subscriptions.filter(s => s.status === 'trialing').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-200" />
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
          ) : subscriptions.length === 0 ? (
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
                  {subscriptions.length} total
                </Badge>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {subscriptions.map(sub => (
                  <Card key={sub._id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{sub.product}</h3>
                          <p className="text-sm text-gray-500 mb-2">Customer: {sub.customer}</p>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={sub.status === 'active' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {sub.status || 'pending'}
                            </Badge>
                            <Badge variant="outline" className="text-xs capitalize">
                              {sub.interval}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {sub.currency} {sub.price}
                          </div>
                          <div className="text-xs text-gray-400">per {sub.interval}</div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Started</span>
                          <span className="font-medium">
                            {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        {sub.nextBillingDate && (
                          <div className="flex items-center justify-between text-sm mt-1">
                            <span className="text-gray-500">Next billing</span>
                            <span className="font-medium">
                              {new Date(sub.nextBillingDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <SubscriptionBuilder 
        open={builderOpen} 
        onOpenChange={setBuilderOpen}
        onSuccess={(subscription) => {
          toast({
            title: "Success!",
            description: "Subscription created successfully",
          });
        }}
      />
    </DashboardLayout>
  );
} 