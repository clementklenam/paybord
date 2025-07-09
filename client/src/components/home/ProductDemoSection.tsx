import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { CreditCard, Shield, BarChart3, Zap, Globe, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Demo components for each product
function PaymentProcessingDemo() {
  const [amount, setAmount] = useState("299.99");
  const [currency, setCurrency] = useState("USD");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
    }, 2000);
  };

  const resetDemo = () => {
    setIsProcessing(false);
    setIsCompleted(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10">
        <h3 className="text-xl font-semibold mb-6 text-white">Payment Processing Demo</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Payment Amount</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white placeholder-gray-400"
                placeholder="0.00"
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
                <option value="CAD">CAD</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Payment Method</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "card", name: "Card", icon: CreditCard, color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
                { id: "bank", name: "Bank", icon: Globe, color: "text-teal-400", bgColor: "bg-teal-500/20" },
                { id: "wallet", name: "Wallet", icon: Zap, color: "text-emerald-400", bgColor: "bg-emerald-500/20" }
              ].map((method) => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`cursor-pointer flex flex-col items-center p-4 rounded-lg border transition-all duration-200 ${
                    paymentMethod === method.id
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : 'border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg ${method.bgColor} flex items-center justify-center ${method.color} mb-2 border border-emerald-500/20`}>
                    <method.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-300">{method.name}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
          >
            {isProcessing ? "Processing..." : `Pay ${currency} ${amount}`}
          </Button>
        </div>
      </div>

      <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10">
        <h3 className="text-xl font-semibold mb-6 text-white">Transaction Status</h3>
        {!isCompleted ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <span className="ml-3 font-medium text-white">Paybord</span>
                </div>
                <span className="text-sm text-gray-400">Secure Payment</span>
              </div>

              <div className="mb-4 pb-4 border-b border-white/20">
                <h4 className="font-medium text-white">Demo Transaction</h4>
                <div className="mt-2 text-2xl font-bold text-white">{currency} {amount}</div>
              </div>

              {isProcessing ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-4 border-t-emerald-500 border-white/20 animate-spin mx-auto mb-4"></div>
                    <div className="text-lg font-medium text-white">Processing Payment...</div>
                    <div className="text-sm text-gray-400 mt-2">Please wait while we process your transaction</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-400">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                    <span>Validating payment method</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                    <span>Processing transaction</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                    <span>Confirming payment</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="h-8 w-8" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-white mb-2">Payment Successful!</div>
              <div className="text-2xl font-bold text-white mb-2">{currency} {amount}</div>
              <div className="text-sm text-gray-400 mb-4">Transaction ID: TX-{Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
              <Button
                onClick={resetDemo}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              >
                New Transaction
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function FraudProtectionDemo() {
  const [riskScore, setRiskScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const analyzeTransaction = () => {
    setIsAnalyzing(true);
    const score = Math.floor(Math.random() * 100);
    setRiskScore(score);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        riskLevel: score < 30 ? "Low" : score < 70 ? "Medium" : "High",
        confidence: Math.floor(Math.random() * 20) + 80,
        factors: score < 30 ? ["Normal location", "Regular amount"] : ["Unusual location", "High amount", "New device"]
      });
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10">
        <h3 className="text-xl font-semibold mb-6 text-white">Fraud Detection Demo</h3>
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
            <h4 className="font-medium text-white mb-3">Transaction Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="text-white">$1,250.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="text-white">New York, US</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Device:</span>
                <span className="text-white">iPhone 14 Pro</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time:</span>
                <span className="text-white">2:30 AM EST</span>
              </div>
            </div>
          </div>

          <Button
            onClick={analyzeTransaction}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Transaction"}
          </Button>
        </div>
      </div>

      <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10">
        <h3 className="text-xl font-semibold mb-6 text-white">AI Analysis Results</h3>
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-t-emerald-500 border-white/20 animate-spin mx-auto mb-4"></div>
              <div className="text-lg font-medium text-white">Analyzing Transaction...</div>
              <div className="text-sm text-gray-400 mt-2">AI models processing data</div>
            </div>
          </div>
        ) : analysisResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-white">Risk Assessment</h4>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  analysisResult.riskLevel === "Low" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" :
                  analysisResult.riskLevel === "Medium" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20" :
                  "bg-red-500/20 text-red-400 border border-red-500/20"
                }`}>
                  {analysisResult.riskLevel} Risk
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Risk Score</span>
                  <span className="text-white font-medium">{riskScore}/100</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      riskScore < 30 ? "bg-emerald-500" :
                      riskScore < 70 ? "bg-yellow-500" :
                      "bg-red-500"
                    }`}
                    style={{ width: `${riskScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Confidence Level</div>
                <div className="text-lg font-semibold text-white">{analysisResult.confidence}%</div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-2">Risk Factors</div>
                <div className="space-y-1">
                  {analysisResult.factors.map((factor: string, index: number) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                      <span className="text-gray-300">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex items-center text-sm text-gray-400">
                <Shield className="h-4 w-4 mr-2 text-emerald-400" />
                <span>Protected by Paybord's AI-powered fraud detection</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-white/20 rounded-lg">
            <p className="text-gray-400">Click "Analyze Transaction" to see AI fraud detection in action</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AnalyticsDemo() {
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [timeRange, setTimeRange] = useState("7d");

  const metrics = {
    revenue: { value: "$124,580", change: "+12.5%", trend: "up" },
    transactions: { value: "2,847", change: "+8.2%", trend: "up" },
    conversion: { value: "3.2%", change: "+0.3%", trend: "up" },
    fraud: { value: "0.02%", change: "-0.01%", trend: "down" }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10">
        <h3 className="text-xl font-semibold mb-6 text-white">Analytics Dashboard</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Time Range</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "1d", name: "1D" },
                { id: "7d", name: "7D" },
                { id: "30d", name: "30D" },
                { id: "90d", name: "90D" }
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id)}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    timeRange === range.id
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-white'
                      : 'border-white/20 hover:bg-white/10 text-gray-400'
                  }`}
                >
                  {range.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(metrics).map(([key, metric]) => (
              <div
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`cursor-pointer p-4 rounded-lg border transition-all duration-200 ${
                  selectedMetric === key
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : 'border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="text-sm text-gray-400 capitalize mb-1">{key}</div>
                <div className="text-xl font-bold text-white mb-1">{metric.value}</div>
                <div className={`text-sm ${
                  metric.trend === "up" ? "text-emerald-400" : "text-red-400"
                }`}>
                  {metric.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10">
        <h3 className="text-xl font-semibold mb-6 text-white">Performance Insights</h3>
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-white">Revenue Trend</h4>
              <div className="text-sm text-emerald-400 font-medium">+12.5%</div>
            </div>
            
            <div className="h-32 bg-white/10 rounded-lg flex items-end justify-between p-4">
              {[20, 35, 28, 45, 38, 52, 48].map((height, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t transition-all duration-300"
                  style={{ height: `${height}%`, width: '12%' }}
                ></div>
              ))}
            </div>
            
            <div className="mt-4 grid grid-cols-7 gap-2 text-xs text-gray-400">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center">{day}</div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
            <div className="flex items-center text-sm text-gray-400">
              <BarChart3 className="h-4 w-4 mr-2 text-emerald-400" />
              <span>Real-time analytics powered by Paybord</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 to-black overflow-hidden" id="product-demos">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      <Container>
        <div className="relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-300 font-medium text-sm mb-8 border border-emerald-500/20 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
              Live Demos
            </div>
            <h2 className="text-4xl font-bold font-['Space_Grotesk'] text-white sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight">
              Interactive{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Product Demos
              </span>
            </h2>
            <p className="mt-8 max-w-3xl mx-auto text-xl text-gray-300 leading-relaxed">
              Experience our enterprise-grade payment solutions with these interactive demonstrations
            </p>
          </motion.div>

          <Tabs defaultValue="processing" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/10 backdrop-blur-sm p-1 rounded-xl border border-white/20">
              <TabsTrigger value="processing" className="text-lg data-[state=active]:bg-emerald-500/20 data-[state=active]:text-white data-[state=active]:border-emerald-500/20 data-[state=active]:shadow-sm">
                <CreditCard className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Payment Processing</span>
              </TabsTrigger>
              <TabsTrigger value="fraud" className="text-lg data-[state=active]:bg-emerald-500/20 data-[state=active]:text-white data-[state=active]:border-emerald-500/20 data-[state=active]:shadow-sm">
                <Shield className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Fraud Protection</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-lg data-[state=active]:bg-emerald-500/20 data-[state=active]:text-white data-[state=active]:border-emerald-500/20 data-[state=active]:shadow-sm">
                <BarChart3 className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent value="processing">
                <PaymentProcessingDemo />
              </TabsContent>

              <TabsContent value="fraud">
                <FraudProtectionDemo />
              </TabsContent>

              <TabsContent value="analytics">
                <AnalyticsDemo />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </Container>
    </section>
  );
}