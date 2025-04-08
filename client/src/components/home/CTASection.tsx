import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-gray-50">
      <Container>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold font-['Space_Grotesk'] text-gray-900 sm:text-4xl lg:text-5xl">
            Build your business with Paymesa
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Join hundreds of businesses across Africa using Paymesa to power their payments infrastructure.
          </p>
          <motion.div 
            className="mt-10 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mx-auto">
              <Button className="py-6 px-8 bg-[#6C2BFB] hover:bg-[#5921c9] text-white text-lg font-semibold rounded-md shadow-md transition duration-300 inline-flex items-center">
                Get Started for Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
