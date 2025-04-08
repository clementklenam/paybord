import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TestimonialSection() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <motion.div
          className="bg-[#6C2BFB] rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative px-6 py-16 sm:px-10 sm:py-20 lg:py-24 lg:px-16">
            <div className="relative max-w-3xl mx-auto">
              <svg
                className="absolute left-0 top-0 transform -translate-x-8 -translate-y-12 h-16 w-16 text-[#9d76f7] opacity-50"
                fill="currentColor"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <blockquote className="relative text-white">
                <div className="text-xl font-medium">
                  "OthoPay has transformed how we process payments at SavannaShop. Their unified API saved us months of development 
                  time, and we now accept payments from customers across multiple African countries seamlessly. The settlement 
                  times are fast, and their team provides excellent support."
                </div>
                <footer className="mt-8">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 border-2 border-white/20">
                      <AvatarImage src="https://randomuser.me/api/portraits/women/17.jpg" alt="Amina Nkosi" />
                      <AvatarFallback>AN</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <div className="text-base font-semibold">Amina Nkosi</div>
                      <div className="text-[#cebafb]">CTO at SavannaShop</div>
                    </div>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
