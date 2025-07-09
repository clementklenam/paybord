import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Copy, Terminal, Zap, Shield, Globe } from "lucide-react";
import { useState } from "react";


  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`npm install @paybord/js`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippet = `import { Paybord } from '@paybord/js';

const paybord = new Paybord({
  publicKey: 'pk_live_...',
  secretKey: 'sk_live_...'
});

// Create a payment
const payment = await paybord.payments.create({
  amount: 1000,
  currency: 'USD',
  description: 'Order #123',
  customer: {
    email: 'customer@example.com',
    name: 'John Doe'
  },
  payment_method: {
    type: 'card',
    card: {
      number: '4242424242424242',
      exp_month: 12,
      exp_year: 2025,
      cvc: '123'
    }
  }
});

console.log('Payment successful:', payment.id);`;

  return (
    <section className="py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-white font-medium text-sm mb-8 border border-white/20">
              <Zap className="h-4 w-4 mr-2" />
              Developer-First API
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold font-['Space_Grotesk'] text-white mb-8 leading-tight">
              Powerful APIs for{" "}
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                modern payments
              </span>
            </h2>
            
            <p className="text-xl text-white/80 mb-12 leading-relaxed">
              Build payment experiences that scale. Our RESTful APIs and SDKs are designed for developers, 
              with comprehensive documentation, webhooks, and 99.9% uptime SLA.
            </p>

            {/* API Features */}
            <div className="space-y-6 mb-12">
              {[
                { icon: Shield, text: "PCI DSS Level 1 compliant APIs" },
                { icon: Zap, text: "Sub-second response times" },
                { icon: Globe, text: "Webhooks for real-time updates" },
                { icon: Terminal, text: "SDKs for 8+ programming languages" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white/90">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="bg-white text-slate-900 hover:bg-slate-100 text-lg font-semibold px-8 py-6 rounded-xl shadow-lg transition-all duration-300">
                View API Docs
              </Button>
              <Button className="bg-slate-800 text-white border-2 border-white/20 hover:bg-white/10 text-lg font-semibold px-8 py-6 rounded-xl transition-all duration-300">
                Get API Keys
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700 relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Terminal className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-medium text-white">payment.js</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-white"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="bg-slate-900 rounded-lg p-6 overflow-x-auto">
                <pre className="text-sm text-slate-300 font-mono leading-relaxed">
                  <code>{codeSnippet}</code>
                </pre>
              </div>
              
              {/* Code Highlights */}
              <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Payment Created</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Card Validated</span>
                  </div>
                </div>
                <span>Response: 200ms</span>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div
              className="absolute -top-4 -right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Success
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 bg-slate-600 text-white px-3 py-1 rounded-full text-xs font-semibold"
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              Secure
            </motion.div>
          </motion.div>
        </div>
      </Container>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
    </section>
  );
}
