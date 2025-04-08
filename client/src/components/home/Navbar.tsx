import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100">
      <Container>
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-auto text-3xl font-medium text-[#6C2BFB] font-['Space_Grotesk']">
                Paymesa
              </div>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <a
                href="#products"
                className="border-transparent text-gray-600 hover:text-[#6C2BFB] inline-flex items-center px-1 pt-1 text-sm font-medium transition duration-200"
              >
                Products
              </a>
              <a
                href="#developers"
                className="border-transparent text-gray-600 hover:text-[#6C2BFB] inline-flex items-center px-1 pt-1 text-sm font-medium transition duration-200"
              >
                Developers
              </a>
              <a
                href="#benefits"
                className="border-transparent text-gray-600 hover:text-[#6C2BFB] inline-flex items-center px-1 pt-1 text-sm font-medium transition duration-200"
              >
                Why Paymesa
              </a>
              <a
                href="#"
                className="border-transparent text-gray-600 hover:text-[#6C2BFB] inline-flex items-center px-1 pt-1 text-sm font-medium transition duration-200"
              >
                Pricing
              </a>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <a
              href="#"
              className="text-gray-600 hover:text-[#6C2BFB] px-3 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              Sign in
            </a>
            <Button className="bg-[#6C2BFB] hover:bg-[#5921c9]">Start now</Button>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#6C2BFB]"
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
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </a>
              <a
                href="#developers"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Developers
              </a>
              <a
                href="#benefits"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Why Paymesa
              </a>
              <a
                href="#"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <a
                    href="#"
                    className="block text-base font-medium text-gray-600 hover:text-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </a>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Button className="w-full bg-[#6C2BFB] hover:bg-[#5921c9]" onClick={() => setMobileMenuOpen(false)}>
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