import {useState, useEffect} from "react";
import {useRoute} from "wouter";
import {DashboardLayout} from "@/components/dashboard/DashboardLayout";
import {CustomerProfileCard} from "@/components/subscriptions/CustomerProfileCard";
import {SubscriptionCard} from "@/components/subscriptions/SubscriptionCard";
import {InvoiceList} from "@/components/subscriptions/InvoiceList";
import {PlanSwitcher} from "@/components/subscriptions/PlanSwitcher";
import {PaymentMethodForm} from "@/components/subscriptions/PaymentMethodForm";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Download, 
  Mail
} from "lucide-react";
import {useToast} from "@/components/ui/use-toast";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  billingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod?: {
    type: string;
    brand: string;
    last4: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
}

interface Subscription {
  id: string;
  planName: string;
  planDescription: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  status: 'active' | 'paused' | 'cancelled' | 'past_due' | 'trialing';
  startDate: string;
  nextBillingDate: string;
  trialEndDate?: string;
  usage?: {
    current: number;
    limit: number;
    unit: string;
  };
  features: string[];
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  description: string;
  pdfUrl?: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: string;
  features: string[];
  popular?: boolean;
}

export default function CustomerDetailPage() {
  const [, params] = useRoute<{ id: string }>("/dashboard/customer/:id");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const { toast } = useToast();

  // Demo data
  const demoCustomer: Customer = {
    id: params?.id || "cust_001",
    name: "Acme Corporation",
    email: "billing@acme.com",
    phone: "+1 (555) 123-4567",
    billingAddress: {
      line1: "123 Business Ave",
      line2: "Suite 100",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States"
    },
    paymentMethod: {
      type: "card",
      brand: "visa",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2025
    },
    status: "active",
    createdAt: "2024-01-15"
  };

  const demoSubscription: Subscription = {
    id: "sub_001",
    planName: "Professional",
    planDescription: "Ideal for growing businesses",
    amount: 299.00,
    currency: "USD",
    billingCycle: "monthly",
    status: "active",
    startDate: "2024-01-15",
    nextBillingDate: "2025-01-15",
    usage: {
      current: 85000,
      limit: 100000,
      unit: "transactions"
    },
    features: [
      "Up to 100,000 transactions/month",
      "Advanced API access",
      "Priority support",
      "Advanced integrations",
      "Advanced analytics",
      "Custom webhooks",
      "Multi-currency support"
    ]
  };

  const demoInvoices: Invoice[] = [
    {
      id: "inv_001",
      number: "INV-2024-001",
      date: "2024-12-01",
      dueDate: "2024-12-15",
      amount: 299.00,
      currency: "USD",
      status: "paid",
      description: "Professional Plan - December 2024",
      pdfUrl: "#"
    },
    {
      id: "inv_002",
      number: "INV-2024-002",
      date: "2024-11-01",
      dueDate: "2024-11-15",
      amount: 299.00,
      currency: "USD",
      status: "paid",
      description: "Professional Plan - November 2024",
      pdfUrl: "#"
    },
    {
      id: "inv_003",
      number: "INV-2024-003",
      date: "2025-01-01",
      dueDate: "2025-01-15",
      amount: 299.00,
      currency: "USD",
      status: "pending",
      description: "Professional Plan - January 2025",
      pdfUrl: "#"
    }
  ];

  const demoPlans: Plan[] = [
    {
      id: "plan_starter",
      name: "Starter",
      description: "Perfect for small businesses getting started",
      price: 49,
      currency: "USD",
      billingCycle: "monthly",
      features: [
        "Up to 10,000 transactions/month",
        "Basic API access",
        "Email support",
        "Standard integrations",
        "Basic analytics"
      ]
    },
    {
      id: "plan_pro",
      name: "Professional",
      description: "Ideal for growing businesses",
      price: 299,
      currency: "USD",
      billingCycle: "monthly",
      features: [
        "Up to 100,000 transactions/month",
        "Advanced API access",
        "Priority support",
        "Advanced integrations",
        "Advanced analytics",
        "Custom webhooks",
        "Multi-currency support"
      ],
      popular: true
    },
    {
      id: "plan_enterprise",
      name: "Enterprise",
      description: "For large-scale operations",
      price: 999,
      currency: "USD",
      billingCycle: "monthly",
      features: [
        "Unlimited transactions",
        "Full API access",
        "24/7 phone support",
        "Custom integrations",
        "Advanced analytics",
        "Custom webhooks",
        "Multi-currency support",
        "Dedicated account manager",
        "SLA guarantees",
        "Custom pricing"
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCustomer(demoCustomer);
      setSubscription(demoSubscription);
      setInvoices(demoInvoices);
      setPlans(demoPlans);
      setLoading(false);
    }, 1000);
  }, [params?.id]);

  const handlePauseSubscription = async () => {
    toast({
      title: "Subscription Paused",
      description: "Your subscription has been paused successfully.",
    });
  };

  const handleResumeSubscription = async () => {
    toast({
      title: "Subscription Resumed",
      description: "Your subscription has been resumed successfully.",
    });
  };

  const handleCancelSubscription = async () => {
    toast({
      title: "Subscription Cancelled",
      description: "Your subscription has been cancelled successfully.",
    });
  };

  const handleUpgradeSubscription = async () => {
    toast({
      title: "Plan Upgrade",
      description: "Redirecting to plan selection...",
    });
  };

  const handleSwitchPlan = async (planId: string, _couponCode?: string) => {
    toast({
      title: "Plan Switched",
      description: `Successfully switched to ${plans.find(p => p.id === planId)?.name} plan.`,
    });
  };

  const handleUpdatePaymentMethod = async (_paymentMethod: unknown) => {
    toast({
      title: "Payment Method Updated",
      description: "Your payment method has been updated successfully.",
    });
  };

  const handleRemovePaymentMethod = async () => {
    toast({
      title: "Payment Method Removed",
      description: "Your payment method has been removed successfully.",
    });
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    toast({
      title: "Download Started",
      description: `Downloading invoice ${invoice.number}...`,
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Customer Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The customer you're looking for doesn't exist.
          </p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-8 mb-8 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {customer.name}
              </h1>
              <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
                Customer ID: {customer.id}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex w-full border-b border-gray-200 dark:border-gray-800 mb-6 bg-transparent rounded-none p-0">
          <TabsTrigger value="overview" className="px-4 py-2 text-gray-700 dark:text-gray-200 font-medium border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary dark:data-[state=active]:text-primary-400 rounded-none bg-transparent">
            Overview
          </TabsTrigger>
          <TabsTrigger value="subscription" className="px-4 py-2 text-gray-700 dark:text-gray-200 font-medium border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary dark:data-[state=active]:text-primary-400 rounded-none bg-transparent">
            Subscription
          </TabsTrigger>
          <TabsTrigger value="invoices" className="px-4 py-2 text-gray-700 dark:text-gray-200 font-medium border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary dark:data-[state=active]:text-primary-400 rounded-none bg-transparent">
            Invoices
          </TabsTrigger>
          <TabsTrigger value="payment" className="px-4 py-2 text-gray-700 dark:text-gray-200 font-medium border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary dark:data-[state=active]:text-primary-400 rounded-none bg-transparent">
            Payment Method
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Profile */}
            <div className="lg:col-span-1">
              <CustomerProfileCard 
                customer={customer}
                onEdit={() => console.log('Edit customer')}
              />
            </div>

            {/* Subscription Summary */}
            <div className="lg:col-span-2">
              {subscription && (
                <SubscriptionCard
                  subscription={subscription}
                  onPause={handlePauseSubscription}
                  onResume={handleResumeSubscription}
                  onCancel={handleCancelSubscription}
                  onUpgrade={handleUpgradeSubscription}
                />
              )}
            </div>
          </div>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subscription && (
              <SubscriptionCard
                subscription={subscription}
                onPause={handlePauseSubscription}
                onResume={handleResumeSubscription}
                onCancel={handleCancelSubscription}
                onUpgrade={handleUpgradeSubscription}
              />
            )}
            <PlanSwitcher
              currentPlan={demoPlans.find(p => p.id === "plan_pro")!}
              availablePlans={demoPlans}
              onSwitchPlan={handleSwitchPlan}
              currentBillingCycle="monthly"
              daysUntilNextBilling={15}
            />
          </div>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <InvoiceList
            invoices={invoices}
            onDownload={handleDownloadInvoice}
            onView={(invoice) => console.log('View invoice:', invoice)}
          />
        </TabsContent>

        {/* Payment Method Tab */}
        <TabsContent value="payment" className="space-y-6">
          <PaymentMethodForm
            currentPaymentMethod={customer.paymentMethod ? {
              id: 'temp-id',
              type: customer.paymentMethod.type as 'card' | 'bank_account' | 'mobile_money',
              brand: customer.paymentMethod.brand,
              last4: customer.paymentMethod.last4,
              expiryMonth: customer.paymentMethod.expiryMonth,
              expiryYear: customer.paymentMethod.expiryYear,
              isDefault: true
            } : undefined}
            onUpdatePaymentMethod={handleUpdatePaymentMethod}
            onRemovePaymentMethod={handleRemovePaymentMethod}
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
} 