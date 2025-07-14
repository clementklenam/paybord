import React from 'react';
import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function TestimonialSection() {
  return (
    <section className="py-24 bg-[var(--background)]">
      <Container>
        <motion.div
          className="bg-[var(--primary)] rounded-3xl shadow-xl overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative px-8 py-20 sm:px-12 lg:px-20">
            <div className="relative max-w-3xl mx-auto">
              <svg
                className="absolute left-0 top-0 transform -translate-x-8 -translate-y-12 h-16 w-16 text-[var(--accent)] opacity-50"
                fill="currentColor"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <blockquote className="relative text-[var(--background)]">
                <div className="text-2xl font-medium leading-relaxed">
                  "PayMesa has transformed how we process payments at SavannaShop. Their unified API saved us months of development 
                  time, and we now accept payments from customers across multiple African countries seamlessly. The settlement 
                  times are fast, and their team provides excellent support."
                </div>
                <footer className="mt-10">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 border-2 border-[var(--background)]/20">
                      <AvatarImage src="https://randomuser.me/api/portraits/women/17.jpg" alt="Amina Nkosi" />
                      <AvatarFallback>AN</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <div className="text-lg font-semibold text-[var(--background)]">Amina Nkosi</div>
                      <div className="text-[var(--background)]/80">CTO at SavannaShop</div>
                    </div>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>

          {/* Modern background elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl transform -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[var(--background)]/5 rounded-full blur-3xl"></div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

export default TestimonialSection;
