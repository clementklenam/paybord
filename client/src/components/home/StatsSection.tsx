import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { TrendingUp, Users, Globe, Shield } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      name: "Transaction Volume",
      value: "$2.5B+",
      description: "Processed annually",
      icon: TrendingUp,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      name: "Active Merchants",
      value: "50K+",
      description: "Across Africa",
      icon: Users,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      name: "Countries",
      value: "15+",
      description: "And expanding",
      icon: Globe,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      name: "Success Rate",
      value: "99.9%",
      description: "Transaction success",
      icon: Shield,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 to-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <Container>
        <div className="relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold font-['Space_Grotesk'] text-white sm:text-5xl">
              Trusted by leading African businesses
            </h2>
            <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of businesses using Paybord to power their payments
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                className="relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white/10 hover:shadow-lg hover:border-emerald-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-2xl" />
                
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-6 border border-emerald-500/20`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                
                <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">{stat.value}</p>
                <h3 className="text-lg font-semibold text-white mb-2">{stat.name}</h3>
                <p className="text-gray-300">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
} 