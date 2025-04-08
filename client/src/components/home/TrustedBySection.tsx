import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { SiAirbnb, SiSlack, SiNetflix, SiAmazon, SiShopify } from "react-icons/si";

export function TrustedBySection() {
  const logos = [
    { icon: SiAirbnb, name: "AfriTech" },
    { icon: SiSlack, name: "PayConnect" },
    { icon: SiNetflix, name: "SavannaShop" },
    { icon: SiAmazon, name: "AfriWallet" },
    { icon: SiShopify, name: "NairaPlus" },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <Container>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-base font-semibold text-[#6C2BFB] uppercase tracking-wider mb-8">
            Trusted by leading African businesses
          </p>
        </motion.div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {logos.map((logo, index) => (
            <motion.div
              key={index}
              className="col-span-1 flex justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="h-12 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <logo.icon className="h-8 w-auto text-gray-500" />
                <span className="ml-2 font-semibold text-gray-500">{logo.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
