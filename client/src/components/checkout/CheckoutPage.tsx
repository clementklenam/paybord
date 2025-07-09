import { useState } from "react";
import { CheckoutForm } from "./CheckoutForm";
import { Button } from "@/components/ui/button";


  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  
  // Mock product data
  const productData = {
    name: "Business Premium Plan",
    description: "Monthly subscription to PayAfric business premium plan",
    amount: 9900, // $99.00
    currency: "USD",
  };
  
  const handlePaymentSuccess = (data: any) => {
    setPaymentSuccess(true);
    setPaymentData(data);
    console.log("Payment successful:", data);
  };
  
  const handlePaymentError = (error: any) => {
    setError(error);
    console.error("Payment failed:", error);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          {/* Left column - Product details */}
          <div className="w-full md:w-1/3">
            <div className="sticky top-24">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Complete Your Purchase
              </h1>
              <p className="text-gray-500 mb-6">
                Secure payment processing by PayAfric
              </p>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-md bg-gradient-to-br from-green-500/20 to-yellow-500/20 flex items-center justify-center mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1e8449]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{productData.name}</h3>
                      <p className="text-sm text-gray-500">{productData.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">${(productData.amount / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Tax</span>
                    <span className="text-gray-900">$0.00</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t border-gray-200 mt-2">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${(productData.amount / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
                <p className="text-gray-500 text-sm mb-4">
                  If you have any questions about your payment or subscription, our support team is here to help.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right column - Checkout form */}
          <div className="w-full md:w-2/3">
            {paymentSuccess ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-800 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
                  <p className="text-gray-500 mt-2">
                    Thank you for your purchase. Your transaction has been completed.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Transaction Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">Transaction ID:</div>
                    <div className="text-gray-900 font-mono">{paymentData?.transactionId || 'TX-123456'}</div>
                    <div className="text-gray-500">Amount:</div>
                    <div className="text-gray-900">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: paymentData?.currency || productData.currency,
                      }).format((paymentData?.amount || productData.amount) / 100)}
                    </div>
                    <div className="text-gray-500">Payment Method:</div>
                    <div className="text-gray-900">
                      {paymentData?.paymentMethod === 'card' && 'Credit/Debit Card'}
                      {paymentData?.paymentMethod === 'mobileMoney' && 'Mobile Money'}
                      {paymentData?.paymentMethod === 'bankTransfer' && 'Bank Transfer'}
                    </div>
                    <div className="text-gray-500">Date:</div>
                    <div className="text-gray-900">{new Date().toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="text-center space-y-4">
                  <p className="text-gray-500 text-sm">
                    A receipt has been sent to your email address.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="outline">
                      View Receipt
                    </Button>
                    <Button className="bg-[#1e8449] hover:bg-[#196f3d]">
                      Go to Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <CheckoutForm
                amount={productData.amount}
                currency={productData.currency}
                companyName="PayAfric"
                companyLogo="/logo.svg"
                allowedPaymentMethods={["card", "mobileMoney", "bankTransfer"]}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
