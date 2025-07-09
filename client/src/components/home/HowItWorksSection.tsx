import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { 
  UserPlus, 
  Store, 
  CreditCard, 
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up in 30 seconds. No credit card required to get started.",
    features: ["Free forever plan", "No setup fees", "Instant activation"],
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-500/10 to-teal-500/10"
  },
  {
    icon: Store,
    title: "Build Your Store",
    description: "Create beautiful storefronts or generate payment links in minutes.",
    features: ["Drag & drop builder", "Custom branding", "Mobile optimized"],
    gradient: "from-teal-500 to-emerald-500",
    bgGradient: "from-teal-500/10 to-emerald-500/10"
  },
  {
    icon: CreditCard,
    title: "Start Selling",
    description: "Accept payments globally with support for 100+ payment methods.",
    features: ["Global payments", "Multiple currencies", "Instant processing"],
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-500/10 to-teal-500/10"
  },
  {
    icon: TrendingUp,
    title: "Scale & Grow",
    description: "Track performance and optimize your business with advanced analytics.",
    features: ["Real-time insights", "Customer analytics", "Growth tools"],
    gradient: "from-teal-500 to-emerald-500",
    bgGradient: "from-teal-500/10 to-emerald-500/10"
  }
];

const benefits = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Setup in minutes, not days. Start accepting payments instantly."
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "PCI DSS compliant with enterprise-grade security protocols."
  },
  {
    icon: CheckCircle,
    title: "Zero Hidden Fees",
    description: "Transparent pricing with no setup fees or hidden charges."
  }
];

export function HowItWorksSection() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      <Container>
        <div className="relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Get Started in
              <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Just 4 Simple Steps
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From signup to your first sale in under 5 minutes. No complex setup, no technical knowledge required.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-20">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-emerald-500/20 transition-all duration-300 h-full">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.bgGradient} rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20`}>
                    <step.icon className={`w-8 h-8 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{step.description}</p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow (except for last step) */}
                {index < steps.length - 1 && (
                  <div className="hidden xl:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                  <benefit.icon className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl p-12 border border-emerald-500/20 backdrop-blur-sm">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of entrepreneurs who've transformed their businesses with Paybord.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/25">
                  Create Free Account
                </button>
                <button className="border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 px-8 py-4 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm">
                  Watch Demo Video
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
