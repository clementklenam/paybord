import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link as WouterLink } from "wouter";

const navigation = [
  { name: "Home", href: "#" },
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "API Docs", href: "#api" },
  { name: "Contact", href: "#contact" }
];

const solutions = [
  {
    name: "E-commerce",
    description: "Complete online store solution",
    href: "#",
    icon: "🛒"
  },
  {
    name: "Payment Links",
    description: "Generate viral payment links",
    href: "#",
    icon: "🔗"
  },
  {
    name: "Global Payments",
    description: "Accept payments worldwide",
    href: "#",
    icon: "🌍"
  },
  {
    name: "Analytics",
    description: "Advanced business insights",
    href: "#",
    icon: "📊"
  }
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg" 
        : "bg-transparent"
    }`}>
      <Container>
        <nav className="flex items-center justify-between py-4" aria-label="Global">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <WouterLink to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Paybord</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold text-white">P</span>
                </div>
                <span className={`text-2xl font-bold ${scrolled ? 'text-black' : 'text-black'}`}>
                  Paybord
                </span>
              </div>
            </WouterLink>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-600"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <WouterLink 
                key={item.name} 
                to={item.href} 
                className={`text-sm font-medium transition-colors duration-200 ${
                  scrolled 
                    ? 'text-gray-700 hover:text-black' 
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                {item.name}
              </WouterLink>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <WouterLink to="/signup">
              <Button className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
                scrolled 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}>
                Get Started
              </Button>
            </WouterLink>
          </div>
        </nav>
      </Container>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden"
          >
            <div className="fixed inset-0 z-50" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white/95 backdrop-blur-xl px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-200"
            >
              <div className="flex items-center justify-between">
                <WouterLink to="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Paybord</span>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-black to-gray-600 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-white">P</span>
                    </div>
                    <span className="text-xl font-bold text-black">Paybord</span>
                  </div>
                </WouterLink>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-200">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <WouterLink
                        key={item.name}
                        to={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-colors duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </WouterLink>
                    ))}
                  </div>
                  <div className="py-6">
                    <WouterLink to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-black text-white hover:bg-gray-800 px-6 py-3 text-base font-semibold rounded-full transition-all duration-300">
                        Get Started
                      </Button>
                    </WouterLink>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}