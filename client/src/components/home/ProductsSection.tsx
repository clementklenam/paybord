import {Container} from "@/components/ui/container";
import {motion} from "framer-motion";
import {Store, Link, Globe, BarChart3, Smartphone, Zap, Sparkles, Rocket} from "lucide-react";

function ProductsSection() {
  const products = [
    {
      title: "Viral Storefronts",
      description: "Create Instagram-worthy storefronts that convert. Drag & drop builder with mobile-first design. Perfect for digital products, services, and dropshipping.",
      icon: Store,
      badge: "Most Popular",
      badgeColor: "bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20",
      gradient: "from-[#FFD700]/20 to-[#FFC700]/10",
      iconGradient: "from-[#FFD700] to-[#FFC700]",
    },
    {
      title: "Payment Links That Convert",
      description: "Generate payment links that go viral. Share on TikTok, Instagram, Twitter. Perfect for creators, freelancers, and anyone who wants to get paid instantly.",
      icon: Link,
      badge: "Gen Z Favorite",
      badgeColor: "bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20",
      gradient: "from-[#FFD700]/20 to-[#FFC700]/10",
      iconGradient: "from-[#FFD700] to-[#FFC700]",
    },
    {
      title: "Global Currency Empire",
      description: "Accept payments in 100+ currencies automatically. Your customers pay in their local currency, you get paid in yours. No more currency confusion.",
      icon: Globe,
      gradient: "from-[#FFD700]/20 to-[#FFC700]/10",
      iconGradient: "from-[#FFD700] to-[#FFC700]",
    },
    {
      title: "Real-Time Empire Analytics",
      description: "Track your empire's growth in real-time. See what's working, what's not, and scale what matters. Data-driven decisions for the win.",
      icon: BarChart3,
      gradient: "from-[#FFD700]/20 to-[#FFC700]/10",
      iconGradient: "from-[#FFD700] to-[#FFC700]",
    },
    {
      title: "Mobile-First Empire",
      description: "80% of Gen Z shops on mobile. Your storefronts look perfect on every device. No more lost sales due to poor mobile experience.",
      icon: Smartphone,
      gradient: "from-[#FFD700]/20 to-[#FFC700]/10",
      iconGradient: "from-[#FFD700] to-[#FFC700]",
    },
    {
      title: "Instant Empire Payouts",
      description: "Get paid instantly. No waiting for bank transfers. Your money is available immediately so you can reinvest and scale faster.",
      icon: Zap,
      badge: "New",
      badgeColor: "bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20",
      gradient: "from-[#FFD700]/20 to-[#FFC700]/10",
      iconGradient: "from-[#FFD700] to-[#FFC700]",
    },
  ];

  return (
    <section className="py-24 bg-[#2a2a2a] relative overflow-hidden" id="products">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFC700]/10 rounded-full blur-3xl"></div>
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
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#FFD700]/10 text-[#FFD700] font-medium text-sm mb-8 border border-[#FFD700]/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-2 animate-pulse text-[#FFD700]" />
              Built for Empire Builders
            </div>
            <h2 className="text-4xl font-bold font-['Space_Grotesk'] text-white sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-[#FFD700] to-[#FFC700] bg-clip-text text-transparent">
                build your empire
              </span>
            </h2>
            <p className="mt-8 max-w-3xl mx-auto text-xl text-gray-300 leading-relaxed">
              From side hustles to full-time empires. Our platform gives you the tools to turn your passion into profit. 
              <span className="text-[#FFD700] font-semibold"> No technical skills required.</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product, index) => (
              <motion.div
                key={product.title}
                className={`group rounded-2xl shadow-lg border border-white/10 bg-gradient-to-br ${product.gradient} p-8 hover:scale-105 transition-all duration-300 backdrop-blur-sm`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${product.iconGradient} shadow-md`}>
                    <product.icon className="h-7 w-7 text-white" />
                  </div>
                  {product.badge && (
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${product.badgeColor}`}>{product.badge}</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{product.title}</h3>
                <p className="text-gray-300 mb-6">{product.description}</p>
                <div className={`px-8 py-6 bg-emerald-500/5 group-hover:scale-105 transition-all duration-300 border-t border-emerald-500/10 rounded-b-2xl`}> 
                  <a href="#" className="text-emerald-300 hover:text-white font-semibold flex items-center justify-between group/link">
                    <span>Learn more</span>
                    <Rocket className="h-5 w-5 group-hover/link:translate-x-1 transition-transform duration-200" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-white mb-12">Empire builders trust Paybord</h3>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default ProductsSection; 