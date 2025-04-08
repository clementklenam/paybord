import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PaymentNetworkIllustration } from "@/assets/svgs/PaymentNetworkIllustration";
import { ArrowRight } from "lucide-react";
import { africanColors } from "@/lib/african-colors";

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
            <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ background: `rgba(254, 203, 0, 0.15)`, color: africanColors.black }}>
              <span className="flex h-2 w-2 rounded-full mr-2" style={{ background: africanColors.yellow }}></span>
              Africa's Unified Payment Platform
            </div>
            <h1 className="text-4xl tracking-tight font-bold font-['Space_Grotesk'] text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span className="block">One API for</span>
              <span className="block bg-clip-text text-transparent" 
                style={{ 
                  backgroundImage: `linear-gradient(to right, ${africanColors.red}, ${africanColors.green})`
                }}>
                African Payments
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-700 sm:text-xl max-w-3xl">
              Connect global payment systems to African markets seamlessly. Accept payments from Mobile Money, Cards, Bank Transfers, and Crypto across the continent.
            </p>
            <div className="mt-8 sm:flex">
              <div className="rounded-md shadow">
                <Button 
                  className="w-full group flex items-center justify-center gap-2 px-8 py-3 md:py-4 md:text-lg md:px-10 text-white hover:bg-[#333333]"
                  style={{ 
                    background: africanColors.black
                  }}
                >
                  Start now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center px-8 py-3 md:py-4 md:text-lg md:px-10 border-2 hover:bg-green-50"
                  style={{ 
                    borderColor: africanColors.green,
                    color: africanColors.green
                  }}
                >
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
      
      {/* Background decorative blobs with African colors */}
      <div className="hidden sm:block absolute top-1/3 right-0 -z-10 transform translate-x-1/3 blur-3xl">
        <div className="w-[30rem] h-[30rem] rounded-full" style={{ background: `rgba(228, 45, 34, 0.15)` }}></div>
      </div>
      <div className="hidden sm:block absolute bottom-1/3 left-0 -z-10 transform -translate-x-1/3 blur-3xl">
        <div className="w-[35rem] h-[35rem] rounded-full" style={{ background: `rgba(0, 133, 63, 0.1)` }}></div>
      </div>
      <div className="hidden sm:block absolute top-2/3 right-1/4 -z-10 blur-3xl">
        <div className="w-[25rem] h-[25rem] rounded-full" style={{ background: `rgba(254, 203, 0, 0.1)` }}></div>
      </div>
    </section>
  );
}
