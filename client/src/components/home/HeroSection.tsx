import {Container} from "@/components/ui/container";
import {Button} from "@/components/ui/button";
import {motion} from "framer-motion";
import {ChevronDown, ArrowRight} from "lucide-react";
import {Link as WouterLink} from "wouter";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#1a1a1a] overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]"></div>

      {/* Right side background - muted teal/greenish-blue */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-br from-[#2d5a5a] via-[#3a6b6b] to-[#2d5a5a] opacity-20"></div>

            <Container>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            {/* New Tag and Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="bg-[#8B7355] text-white px-3 py-1 rounded-full text-sm font-medium">New</span>
              <span className="text-white text-sm">Try our easy Payment Builder →</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
            >
              THE EASY WAY
              <br />
              TO GET PAID
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed"
            >
              Collect instant, one-off payments. Or automated recurring payments. Without the chasing, stress or expensive fees.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <WouterLink to="/signup">
                <Button className="group bg-[#FFD700] text-black hover:bg-[#FFC700] px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 shadow-lg hover:scale-105">
                  <span>Sign up</span>
                </Button>
              </WouterLink>
              <WouterLink to="/contact">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300">
                  <span>Contact Sales</span>
                </Button>
              </WouterLink>
            </motion.div>
          </motion.div>

          {/* Right Side - Payment Methods Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative flex items-center justify-center"
          >
            {/* Image Container */}
            <div className="relative w-[500px] h-[500px] rounded-3xl shadow-2xl overflow-hidden">
              <img 
                src="/src/img/istockphoto-1214692731-612x612.jpg" 
                alt="Business payment solutions" 
                className="w-full h-full object-cover"
              />
              
              {/* Subtle overlay for better integration */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5"></div>
              
              {/* Brand accent elements */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-[#FFD700] rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-[#FFC700] rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </motion.div>
        </div>
      </Container>


    </section>
  );
} 