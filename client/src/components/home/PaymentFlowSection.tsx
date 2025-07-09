import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle, Clock, ShieldCheck, ArrowRightCircle, Globe, CreditCard, Zap, Database, Cpu, Network } from "lucide-react";

export function PaymentFlowSection() {
  return (
    <section className="py-32 px-4 overflow-hidden bg-gradient-to-b from-slate-950 to-black relative">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>
      <Container>
        <div className="relative z-10 text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-300 font-medium text-sm mb-8 border border-emerald-500/20 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
            Seamless Payment Processing
          </div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-8 font-['Space_Grotesk'] text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            From checkout to{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              settlement
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our intelligent payment infrastructure handles everything from fraud detection to settlement, 
            giving you more time to focus on growing your business.
          </motion.p>
        </div>

        {/* Payment Flow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: CreditCard,
              title: "Customer Checkout",
              description: "Seamless checkout experience with multiple payment options and real-time validation.",
              color: "bg-emerald-500/20 border border-emerald-500/30"
            },
            {
              icon: ShieldCheck,
              title: "Fraud Protection",
              description: "Advanced AI-powered fraud detection with 99.9% accuracy and zero false positives.",
              color: "bg-teal-500/20 border border-teal-500/30"
            },
            {
              icon: Zap,
              title: "Instant Settlement",
              description: "Real-time processing with instant settlement to your bank account.",
              color: "bg-emerald-400/20 border border-emerald-400/30"
            }
          ].map((step, index) => (
            <motion.div
              key={step.title}
              className={`text-center p-8 rounded-2xl shadow-lg backdrop-blur-sm ${step.color} hover:scale-105 transition-all duration-300`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-emerald-500/30">
                <step.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-gray-300 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 max-w-6xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Main animation container with modern styling */}
          <div className="w-full aspect-video h-[600px] relative bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center space-x-3 z-10">
              <div className="flex items-center px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
                <Globe className="h-3.5 w-3.5 text-slate-600 mr-2" />
                <span className="text-xs font-medium text-slate-700">Live Demo</span>
              </div>

              <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer">
                <ExternalLink className="h-4 w-4 text-slate-600" />
              </div>
            </div>

            {/* Payment Flow Demo */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="w-full max-w-2xl">
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">Payment Processing</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-slate-600">Processing...</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-900">Card Validation</span>
                      </div>
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center space-x-3">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                        <span className="text-sm font-medium text-slate-900">Fraud Check</span>
                      </div>
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center space-x-3">
                        <Zap className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-900">Settlement</span>
                      </div>
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-emerald-800">Payment Successful</span>
                      <span className="text-sm text-emerald-600">$99.99</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Interactive feature cards with modern styling */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Clock, title: "< 2 seconds", description: "Average processing time" },
            { icon: ShieldCheck, title: "99.9%", description: "Fraud detection accuracy" },
            { icon: Globe, title: "190+", description: "Countries supported" },
            { icon: CheckCircle, title: "24/7", description: "Monitoring & support" }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-200">
                <stat.icon className="h-6 w-6 text-slate-700" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-2">{stat.title}</div>
              <div className="text-sm text-slate-600">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}