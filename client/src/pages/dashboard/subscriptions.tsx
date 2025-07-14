import {useState, useEffect} from "react";
import {DashboardLayout} from "@/components/dashboard/DashboardLayout";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";
import {Plus, Download, Info, ArrowRight} from "lucide-react";
import {CreateSubscriptionDrawer} from "@/components/subscriptions/CreateSubscriptionDrawer";
import SubscriptionService, { Subscription } from '@/services/subscription.service';

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [showBanner, setShowBanner] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscriptions() {
      setLoading(true);
      setError(null);
      try {
        const subs = await SubscriptionService.listSubscriptions();
        setSubscriptions(subs);
      } catch (err: unknown) {
        setError(err?.response?.data?.error || err.message || 'Failed to load subscriptions');
      } finally {
        setLoading(false);
      }
    }
    fetchSubscriptions();
  }, [drawerOpen]); // refetch when drawer closes (new sub created)

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header and Tabs */}
        <div className="max-w-7xl mx-auto px-0 pt-2 pb-2">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
            <Button variant="default" size="lg" onClick={() => setDrawerOpen(true)}>
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

        {/* Empty State */}
        <div className="max-w-7xl mx-auto px-0 pt-12 pb-24 flex flex-col items-center justify-center">
          {loading ? (
            <div className="text-gray-600">Loading subscriptions...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : subscriptions.length === 0 ? (
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <svg width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="16" fill="#F3F4F6"/><path d="M16 10v8m0 0v2m0-2h2m-2 0h-2" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="text-xl font-semibold text-gray-900 mb-2">Create your first subscription</div>
              <div className="text-gray-600 mb-4 text-center max-w-md">
                Collect recurring payments with any pricing model, including flat rate, seat-based, tiered, and usage-based.
              </div>
              <Button variant="default" className="font-semibold px-5 py-2 rounded-lg shadow" onClick={() => setDrawerOpen(true)}>
                + Create a subscription
              </Button>
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto">
              <h2 className="text-lg font-semibold mb-4">All Subscriptions</h2>
              <div className="grid grid-cols-1 gap-4">
                {subscriptions.map(sub => (
                  <div key={sub._id} className="bg-white rounded-lg shadow border p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{sub.product && typeof sub.product === 'object' ? sub.product.name : sub.product}</div>
                      <div className="text-xs text-gray-500">Customer: {sub.customer && typeof sub.customer === 'object' ? sub.customer.name : sub.customer}</div>
                      <div className="text-xs text-gray-500">Interval: {sub.interval}</div>
                      <div className="text-xs text-gray-500">Status: {sub.status}</div>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                      <div className="text-lg font-bold text-primary">{sub.currency} {sub.price}</div>
                      <div className="text-xs text-gray-400">Start: {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : '-'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <CreateSubscriptionDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </DashboardLayout>
  );
} 