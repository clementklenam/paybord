import {Container} from "@/components/ui/container";
import {motion} from "framer-motion";
import {Zap, Globe, Code, BarChart3} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Settlements",
    description: "Get your money in your account within seconds, not days. Real-time settlement processing for immediate cash flow.",
    gradient: "from-white to-gray-300"
  },
  {
    icon: Globe,
    title: "Multi-Currency Support",
    description: "Accept payments in 150+ currencies worldwide. Automatic currency conversion and local payment methods.",
    gradient: "from-gray-300 to-white"
  },
  {
    icon: Code,
    title: "Developer-Friendly API",
    description: "RESTful APIs with comprehensive documentation, SDKs, and webhooks. Integrate payments in minutes, not weeks.",
    gradient: "from-white to-gray-300"
  },
  {
    icon: BarChart3,
    title: "Business Insights Dashboard",
    description: "Real-time analytics, transaction monitoring, and business intelligence to optimize your payment operations.",
    gradient: "from-gray-300 to-white"
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-black to-gray-900">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8">
            Everything You Need to
            <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Scale Your Business
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Powerful features designed to help you grow, manage, and optimize your payment operations with enterprise-grade reliability.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 h-full">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-white font-semibold text-xl mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">10K+</div>
            <div className="text-gray-400">Active Businesses</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-gray-300 mb-2">150+</div>
            <div className="text-gray-400">Countries Supported</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">99.9%</div>
            <div className="text-gray-400">Uptime Guarantee</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-gray-300 mb-2">24/7</div>
            <div className="text-gray-400">Customer Support</div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
} 