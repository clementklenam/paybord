import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Link2, Box, Terminal, CreditCard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

// Demo components for each product
function PaymesaLinksDemo() {
  const [linkName, setLinkName] = useState("My Payment Link");
  const [amount, setAmount] = useState("299.99");
  const [currency, setCurrency] = useState("USD");
  const [isDemoGenerated, setIsDemoGenerated] = useState(false);
  
  const generateDemoLink = () => {
    setIsDemoGenerated(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-semibold mb-4">Create Payment Link</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link Name</label>
            <input 
              type="text" 
              value={linkName}
              onChange={(e) => setLinkName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input 
                type="text" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="USD">USD</option>
                <option value="NGN">NGN</option>
                <option value="KES">KES</option>
                <option value="GHS">GHS</option>
                <option value="ZAR">ZAR</option>
              </select>
            </div>
          </div>
          <div className="pt-2">
            <Button 
              onClick={generateDemoLink}
              className="w-full bg-[#6C2BFB] hover:bg-[#5921c9]"
            >
              Create Payment Link
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-xl shadow-md border border-gray-100 h-full">
        <h3 className="text-xl font-semibold mb-4">Preview</h3>
        {!isDemoGenerated ? (
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Fill the form and click "Create Payment Link" to see a preview</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-[#6C2BFB] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="ml-2 font-medium">Paymesa</span>
              </div>
              <span className="text-sm text-gray-500">Secure Payment</span>
            </div>
            
            <div className="mb-4 pb-4 border-b border-gray-100">
              <h4 className="font-medium">{linkName}</h4>
              <div className="mt-2 text-2xl font-bold">{currency} {amount}</div>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm text-gray-600">Card Information</label>
                <div className="border border-gray-300 rounded-md p-2 bg-gray-50">
                  <div className="text-gray-400 text-sm">4242 4242 4242 4242</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-gray-300 rounded-md p-2 bg-gray-50">
                    <div className="text-gray-400 text-sm">MM/YY</div>
                  </div>
                  <div className="border border-gray-300 rounded-md p-2 bg-gray-50">
                    <div className="text-gray-400 text-sm">CVC</div>
                  </div>
                </div>
              </div>
              
              <Button className="w-full bg-[#6C2BFB] hover:bg-[#5921c9]">
                Pay {currency} {amount}
              </Button>
            </div>
            
            <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secured by Paymesa
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function PaymesaConnectDemo() {
  const [selectedMethod, setSelectedMethod] = useState("momo");
  const [showResult, setShowResult] = useState(false);
  
  const handleMethodChange = (method: string) => {
    setSelectedMethod(method);
    setShowResult(false);
  };
  
  const handleSubmit = () => {
    setShowResult(true);
  };
  
  const methodConfig = {
    momo: {
      name: "Mobile Money",
      icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" />
        <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        <path d="M7 9a1 1 0 011-1h4a1 1 0 010 2H8a1 1 0 01-1-1z" />
        <path d="M7 11a1 1 0 011-1h4a1 1 0 010 2H8a1 1 0 01-1-1z" />
      </svg>,
      color: "text-green-600",
      bgColor: "bg-green-100",
      field: "Phone Number",
      placeholder: "Enter Mobile Money number",
      sampleValue: "+233 20 123 4567",
    },
    card: {
      name: "Card Payment",
      icon: <CreditCard className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      field: "Card Number",
      placeholder: "Enter card number",
      sampleValue: "4242 4242 4242 4242",
    },
    bank: {
      name: "Bank Transfer",
      icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      field: "Account Number",
      placeholder: "Enter account number",
      sampleValue: "0123456789",
    },
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-semibold mb-4">Unified Payment API Demo</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(methodConfig).map(([key, method]) => (
                <div 
                  key={key}
                  onClick={() => handleMethodChange(key)}
                  className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border ${
                    selectedMethod === key 
                      ? 'border-[#6C2BFB] bg-purple-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${method.bgColor} flex items-center justify-center ${method.color} mb-1`}>
                    {method.icon}
                  </div>
                  <span className="text-xs font-medium text-center">{method.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {methodConfig[selectedMethod as keyof typeof methodConfig]?.field}
            </label>
            <input 
              type="text" 
              placeholder={methodConfig[selectedMethod as keyof typeof methodConfig]?.placeholder}
              defaultValue={methodConfig[selectedMethod as keyof typeof methodConfig]?.sampleValue}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input 
                type="text" 
                defaultValue="500.00"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select 
                defaultValue="GHS"
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="NGN">NGN</option>
                <option value="KES">KES</option>
                <option value="GHS">GHS</option>
                <option value="ZAR">ZAR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              onClick={handleSubmit}
              className="w-full bg-[#6C2BFB] hover:bg-[#5921c9]"
            >
              Process Payment
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-xl shadow-md border border-gray-100 h-full">
        <h3 className="text-xl font-semibold mb-4">API Response</h3>
        {!showResult ? (
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Click "Process Payment" to see API response</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-sm"
          >
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="whitespace-pre-wrap">
{`// API Response
{
  "status": "success",
  "message": "Payment initiated",
  "data": {
    "transaction_id": "trx_${Math.random().toString(36).substring(2, 10)}",
    "amount": 500.00,
    "currency": "GHS",
    "payment_method": "${methodConfig[selectedMethod as keyof typeof methodConfig]?.name}",
    "status": "pending",
    "created_at": "${new Date().toISOString()}",
    "payment_url": "https://paymesa.app/checkout/tx_${Math.random().toString(36).substring(2, 15)}"
  }
}

// Client Usage Example
const response = await paymesa.payments.create({
  amount: 500.00,
  currency: "GHS",
  payment_method: "${selectedMethod}",
  payment_details: {
    // Method specific details
  },
  metadata: {
    customer_id: "cust_123456",
    product_name: "Premium Plan"
  }
});`}
              </pre>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function PaymesaPOSDemo() {
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const handleScan = () => {
    setScanned(true);
    setTimeout(() => {
      setProcessing(true);
      setTimeout(() => {
        setCompleted(true);
      }, 2000);
    }, 1500);
  };
  
  const resetDemo = () => {
    setScanned(false);
    setProcessing(false);
    setCompleted(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div className="lg:order-2">
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">POS Demo</h3>
          {!scanned ? (
            <div className="space-y-6">
              <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-[#6C2BFB] rounded-md flex items-center justify-center animated-scanner">
                    <div className="text-sm text-gray-500">Scan Card or QR</div>
                  </div>
                  <div 
                    className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#6C2BFB] opacity-70"
                    style={{
                      animation: "scanAnimation 2s infinite",
                      transformOrigin: "center"
                    }}
                  />
                </div>
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes scanAnimation {
                    0% { transform: translateY(-40px); }
                    50% { transform: translateY(40px); }
                    100% { transform: translateY(-40px); }
                  }
                `}} />
              </div>
              <Button 
                onClick={handleScan}
                className="w-full bg-[#6C2BFB] hover:bg-[#5921c9]"
              >
                Simulate Card Scan
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden flex flex-col items-center justify-center p-4">
                {!completed ? (
                  <>
                    <div className="w-16 h-16 rounded-full border-4 border-t-[#6C2BFB] border-gray-200 animate-spin mb-4" />
                    <div className="text-lg font-medium">{processing ? "Processing Payment..." : "Reading Card..."}</div>
                    <div className="text-sm text-gray-500 mt-2">Please do not remove your card</div>
                  </>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="text-lg font-medium">Payment Successful!</div>
                    <div className="text-2xl font-bold mt-2">GHS 250.00</div>
                    <div className="text-sm text-gray-500 mt-1">Transaction ID: TX-{Math.random().toString(36).substring(2, 10)}</div>
                  </motion.div>
                )}
              </div>
              {completed && (
                <Button 
                  onClick={resetDemo}
                  className="w-full bg-[#6C2BFB] hover:bg-[#5921c9]"
                >
                  New Transaction
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="lg:order-1">
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">POS Device Features</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-0.5">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="ml-2 text-gray-700">Accept payments via card, mobile money, and QR</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-0.5">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="ml-2 text-gray-700">Works offline with store-and-forward capability</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-0.5">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="ml-2 text-gray-700">Real-time reporting and transaction history</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-0.5">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="ml-2 text-gray-700">Bluetooth connectivity with mobile app</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-0.5">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="ml-2 text-gray-700">Multi-user support for store employees</span>
            </li>
          </ul>
          
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-gray-800 mb-2">Current Transaction</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Amount:</div>
              <div className="font-medium">GHS 250.00</div>
              <div className="text-gray-500">Terminal ID:</div>
              <div className="font-medium">POS-{Math.random().toString(36).substring(2, 8).toUpperCase()}</div>
              <div className="text-gray-500">Merchant:</div>
              <div className="font-medium">Metro Supermarket</div>
              <div className="text-gray-500">Status:</div>
              <div className="font-medium text-blue-600">{completed ? "Completed" : processing ? "Processing" : scanned ? "Authorizing" : "Ready"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductDemoSection() {
  return (
    <section className="py-20 bg-gray-50" id="product-demos">
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold font-['Space_Grotesk'] text-gray-900 sm:text-4xl">
            Interactive Product Demos
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
            Try out our products with these interactive demos
          </p>
        </motion.div>

        <Tabs defaultValue="links" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="links" className="text-lg">
              <Link2 className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">PaymesaLinks</span>
            </TabsTrigger>
            <TabsTrigger value="connect" className="text-lg">
              <Box className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">PaymesaConnect</span>
            </TabsTrigger>
            <TabsTrigger value="pos" className="text-lg">
              <Terminal className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">PaymesaPOS</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-8">
            <TabsContent value="links">
              <PaymesaLinksDemo />
            </TabsContent>
            
            <TabsContent value="connect">
              <PaymesaConnectDemo />
            </TabsContent>
            
            <TabsContent value="pos">
              <PaymesaPOSDemo />
            </TabsContent>
          </div>
        </Tabs>
      </Container>
    </section>
  );
}