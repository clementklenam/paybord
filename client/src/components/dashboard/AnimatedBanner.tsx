import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBannerProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

function AnimatedBanner({ title, subtitle, children }: AnimatedBannerProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl mb-8">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      {/* Floating orbs */}
      <motion.div
        className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-60"
        animate={{
          y: [0, -10, 0],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-4 left-8 w-3 h-3 bg-green-400 rounded-full opacity-40"
        animate={{
          y: [0, 15, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-4 w-1 h-1 bg-yellow-400 rounded-full opacity-50"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      
      <div className="relative px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <motion.div 
            className="mb-4 lg:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="text-gray-300">{subtitle}</p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AnimatedBanner; 