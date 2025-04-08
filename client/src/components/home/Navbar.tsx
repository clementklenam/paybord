import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { africanColors } from "@/lib/african-colors";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100">
      <Container>
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div 
                className="h-8 w-auto text-3xl font-medium font-['Space_Grotesk'] px-2 py-1 rounded" 
                style={{ background: africanColors.black, color: africanColors.yellow }}
              >
                Paymesa
              </div>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <a
                href="#products"
                className="border-transparent text-gray-700 hover:text-[#E42D22] inline-flex items-center px-1 pt-1 text-sm font-medium transition duration-200 border-b-2 border-transparent hover:border-[#E42D22]"
              >
                Products
              </a>
              <a
                href="#developers"
                className="border-transparent text-gray-700 hover:text-[#00853F] inline-flex items-center px-1 pt-1 text-sm font-medium transition duration-200 border-b-2 border-transparent hover:border-[#00853F]"
              >
                Developers
              </a>
              <a
                href="#benefits"
                className="border-transparent text-gray-700 hover:text-[#E42D22] inline-flex items-center px-1 pt-1 text-sm font-medium transition duration-200 border-b-2 border-transparent hover:border-[#E42D22]"
              >
                Why Paymesa
              </a>
              <a
                href="#"
                className="border-transparent text-gray-700 hover:text-[#FECB00] inline-flex items-center px-1 pt-1 text-sm font-medium transition duration-200 border-b-2 border-transparent hover:border-[#FECB00]"
              >
                Pricing
              </a>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <a
              href="#"
              className="text-gray-700 hover:text-[#E42D22] px-3 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              Sign in
            </a>
            <Button 
              className="text-white" 
              style={{ background: africanColors.red }}
            >
              Start now
            </Button>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#E42D22]"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </Button>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden bg-white"
          >
            <div className="pt-2 pb-4 space-y-1">
              <a
                href="#products"
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                style={{ 
                  borderColor: africanColors.red,
                  color: africanColors.black,
                  backgroundColor: 'rgba(228, 45, 34, 0.05)'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </a>
              <a
                href="#developers"
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                style={{ 
                  borderColor: africanColors.green,
                  color: africanColors.black,
                  backgroundColor: 'rgba(0, 133, 63, 0.05)'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Developers
              </a>
              <a
                href="#benefits"
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                style={{ 
                  borderColor: africanColors.yellow,
                  color: africanColors.black,
                  backgroundColor: 'rgba(254, 203, 0, 0.05)'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Why Paymesa
              </a>
              <a
                href="#"
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                style={{ 
                  borderColor: africanColors.black,
                  color: africanColors.black,
                  backgroundColor: 'rgba(0, 0, 0, 0.05)'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <a
                    href="#"
                    className="block text-base font-medium"
                    style={{ color: africanColors.red }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </a>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Button 
                    className="w-full text-white" 
                    style={{ background: africanColors.black }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Start now
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}