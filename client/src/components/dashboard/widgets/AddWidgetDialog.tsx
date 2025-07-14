import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import { 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Shield,
  CheckCircle,
  DollarSign,
  AlertCircle,
  ExternalLink
} from "lucide-react";

export const WIDGET_TYPES = {
  DISPUTE_ACTIVITY: "disputeActivity",
  DISPUTE_COUNT: "disputeCount",
  DISPUTED_PAYMENTS: "disputedPayments",
  NET_VOLUME_SALES: "netVolumeSales",
  CUSTOMERS: "customers",
  NEW_CUSTOMERS: "newCustomers",
  SPEND_PER_CUSTOMER: "spendPerCustomer",
  TOP_CUSTOMERS: "topCustomers",
  HIGH_RISK_PAYMENTS: "highRiskPayments",
  SUCCESSFUL_PAYMENTS: "successfulPayments",
  PAYMENT_SOURCES: "paymentSources"
} as const;

const AVAILABLE_WIDGETS = [
  {
    id: "dispute-activity",
    type: WIDGET_TYPES.DISPUTE_ACTIVITY,
    title: "Dispute Activity",
    description: "Monitor and track dispute trends",
    category: "disputes",
    icon: <AlertCircle className="h-4 w-4 text-muted-foreground" />
  },
  {
    id: "dispute-count",
    type: WIDGET_TYPES.DISPUTE_COUNT,
    title: "Active Disputes",
    description: "Track the number and categories of active disputes",
    category: "disputes",
    icon: <AlertTriangle className="h-4 w-4 text-muted-foreground" />
  },
  {
    id: "disputed-payments",
    type: WIDGET_TYPES.DISPUTED_PAYMENTS,
    title: "Disputed Payments",
    description: "View payments under dispute",
    category: "disputes",
    icon: <AlertTriangle className="h-4 w-4 text-muted-foreground" />
  },
  {
    id: "net-volume-sales",
    type: WIDGET_TYPES.NET_VOLUME_SALES,
    title: "Net Volume Sales",
    description: "Track your net sales volume",
    category: "sales",
    icon: <DollarSign className="h-4 w-4 text-muted-foreground" />
  },
  {
    id: "customers",
    type: WIDGET_TYPES.CUSTOMERS,
    title: "Customers",
    description: "Overview of all customers",
    category: "customers",
    icon: <Users className="h-4 w-4 text-muted-foreground" />
  },
  {
    id: "new-customers",
    type: WIDGET_TYPES.NEW_CUSTOMERS,
    title: "New Customers",
    description: "Track new customer acquisitions",
    category: "customers",
    icon: <Users className="h-4 w-4 text-muted-foreground" />
  },
  {
    id: "spend-per-customer",
    type: WIDGET_TYPES.SPEND_PER_CUSTOMER,
    title: "Spend per Customer",
    description: "Average spending per customer",
    category: "customers",
    icon: <DollarSign className="h-4 w-4 text-muted-foreground" />
  },
  {
    id: "top-customers",
    type: WIDGET_TYPES.TOP_CUSTOMERS,
    title: "Top Customers",
    description: "View your highest value customers",
    category: "customers",
    icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />
  },
  {
    id: "high-risk-payments",
    type: WIDGET_TYPES.HIGH_RISK_PAYMENTS,
    title: "High Risk Payments",
    description: "Monitor potentially risky transactions",
    category: "risk",
    icon: <Shield className="h-4 w-4 text-muted-foreground" />
  },
  {
    id: "successful-payments",
    type: WIDGET_TYPES.SUCCESSFUL_PAYMENTS,
    title: "Successful Payments",
    description: "Track successful payment transactions",
    category: "payments",
    icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />
  },
  {
    id: "payment-sources",
    type: WIDGET_TYPES.PAYMENT_SOURCES,
    title: "Payment Sources",
    description: "View where your payments are coming from",
    category: "payments",
    icon: <ExternalLink className="h-4 w-4 text-muted-foreground" />
  }
];

interface AddWidgetDialogProps {
  open: boolean;
  onClose: () => void;
  onAddWidget: (type: string) => void;
  existingWidgets: { id: string; type: string; }[];
}

export function AddWidgetDialog({ open, onClose, onAddWidget, existingWidgets }: AddWidgetDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(AVAILABLE_WIDGETS.map(widget => widget.category)));

  const filteredWidgets = AVAILABLE_WIDGETS.filter(widget => {
    const alreadyExists = existingWidgets.some(w => w.type === widget.type);
    const matchesSearch = widget.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || widget.category === selectedCategory;
    return !alreadyExists && matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add widget</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Search widgets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-full text-sm ${!selectedCategory
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
                }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                className={`px-3 py-1 rounded-full text-sm capitalize ${category === selectedCategory
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredWidgets.map((widget) => (
                <button
                  key={widget.id}
                  onClick={() => {
                    onAddWidget(widget.type);
                    onClose();
                  }}
                  className="w-full rounded-lg border p-4 text-left hover:bg-accent transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {widget.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-medium leading-none">{widget.title}</h4>
                      <p className="text-sm text-muted-foreground">{widget.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-secondary px-2 py-0.5 rounded-full capitalize">
                          {widget.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
