import { Container } from "@/components/ui/container";
import { PaymentFlowAnimation } from "@/assets/svgs/PaymentFlowAnimation";
import { motion } from "framer-motion";

export function PaymentFlowSection() {
  return (
    <section className="py-20 overflow-hidden">
      <Container>
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How Payments Flow with {" "}
            <span className="bg-gradient-to-r from-[#6C2BFB] to-[#0FCEA6] bg-clip-text text-transparent">
              OthoPay
            </span>
          </motion.h2>
          <motion.p
            className="text-lg text-gray-500 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Visualize the complete payment journey from initiation to confirmation. Our unified API handles 
            the complexity across different payment methods throughout Africa.
          </motion.p>
        </div>
        
        <motion.div 
          className="mt-12 max-w-5xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-full aspect-video bg-white rounded-2xl shadow-lg overflow-hidden p-4">
            <PaymentFlowAnimation />
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <span className="text-purple-600 font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Initiation & Validation</h3>
              <p className="text-gray-500 text-sm">Payment request is initiated and validated through OthoPay's secure API endpoints.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Processing & Routing</h3>
              <p className="text-gray-500 text-sm">OthoPay intelligently routes the payment to the appropriate gateway based on method and region.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Settlement & Reconciliation</h3>
              <p className="text-gray-500 text-sm">Funds are securely settled and automatically reconciled with your account records.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <span className="text-purple-600 font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Confirmation & Notification</h3>
              <p className="text-gray-500 text-sm">Real-time notifications are sent to both merchants and customers upon successful completion.</p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}