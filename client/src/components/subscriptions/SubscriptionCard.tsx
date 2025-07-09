import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  CreditCard, 
  Pause, 
  Play, 
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Zap
} from "lucide-react";
import { useState } from "react";

interface SubscriptionCardProps {
  subscription: {
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
  };
  onPause?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
  onUpgrade?: () => void;
}

export function SubscriptionCard({ 
  subscription, 
  onPause, 
  onResume, 
  onCancel, 
  onUpgrade 
}: SubscriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'trialing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'past_due': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'paused': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'trialing': return <Clock className="h-4 w-4" />;
      case 'past_due': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleAction = async (action: () => void | Promise<void>) => {
    setIsLoading(true);
    try {
      await action();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isTrialing = subscription.status === 'trialing';
  const isActive = subscription.status === 'active';
  const isPaused = subscription.status === 'paused';

  return (
    <Card className="border-0 shadow-sm dark:bg-gray-900">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {subscription.planName}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {subscription.planDescription}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(subscription.status)}>
              {getStatusIcon(subscription.status)}
              <span className="ml-1">{subscription.status.replace('_', ' ')}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pricing */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(subscription.amount, subscription.currency)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              per {subscription.billingCycle}
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-full">
            <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Usage */}
        {subscription.usage && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Usage</h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {subscription.usage.current.toLocaleString()} / {subscription.usage.limit === -1 ? '∞' : subscription.usage.limit.toLocaleString()} {subscription.usage.unit}
              </span>
            </div>
            <Progress 
              value={(subscription.usage.current / (subscription.usage.limit === -1 ? subscription.usage.current : subscription.usage.limit)) * 100} 
              className="h-2"
            />
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Started</span>
            </div>
            <div className="text-sm text-gray-900 dark:text-gray-100">
              {formatDate(subscription.startDate)}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Next Billing</span>
            </div>
            <div className="text-sm text-gray-900 dark:text-gray-100">
              {formatDate(subscription.nextBillingDate)}
            </div>
          </div>
        </div>

        {/* Trial Info */}
        {isTrialing && subscription.trialEndDate && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Trial ends {formatDate(subscription.trialEndDate)}
              </span>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Plan Features</h4>
          <div className="space-y-2">
            {subscription.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
            {subscription.features.length > 3 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                +{subscription.features.length - 3} more features
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          {isActive && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAction(onPause!)}
                disabled={isLoading}
                className="flex-1"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAction(onCancel!)}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
            </>
          )}
          {isPaused && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAction(onResume!)}
                disabled={isLoading}
                className="flex-1"
              >
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAction(onCancel!)}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
            </>
          )}
          <Button 
            onClick={() => handleAction(onUpgrade!)}
            disabled={isLoading}
            className="flex-1"
          >
            <Zap className="h-4 w-4 mr-2" />
            {isTrialing ? 'Subscribe' : 'Upgrade'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 