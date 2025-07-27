import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';
import type { ViteDevServer, Plugin } from 'vite';

// Define __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom plugin to handle /pl_* routes for payment links
const paymentLinksPlugin = (): Plugin => {
  return {
    name: 'payment-links-handler',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req: any, res: any, next: () => void) => {
        const url = req.url;
        
        // Handle payment link URLs by redirecting to the payment page
        if (url && url.startsWith('/pl_')) {
          console.log(`Payment link detected: ${url}`);
          
          // Extract the ID and redirect to payment/:id
          const id = url.substring(1).replace('pl_', '');
          req.url = `/payment/${id}`;
          console.log(`Redirected to: ${req.url}`);
        }
        
        next();
      });
    },
  };
};

export default defineConfig({
  plugins: [
    react(),
    paymentLinksPlugin()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "client/dist"),
    emptyOutDir: true,
  },
  server: {
    port: 5002,
    strictPort: true,
    cors: true,
    proxy: {
      // Proxy API requests to backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  appType: 'spa' as const, // Tell Vite this is a single page application
});