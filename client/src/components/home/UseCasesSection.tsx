import {Container} from "@/components/ui/container";
import {motion} from "framer-motion";
import {CheckCircle, ArrowRight} from "lucide-react";
import {Button} from "@/components/ui/button";

const useCases = [
  "E-commerce platforms processing millions of transactions",
  "SaaS companies with recurring billing needs",
  "Marketplaces connecting buyers and sellers globally",
  "Fintech startups building innovative payment solutions"
];

export function UseCasesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              Trusted by Businesses
              <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Worldwide
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              From startups to enterprises, businesses choose Paybord for reliable, scalable payment infrastructure that grows with their needs.
            </p>

            <div className="space-y-4 mb-8">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-gray-300">{useCase}</span>
                </motion.div>
              ))}
            </div>

            <Button className="group bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-white/25 hover:scale-105">
              <span>Explore Use Cases</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Right: Animated Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl">
              {/* Mockup Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-300 rounded-xl flex items-center justify-center">
                    <span className="text-xl font-bold text-black">P</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Paybord Dashboard</h3>
                    <p className="text-gray-400 text-sm">Live Analytics</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-medium">Online</span>
                </div>
              </div>

              {/* Mockup Content */}
              <div className="space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/5 rounded-2xl p-6 border border-white/10"
                  >
                    <div className="text-2xl font-bold text-white mb-1">$2.4M</div>
                    <div className="text-gray-400 text-sm">Monthly Volume</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/5 rounded-2xl p-6 border border-white/10"
                  >
                    <div className="text-2xl font-bold text-white mb-1">12.5K</div>
                    <div className="text-gray-400 text-sm">Transactions</div>
                  </motion.div>
                </div>

                {/* Chart Placeholder */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-semibold">Revenue Trend</span>
                    <span className="text-gray-400 text-sm">Last 30 days</span>
                  </div>
                  <div className="h-32 bg-gradient-to-r from-white/10 to-white/5 rounded-lg flex items-end justify-between p-4">
                    {[20, 35, 25, 45, 30, 55, 40].map((height, index) => (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="w-8 bg-white rounded-t-sm"
                      />
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-3">
                  <h4 className="text-white font-semibold">Recent Transactions</h4>
                  <div className="space-y-2">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <div>
                          <div className="text-white font-medium">Premium Plan</div>
                          <div className="text-gray-400 text-sm">2 minutes ago</div>
                        </div>
                      </div>
                      <div className="text-white font-semibold">$149.99</div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <div>
                          <div className="text-white font-medium">Global Payment</div>
                          <div className="text-gray-400 text-sm">5 minutes ago</div>
                        </div>
                      </div>
                      <div className="text-white font-semibold">€79.99</div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-4 -right-4 bg-white text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Live
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
} 