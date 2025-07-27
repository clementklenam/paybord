import {Container} from "@/components/ui/container";
import {motion} from "framer-motion";
import {Zap, Globe, Code, BarChart3, ArrowRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Link as WouterLink} from "wouter";
import {useEffect, useState} from "react";

const features = [
  {
    icon: Zap,
    title: "Setup in 5 Minutes",
    description: "Create your account, add your business details, and start accepting payments immediately. No waiting, no approval delays.",
    gradient: "from-white to-gray-300"
  },
  {
    icon: Globe,
    title: "Accept All Payment Methods",
    description: "Credit cards, digital wallets, bank transfers, and local payment methods. Your customers pay how they want to pay.",
    gradient: "from-gray-300 to-white"
  },
  {
    icon: Code,
    title: "No Technical Skills Required",
    description: "Drag-and-drop tools, pre-built templates, and simple integrations. Get online without hiring developers.",
    gradient: "from-white to-gray-300"
  },
  {
    icon: BarChart3,
    title: "Get Paid Instantly",
    description: "Receive payments directly to your bank account within seconds. No more waiting for checks or bank transfers.",
    gradient: "from-gray-300 to-white"
  }
];

export function FeaturesSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    { id: 1, label: "Step 1: Add your first product", image: "/src/img/slide1.jpg" },
    { id: 2, label: "Step 2: Customize your store", image: "/src/img/slide2.jpg" },
    { id: 3, label: "Step 3: Set up payments", image: "/src/img/slide3.jpg" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section id="features" className="py-24 bg-[#1a1a1a]">
      
      <Container>
        {/* Hero Section with Split Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-6xl font-bold text-white leading-tight"
            >
              It's easy to start selling
            </motion.h2>

            {/* Steps */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-bold text-sm">1</div>
                <span className="text-xl text-white">Add your first product</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-bold text-sm">2</div>
                <span className="text-xl text-white">Customize your store</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-bold text-sm">3</div>
                <span className="text-xl text-white">Set up payments</span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300 leading-relaxed"
            >
              Stop losing sales to complicated payment setups. Get your business accepting payments in minutes with our simple, powerful tools.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <WouterLink to="/signup">
                <Button className="group bg-[#FFD700] text-black hover:bg-[#FFC700] px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-[#FFD700]/25 hover:scale-105">
                  <span>Start Accepting Payments</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </WouterLink>
            </motion.div>
          </motion.div>

          {/* Right Visual - Slideshow */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full h-96 rounded-3xl shadow-2xl overflow-hidden">
              {/* Slideshow Images */}
              <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                  <img 
                    key={slide.id}
                    src={slide.image} 
                    alt={slide.label} 
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
              </div>
              
              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
              
              {/* Slide Indicators */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-[#FFD700] opacity-100' : 'bg-white/50 opacity-50'
                    }`}
                  />
                ))}
              </div>
              
              {/* Step Labels */}
              <div className="absolute top-6 left-6">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-white font-semibold">{slides[currentSlide].label}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-3xl font-bold text-white mb-4">Why Choose Paybord?</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to get started, nothing you don't.</p>
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
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#FFD700]/30 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-[#FFD700] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-white font-semibold text-xl mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFC700]/10 rounded-3xl p-12 border border-[#FFD700]/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#FFD700] mb-2">5 Min</div>
                <div className="text-gray-400">Average Setup Time</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">50+</div>
                <div className="text-gray-400">Payment Methods</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#FFD700] mb-2">Instant</div>
                <div className="text-gray-400">Payment Processing</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">0%</div>
                <div className="text-gray-400">Technical Skills Required</div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
} 