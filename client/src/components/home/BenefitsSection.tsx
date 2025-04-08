import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { Layers, Shield, Zap, Globe } from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    {
      title: "Unified API",
      description:
        "One integration for all payment methods across Africa. No need for multiple providers or complex integrations.",
      icon: Layers,
    },
    {
      title: "Fraud Protection",
      description:
        "Advanced fraud detection systems to protect you and your customers from fraudulent transactions.",
      icon: Shield,
    },
    {
      title: "Fast Settlement",
      description:
        "Get your funds quickly with settlements as fast as T+1 for most payment methods across all supported countries.",
      icon: Zap,
    },
    {
      title: "Cross-border Ready",
      description:
        "Accept and disburse payments in multiple currencies across African countries with competitive FX rates.",
      icon: Globe,
    },
  ];

  return (
    <section className="py-20 bg-gray-50" id="benefits">
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold font-['Space_Grotesk'] text-gray-900 sm:text-4xl">
            Why OthoPay
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
            Leading businesses across Africa trust OthoPay for their payment needs
          </p>
        </motion.div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-full bg-[#6C2BFB]/10 flex items-center justify-center mb-4">
                <benefit.icon className="h-6 w-6 text-[#6C2BFB]" />
              </div>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-500">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
