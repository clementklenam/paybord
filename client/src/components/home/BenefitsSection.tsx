import {Container} from "@/components/ui/container";
import {motion} from "framer-motion";
import {Shield, Zap, Globe, CreditCard, BarChart3, Smartphone, Database, Cpu, Network} from "lucide-react";

function BenefitsSection() {
  const benefits = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "PCI DSS Level 1 compliance, end-to-end encryption, and advanced fraud protection that exceeds industry standards."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "99.9% uptime SLA with sub-second payment processing and real-time settlement capabilities."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Accept payments in 135+ currencies from customers in 190+ countries with competitive FX rates."
    },
    {
      icon: CreditCard,
      title: "All Payment Methods",
      description: "Cards, bank transfers, digital wallets, buy-now-pay-later, and emerging payment methods."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time dashboards, detailed reporting, and AI-powered insights to optimize your revenue."
    },
    {
      icon: Smartphone,
      title: "Mobile-First",
      description: "Optimized for mobile payments with responsive design and native mobile SDKs."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden" id="benefits">
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
              Why Choose Paybord
            </div>
            <h2 className="text-4xl font-bold font-['Space_Grotesk'] text-white sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight">
              Built for the future of{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                payments
              </span>
            </h2>
            <p className="mt-8 max-w-3xl mx-auto text-xl text-gray-300 leading-relaxed">
              Join thousands of businesses that trust Paybord to process billions in payments with unmatched reliability and security.
            </p>
          </motion.div>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="group bg-white/5 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white/10 hover:border-emerald-500/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center mb-6 transition-colors duration-300 border border-emerald-500/20">
                  <benefit.icon className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
          {/* Stats Section */}
          <motion.div
            className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 pt-16 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">$50B+</div>
              <div className="text-gray-300">Processed Annually</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">99.9%</div>
              <div className="text-gray-300">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">10K+</div>
              <div className="text-gray-300">Active Merchants</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">135+</div>
              <div className="text-gray-300">Currencies Supported</div>
            </div>
          </motion.div>
          {/* Enterprise Features */}
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-white mb-8">Enterprise-grade infrastructure</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Database, title: "High Availability", description: "Multi-region deployment with automatic failover" },
                { icon: Cpu, title: "AI-Powered", description: "Machine learning for fraud detection and optimization" },
                { icon: Network, title: "Global Network", description: "Edge computing for sub-100ms response times" }
              ].map((feature, index) => (
                <div key={feature.title} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                    <feature.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default BenefitsSection;
