import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { Link2, Box, Terminal, CreditCard, FileText } from "lucide-react";

export function ProductsSection() {
  const products = [
    {
      title: "PaymesaLinks",
      description:
        "Create instant payment links to accept payments without writing any code. Perfect for social media sellers and small businesses.",
      icon: Link2,
      badge: "Popular",
      badgeColor: "bg-[#0FCEA6]/10 text-[#0FCEA6]",
    },
    {
      title: "PaymesaConnect",
      description:
        "Unified API for Mobile Money, Card, and Bank Transfer payments across all African countries. One integration, any payment method.",
      icon: Box,
    },
    {
      title: "PaymesaPOS",
      description:
        "Point-of-sale solution for physical stores and retailers. Accept payments in person with our mobile POS app and card readers.",
      icon: Terminal,
    },
    {
      title: "PaymesaCash",
      description:
        "Financial management platform for businesses. Manage payouts, track revenues, and reconcile transactions in one dashboard.",
      icon: CreditCard,
    },
    {
      title: "PaymesaTax",
      description:
        "Automated tax calculation and compliance for cross-border payments. Stay compliant with local tax regulations across Africa.",
      icon: FileText,
      badge: "New",
      badgeColor: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <section className="py-20 bg-white" id="products">
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold font-['Space_Grotesk'] text-gray-900 sm:text-4xl">
            Products
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
            A comprehensive suite of payment solutions for businesses across Africa
          </p>
        </motion.div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden border border-gray-100 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#6C2BFB]/10 flex items-center justify-center">
                    <product.icon className="h-6 w-6 text-[#6C2BFB]" />
                  </div>
                  {product.badge && (
                    <div className={`text-xs font-medium py-1 px-2 rounded-full uppercase ${product.badgeColor}`}>
                      {product.badge}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-gray-900 mb-3">{product.title}</h3>
                <p className="text-gray-500 mb-4">{product.description}</p>
              </div>
              <div className="px-6 py-4 bg-gray-50 group-hover:bg-gray-100 transition duration-300">
                <a href="#" className="text-[#6C2BFB] hover:text-[#5921c9] font-medium flex items-center justify-between">
                  <span>Learn more</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
