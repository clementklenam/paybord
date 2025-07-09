import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, User, CreditCard, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

// Demo data for customers and plans
const demoCustomers = [
  { id: "cust_001", name: "Acme Corporation", email: "billing@acme.com" },
  { id: "cust_002", name: "TechStart Inc", email: "finance@techstart.com" },
  { id: "cust_003", name: "Local Store", email: "owner@localstore.com" },
];
const demoPlans = [
  { id: "plan_starter", name: "Starter", price: 49, currency: "USD", billingCycle: "monthly" },
  { id: "plan_pro", name: "Professional", price: 299, currency: "USD", billingCycle: "monthly" },
  { id: "plan_enterprise", name: "Enterprise", price: 999, currency: "USD", billingCycle: "monthly" },
];

export function CreateSubscriptionWizard({ open, onOpenChange, onComplete }: { open: boolean; onOpenChange: (open: boolean) => void; onComplete: (data: any) => void; }) {
  const [step, setStep] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState({ cardNumber: "", expiry: "", cvc: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete({ customer: selectedCustomer, plan: selectedPlan, payment: paymentMethod });
      onOpenChange(false);
      setStep(0);
      setSelectedCustomer("");
      setSelectedPlan("");
      setPaymentMethod({ cardNumber: "", expiry: "", cvc: "" });
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Subscription</DialogTitle>
          <DialogDescription>
            {step === 0 && "Select a customer to subscribe"}
            {step === 1 && "Select a subscription plan"}
            {step === 2 && "Enter payment details"}
            {step === 3 && "Review and confirm subscription"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {step === 0 && (
            <div className="space-y-4">
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {demoCustomers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{c.name}</span>
                        <span className="text-xs text-gray-500">{c.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {demoPlans.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <div className="flex items-center justify-between">
                        <span>{p.name}</span>
                        <span className="text-xs text-gray-500">${p.price}/{p.billingCycle}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <Input
                placeholder="Card Number"
                value={paymentMethod.cardNumber}
                onChange={(e) => setPaymentMethod((pm) => ({ ...pm, cardNumber: e.target.value }))}
                maxLength={19}
              />
              <div className="flex space-x-2">
                <Input
                  placeholder="MM/YY"
                  value={paymentMethod.expiry}
                  onChange={(e) => setPaymentMethod((pm) => ({ ...pm, expiry: e.target.value }))}
                  maxLength={5}
                />
                <Input
                  placeholder="CVC"
                  value={paymentMethod.cvc}
                  onChange={(e) => setPaymentMethod((pm) => ({ ...pm, cvc: e.target.value }))}
                  maxLength={4}
                />
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Review Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Customer:</span>
                      <span>{demoCustomers.find((c) => c.id === selectedCustomer)?.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge>{demoPlans.find((p) => p.id === selectedPlan)?.name}</Badge>
                      <span className="text-gray-500">Plan</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Card:</span>
                      <span>•••• {paymentMethod.cardNumber.slice(-4)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-4">
          {step > 0 && (
            <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          )}
          <div className="flex-1"></div>
          {step < 3 && (
            <Button
              onClick={handleNext}
              disabled={
                (step === 0 && !selectedCustomer) ||
                (step === 1 && !selectedPlan) ||
                (step === 2 && (!paymentMethod.cardNumber || !paymentMethod.expiry || !paymentMethod.cvc))
              }
            >
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
          {step === 3 && (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" /> Create Subscription
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 