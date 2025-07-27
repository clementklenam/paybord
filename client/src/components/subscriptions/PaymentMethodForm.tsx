import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  CreditCard, 
  Edit, 
  Plus, 
  Shield, 
  CheckCircle,
  Lock
} from "lucide-react";
import { useState } from "react";

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'mobile_money';
  brand?: string;
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  bankName?: string;
  accountType?: string;
  isDefault: boolean;
}

interface PaymentMethodFormProps {
  currentPaymentMethod?: PaymentMethod;
  onUpdatePaymentMethod: (paymentMethod: Partial<PaymentMethod>) => Promise<void>;
  onRemovePaymentMethod: () => Promise<void>;
}

export function PaymentMethodForm({ 
  currentPaymentMethod, 
  onUpdatePaymentMethod, 
  onRemovePaymentMethod 
}: PaymentMethodFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    type: 'card' as 'card' | 'bank_account' | 'mobile_money'
  });



  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="h-5 w-5" />;
      case 'bank_account': return <Shield className="h-5 w-5" />;
      case 'mobile_money': return <CreditCard className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  const formatExpiry = (month?: number, year?: number) => {
    if (!month || !year) return '';
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onUpdatePaymentMethod({
        type: formData.type,
        brand: 'visa', // This would be detected from card number
        last4: formData.cardNumber.slice(-4),
        expiryMonth: parseInt(formData.expiryMonth),
        expiryYear: parseInt(formData.expiryYear),
        isDefault: true
      });
      setIsOpen(false);
      setFormData({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardholderName: '',
        type: 'card'
      });
    } catch (error) {
      console.error('Failed to update payment method:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm('Are you sure you want to remove this payment method?')) return;
    
    setIsLoading(true);
    try {
      await onRemovePaymentMethod();
    } catch (error) {
      console.error('Failed to remove payment method:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm dark:bg-gray-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Payment Method
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Manage your payment information
            </CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                {currentPaymentMethod ? (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Update
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-gray-100">
                  {currentPaymentMethod ? 'Update Payment Method' : 'Add Payment Method'}
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Enter your payment information securely
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-gray-900 dark:text-gray-100">Payment Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: 'card' | 'bank_account' | 'mobile_money') => 
                      setFormData(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="border-gray-200 dark:border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-900 dark:text-gray-100">
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="bank_account">Bank Account</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === 'card' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber" className="text-gray-900 dark:text-gray-100">Card Number</Label>
                      <Input
                        id="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                        className="border-gray-200 dark:border-gray-700"
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryMonth" className="text-gray-900 dark:text-gray-100">Expiry Month</Label>
                        <Select 
                          value={formData.expiryMonth} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, expiryMonth: value }))}
                        >
                          <SelectTrigger className="border-gray-200 dark:border-gray-700">
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-900 dark:text-gray-100">
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                                {(i + 1).toString().padStart(2, '0')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expiryYear" className="text-gray-900 dark:text-gray-100">Expiry Year</Label>
                        <Select 
                          value={formData.expiryYear} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, expiryYear: value }))}
                        >
                          <SelectTrigger className="border-gray-200 dark:border-gray-700">
                            <SelectValue placeholder="YY" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-900 dark:text-gray-100">
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = new Date().getFullYear() + i;
                              return (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cvv" className="text-gray-900 dark:text-gray-100">CVV</Label>
                        <Input
                          id="cvv"
                          type="text"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                          className="border-gray-200 dark:border-gray-700"
                          maxLength={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardholderName" className="text-gray-900 dark:text-gray-100">Cardholder Name</Label>
                        <Input
                          id="cardholderName"
                          type="text"
                          placeholder="John Doe"
                          value={formData.cardholderName}
                          onChange={(e) => setFormData(prev => ({ ...prev, cardholderName: e.target.value }))}
                          className="border-gray-200 dark:border-gray-700"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Lock className="h-4 w-4" />
                  <span>Your payment information is encrypted and secure</span>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Save Payment Method'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {currentPaymentMethod ? (
          <div className="space-y-4">
            {/* Current Payment Method */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                  {getPaymentMethodIcon(currentPaymentMethod.type)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {currentPaymentMethod.brand ? 
                        `${currentPaymentMethod.brand.charAt(0).toUpperCase() + currentPaymentMethod.brand.slice(1)} •••• ${currentPaymentMethod.last4}` :
                        `•••• ${currentPaymentMethod.last4}`
                      }
                    </span>
                    {currentPaymentMethod.isDefault && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                  {currentPaymentMethod.expiryMonth && currentPaymentMethod.expiryYear && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Expires {formatExpiry(currentPaymentMethod.expiryMonth, currentPaymentMethod.expiryYear)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Remove Button */}
            <Button 
              variant="outline" 
              onClick={handleRemove}
              disabled={isLoading}
              className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Remove Payment Method
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No payment method added
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Add a payment method to continue with your subscription
            </p>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium">Secure Payment Processing</p>
              <p>All payment information is encrypted and processed securely using industry-standard protocols.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 