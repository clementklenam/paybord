import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { IntegrateIcon } from "@/assets/svgs/IntegrateIcon";
import { PaymentsIcon } from "@/assets/svgs/PaymentsIcon";
import { PayoutsIcon } from "@/assets/svgs/PayoutsIcon";

export function HowItWorksSection() {
  const steps = [
    {
      id: 1,
      title: "Integrate with Paymesa",
      description: "Add our SDK to your website or mobile app with just a few lines of code. No complicated setup required.",
      icon: IntegrateIcon,
    },
    {
      id: 2,
      title: "Accept Payments Instantly",
      description: "Process payments from Mobile Money, credit cards, and bank transfers across all African countries.",
      icon: PaymentsIcon,
    },
    {
      id: 3,
      title: "Get Payouts Anywhere",
      description: "Receive your funds in any supported African currency with fast settlement times and low fees.",
      icon: PayoutsIcon,
    },
  ];

  return (
    <section className="py-20 bg-white" id="how-it-works">
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold font-['Space_Grotesk'] text-gray-900 sm:text-4xl">
            How Paymesa Works
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
            Streamlined payment processing across Africa in three simple steps
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 grid-cols-1 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#6C2BFB] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                {step.id}
              </div>
              <div className="pt-4">
                <div className="flex justify-center mb-6 h-40">
                  <step.icon />
                </div>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
