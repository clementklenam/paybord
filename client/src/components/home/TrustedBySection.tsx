import React from 'react';
import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { SiAirbnb, SiSlack, SiNetflix, SiAmazon, SiShopify } from "react-icons/si";

function TrustedBySection() {
  const logos = [
    { icon: SiAirbnb, name: "AfriTech" },
    { icon: SiSlack, name: "PayConnect" },
    { icon: SiNetflix, name: "SavannaShop" },
    { icon: SiAmazon, name: "AfriWallet" },
    { icon: SiShopify, name: "NairaPlus" },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-950 to-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-base font-semibold text-emerald-300 uppercase tracking-wider mb-12">
            Trusted by leading African businesses
          </p>
        </motion.div>
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
          {logos.map((logo, index) => (
            <motion.div
              key={index}
              className="col-span-1 flex justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="h-12 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center group">
                <logo.icon className="h-8 w-auto text-emerald-400 group-hover:text-white" />
                <span className="ml-3 font-semibold text-emerald-300 group-hover:text-white">{logo.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default TrustedBySection;
