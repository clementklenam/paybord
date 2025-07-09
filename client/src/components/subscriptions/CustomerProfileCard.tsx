import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Edit,
  Copy,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

interface CustomerProfileCardProps {
  customer: {
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
  };
  onEdit?: () => void;
}

export function CustomerProfileCard({ customer, onEdit }: CustomerProfileCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <Card className="border-0 shadow-sm dark:bg-gray-900">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" alt={customer.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {customer.name}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Customer since {formatDate(customer.createdAt)}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(customer.status)}>
              {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
            </Badge>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer ID */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer ID</span>
          </div>
          <div className="flex items-center space-x-2">
            <code className="text-sm bg-white dark:bg-gray-700 px-2 py-1 rounded border">
              {customer.id}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(customer.id)}
              className="h-6 w-6 p-0"
            >
              {copied ? (
                <CheckCircle className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Contact Information</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{customer.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Method */}
        {customer.paymentMethod && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Payment Method</h4>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <CreditCard className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {customer.paymentMethod.brand.charAt(0).toUpperCase() + customer.paymentMethod.brand.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    •••• {customer.paymentMethod.last4}
                  </span>
                </div>
                {customer.paymentMethod.expiryMonth && customer.paymentMethod.expiryYear && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Expires {customer.paymentMethod.expiryMonth}/{customer.paymentMethod.expiryYear}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Billing Address */}
        {customer.billingAddress && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Billing Address</h4>
            <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <div>{customer.billingAddress.line1}</div>
                {customer.billingAddress.line2 && <div>{customer.billingAddress.line2}</div>}
                <div>
                  {customer.billingAddress.city}, {customer.billingAddress.state} {customer.billingAddress.postalCode}
                </div>
                <div>{customer.billingAddress.country}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 