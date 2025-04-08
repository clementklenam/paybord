import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { PaymentFlowAnimation } from "@/assets/svgs/PaymentFlowAnimation";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle, Clock, ShieldCheck, ArrowRightCircle } from "lucide-react";

export function PaymentFlowSection() {
  return (
    <section className="py-24 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <Container>
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-50 text-purple-800 font-medium text-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-purple-600 mr-2 animate-pulse"></span>
            End-to-End Payment Tracking
          </div>
          
          <motion.h2
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6 font-['Space_Grotesk']"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            See Your Payments Flow with{" "}
            <span className="bg-gradient-to-r from-[#6C2BFB] to-[#0FCEA6] bg-clip-text text-transparent">
              Paymesa
            </span>
          </motion.h2>
          
          <motion.p
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Visualize the complete payment journey across Africa's diverse payment ecosystem. 
            Our powerful API abstracts away complexity while giving you full visibility into every transaction.
          </motion.p>
        </div>
        
        <motion.div 
          className="mt-12 max-w-6xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Main animation container with improved styling */}
          <div className="w-full aspect-video bg-white rounded-3xl shadow-xl overflow-hidden p-6 border border-gray-100">
            <div className="absolute top-6 left-6 flex items-center space-x-2 z-10">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
            </div>
            
            <div className="absolute top-6 right-6 flex items-center space-x-2 z-10">
              <span className="text-xs font-medium text-gray-400 mr-1">API Dashboard</span>
              <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center">
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <PaymentFlowAnimation />
          </div>
          
          {/* Interactive step cards with hover effects */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:border-purple-200 hover:shadow-purple-100/50 transition duration-300 relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full opacity-40 -z-10 group-hover:bg-purple-100 transition-all duration-300"></div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-5 group-hover:bg-purple-200 transition-all duration-300">
                <CheckCircle className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Initiation & Validation</h3>
              <p className="text-gray-600 leading-relaxed">Secure API endpoints validate each payment request, supporting multiple authentication methods and real-time fraud detection.</p>
              <div className="mt-4 text-purple-700 font-medium flex items-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn more <ArrowRightCircle className="ml-1 w-4 h-4" />
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:border-purple-200 hover:shadow-purple-100/50 transition duration-300 relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full opacity-40 -z-10 group-hover:bg-purple-100 transition-all duration-300"></div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-5 group-hover:bg-purple-200 transition-all duration-300">
                <Clock className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Processing & Routing</h3>
              <p className="text-gray-600 leading-relaxed">Intelligent routing system delivers payments to the appropriate gateway based on method, region, and optimal processing fees.</p>
              <div className="mt-4 text-purple-700 font-medium flex items-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn more <ArrowRightCircle className="ml-1 w-4 h-4" />
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:border-purple-200 hover:shadow-purple-100/50 transition duration-300 relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full opacity-40 -z-10 group-hover:bg-purple-100 transition-all duration-300"></div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-5 group-hover:bg-purple-200 transition-all duration-300">
                <ShieldCheck className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Settlement & Reconciliation</h3>
              <p className="text-gray-600 leading-relaxed">Automated settlement processes with comprehensive reconciliation across currencies and payment methods for accurate accounting.</p>
              <div className="mt-4 text-purple-700 font-medium flex items-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn more <ArrowRightCircle className="ml-1 w-4 h-4" />
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:border-purple-200 hover:shadow-purple-100/50 transition duration-300 relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full opacity-40 -z-10 group-hover:bg-purple-100 transition-all duration-300"></div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-5 group-hover:bg-purple-200 transition-all duration-300">
                <svg className="w-6 h-6 text-purple-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 10.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M8 14H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Confirmation & Notification</h3>
              <p className="text-gray-600 leading-relaxed">Real-time webhooks, SMS, and email notifications for both merchants and customers with customizable templates and branding.</p>
              <div className="mt-4 text-purple-700 font-medium flex items-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn more <ArrowRightCircle className="ml-1 w-4 h-4" />
              </div>
            </motion.div>
          </div>
          
          {/* Call to action */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <Button className="bg-[#6C2BFB] hover:bg-[#5921c9] text-lg px-10 py-6">
              Start Integrating Today
            </Button>
            <p className="mt-4 text-gray-500 text-sm">
              No credit card required. Get started with our sandbox environment.
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}