import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Crown, 
  Sparkles, 
  CheckCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Calculator,
  Tag,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: string;
  features: string[];
  popular?: boolean;
  recommended?: boolean;
}

interface PlanSwitcherProps {
  currentPlan: Plan;
  availablePlans: Plan[];
  onSwitchPlan: (planId: string, couponCode?: string) => Promise<void>;
  currentBillingCycle: 'monthly' | 'yearly';
  daysUntilNextBilling: number;
}

export function PlanSwitcher({ 
  currentPlan, 
  availablePlans, 
  onSwitchPlan, 
  currentBillingCycle,
  daysUntilNextBilling 
}: PlanSwitcherProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const calculateProration = (newPlan: Plan) => {
    const currentPrice = currentPlan.price;
    const newPrice = newPlan.price;
    const daysInCycle = currentBillingCycle === 'monthly' ? 30 : 365;
    const remainingDays = daysUntilNextBilling;
    
    // Calculate unused portion of current plan
    const unusedAmount = (currentPrice / daysInCycle) * remainingDays;
    
    // Calculate cost of new plan for remaining days
    const newPlanCost = (newPrice / daysInCycle) * remainingDays;
    
    // Proration amount (positive = credit, negative = additional charge)
    const proration = unusedAmount - newPlanCost;
    
    return {
      unusedAmount,
      newPlanCost,
      proration,
      immediateCharge: Math.max(0, -proration),
      credit: Math.max(0, proration)
    };
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleSwitchPlan = async () => {
    if (!selectedPlan) return;
    
    setIsLoading(true);
    try {
      await onSwitchPlan(selectedPlan.id, couponCode || undefined);
    } catch (error) {
      console.error('Failed to switch plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isUpgrade = selectedPlan && selectedPlan.price > currentPlan.price;
  const isDowngrade = selectedPlan && selectedPlan.price < currentPlan.price;
  const proration = selectedPlan ? calculateProration(selectedPlan) : null;

  return (
    <Card className="border-0 shadow-sm dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Switch Plan
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Upgrade or downgrade your subscription. Changes will be prorated.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Current Plan</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{currentPlan.name}</p>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(currentPlan.price, currentPlan.currency)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                per {currentBillingCycle}
              </div>
            </div>
          </div>
        </div>

        {/* Available Plans */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Available Plans</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availablePlans
              .filter(plan => plan.id !== currentPlan.id)
              .map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedPlan?.id === plan.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handlePlanSelect(plan)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {plan.name}
                      </CardTitle>
                      {plan.popular && (
                        <Badge className="bg-primary text-primary-foreground">
                          <Crown className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {formatCurrency(plan.price, plan.currency)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          per {currentBillingCycle}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                            <span className="text-xs text-gray-700 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {isUpgrade && plan.id === selectedPlan?.id && (
                        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                          <ArrowUpRight className="h-4 w-4" />
                          <span className="text-sm font-medium">Upgrade</span>
                        </div>
                      )}
                      
                      {isDowngrade && plan.id === selectedPlan?.id && (
                        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                          <ArrowDownRight className="h-4 w-4" />
                          <span className="text-sm font-medium">Downgrade</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Proration Details */}
        {selectedPlan && proration && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                Proration Details
              </h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Unused amount:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(proration.unusedAmount, currentPlan.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">New plan cost:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(proration.newPlanCost, selectedPlan.currency)}
                </span>
              </div>
              <div className="border-t border-blue-200 dark:border-blue-700 pt-2">
                {proration.immediateCharge > 0 ? (
                  <div className="flex justify-between text-red-600 dark:text-red-400">
                    <span>Additional charge:</span>
                    <span className="font-semibold">
                      {formatCurrency(proration.immediateCharge, selectedPlan.currency)}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Credit applied:</span>
                    <span className="font-semibold">
                      {formatCurrency(proration.credit, currentPlan.currency)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Coupon Code */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Coupon Code
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCouponInput(!showCouponInput)}
              className="text-primary hover:text-primary/80"
            >
              <Tag className="h-4 w-4 mr-1" />
              {showCouponInput ? 'Hide' : 'Add'}
            </Button>
          </div>
          {showCouponInput && (
            <div className="flex space-x-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 border-gray-200 dark:border-gray-700"
              />
              <Button variant="outline" size="sm">
                Apply
              </Button>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedPlan && (
              <span>
                Switching to <strong>{selectedPlan.name}</strong>
              </span>
            )}
          </div>
          <Button
            onClick={handleSwitchPlan}
            disabled={!selectedPlan || isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              'Processing...'
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Switch Plan
              </>
            )}
          </Button>
        </div>

        {/* Warning */}
        <div className="flex items-start space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-medium">Plan changes take effect immediately</p>
            <p>Your billing cycle and next payment date will be adjusted accordingly.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 