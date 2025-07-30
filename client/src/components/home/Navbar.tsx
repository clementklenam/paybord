import { useState, useEffect } from "react";
import {Container} from "@/components/ui/container";
import {Button} from "@/components/ui/button";
import {motion, AnimatePresence} from "framer-motion";
import {Menu, X} from "lucide-react";
import {Link as WouterLink} from "wouter";

function Navbar() {
  const navigation = [
    { name: "Why Paybord?", href: "#" },
    { name: "Product", href: "#" },
    { name: "Partners", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Learn", href: "#" }
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        ? "bg-[#1a1a1a]/95 backdrop-blur-xl border-b border-gray-800 shadow-lg" 
        : "bg-transparent"
    }`}>
      <Container>
        <nav className="flex items-center justify-between py-4" aria-label="Global">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <WouterLink to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Paybord</span>
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-bold ${scrolled ? 'text-white' : 'text-white'}`}>
                  Paybord
                </span>
              </div>
            </WouterLink>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-300"
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
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </WouterLink>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
            <WouterLink to="/signin">
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300">
                Login
              </Button>
            </WouterLink>
            <WouterLink to="/signup">
              <Button className="bg-[#FFD700] text-black hover:bg-[#FFC700] px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                Sign up
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

export default Navbar;