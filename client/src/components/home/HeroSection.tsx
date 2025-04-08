import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PaymentNetworkIllustration } from "@/assets/svgs/PaymentNetworkIllustration";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden">
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <motion.div 
            className="lg:col-span-6 flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              <span className="flex h-2 w-2 rounded-full bg-purple-600 mr-2"></span>
              Africa's Unified Payment Platform
            </div>
            <h1 className="text-4xl tracking-tight font-bold font-['Space_Grotesk'] text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span className="block">One API for</span>
              <span className="block bg-gradient-to-r from-[#6C2BFB] to-[#0FCEA6] bg-clip-text text-transparent">
                African Payments
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-500 sm:text-xl max-w-3xl">
              Connect global payment systems to African markets seamlessly. Accept payments from Mobile Money, Cards, Bank Transfers, and Crypto across the continent.
            </p>
            <div className="mt-8 sm:flex">
              <div className="rounded-md shadow">
                <Button className="w-full group flex items-center justify-center gap-2 px-8 py-3 md:py-4 md:text-lg md:px-10 bg-[#6C2BFB] hover:bg-[#5921c9]">
                  Start now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 md:py-4 md:text-lg md:px-10 text-[#6C2BFB] border-gray-200 hover:bg-purple-50">
                  See the Docs
                </Button>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="mt-12 lg:mt-0 lg:col-span-6 relative h-[450px] lg:h-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <PaymentNetworkIllustration />
            </div>
          </motion.div>
        </div>
      </Container>
      
      {/* Background decorative blobs with lighter colors and more transparency */}
      <div className="hidden sm:block absolute top-1/3 right-0 -z-10 transform translate-x-1/3 blur-3xl">
        <div className="w-[30rem] h-[30rem] rounded-full bg-purple-100/30"></div>
      </div>
      <div className="hidden sm:block absolute bottom-1/3 left-0 -z-10 transform -translate-x-1/3 blur-3xl">
        <div className="w-[35rem] h-[35rem] rounded-full bg-teal-100/20"></div>
      </div>
      <div className="hidden sm:block absolute top-2/3 right-1/4 -z-10 blur-3xl">
        <div className="w-[25rem] h-[25rem] rounded-full bg-indigo-100/20"></div>
      </div>
    </section>
  );
}