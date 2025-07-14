import React from 'react';
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Zap, 
  ChevronDown,
  ArrowRight,
  Globe,
  Shield,
  Users
} from "lucide-react";

const navigation = [
  { name: "Products", href: "#", hasDropdown: true },
  { name: "Solutions", href: "#", hasDropdown: true },
  { name: "Pricing", href: "#" },
  { name: "Developers", href: "#" },
  { name: "Company", href: "#" }
];

const productDropdown = [
  {
    title: "Storefronts",
    description: "Create beautiful, customizable storefronts",
    icon: Zap,
    href: "#"
  },
  {
    title: "Payment Links",
    description: "Generate viral payment links instantly",
    icon: Globe,
    href: "#"
  },
  {
    title: "Analytics",
    description: "Track performance and optimize growth",
    icon: Users,
    href: "#"
  },
  {
    title: "Security",
    description: "Enterprise-grade security & compliance",
    icon: Shield,
    href: "#"
  }
];

const solutionsDropdown = [
  {
    title: "E-commerce",
    description: "Complete online store solutions",
    href: "#"
  },
  {
    title: "SaaS",
    description: "Subscription and recurring payments",
    href: "#"
  },
  {
    title: "Marketplace",
    description: "Multi-vendor platform payments",
    href: "#"
  },
  {
    title: "Enterprise",
    description: "Custom solutions for large businesses",
    href: "#"
  }
];


  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDropdownToggle = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-slate-900/95 backdrop-blur-md border-b border-white/10" 
        : "bg-transparent"
    }`}>
      <Container>
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <span className="text-xl lg:text-2xl font-bold text-white">Paybord</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {item.hasDropdown ? (
                  <button
                    onClick={() => handleDropdownToggle(item.name)}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 py-2"
                  >
                    {item.name}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                      activeDropdown === item.name ? "rotate-180" : ""
                    }`} />
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 py-2"
                  >
                    {item.name}
                  </a>
                )}

                {/* Dropdown */}
                <AnimatePresence>
                  {activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-80 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="grid gap-4">
                          {(item.name === "Products" ? productDropdown : solutionsDropdown).map((dropdownItem, idx) => (
                            <motion.a
                              key={idx}
                              href={dropdownItem.href}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.05 }}
                              className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                            >
                              {dropdownItem.icon && (
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                  <dropdownItem.icon className="w-5 h-5 text-purple-400" />
                                </div>
                              )}
                              <div className="flex-1">
                                <h4 className="text-white font-semibold mb-1 group-hover:text-purple-300 transition-colors duration-300">
                                  {dropdownItem.title}
                                </h4>
                                <p className="text-gray-400 text-sm">
                                  {dropdownItem.description}
                                </p>
                              </div>
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:flex items-center gap-4"
          >
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-slate-900/95 backdrop-blur-md border-t border-white/10 overflow-hidden"
            >
              <div className="py-6 space-y-6">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <a
                      href={item.href}
                      className="block text-gray-300 hover:text-white transition-colors duration-300 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </a>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <Button variant="ghost" className="w-full text-gray-300 hover:text-white hover:bg-white/10 justify-start">
                    Sign In
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
}

export default Header; 