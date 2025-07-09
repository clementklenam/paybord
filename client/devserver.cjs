#!/usr/bin/env node

const express = require('express');
const { createServer: createViteServer } = require('vite');
const path = require('path');
const fs = require('fs');

async function createDevServer() {
  const app = express();
  const PORT = process.env.PORT || 5002;
  
  try {
    // Create Vite server in middleware mode and configure the app type as 'spa'
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: path.resolve(__dirname),
    });

    // Use vite's connect instance as middleware
    app.use(vite.middlewares);
    
    // Add special handling for payment links
    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        
        console.log(`Handling request: ${url}`);
        
        // Special handling for payment links to make debugging easier
        if (url.startsWith('/pl_')) {
          console.log(`Detected payment link URL: ${url}`);
          
          // For direct testing
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            // Read the index.html
            let template = fs.readFileSync(
              path.resolve(__dirname, 'index.html'),
              'utf-8'
            );
            
            // Apply Vite HTML transforms
            template = await vite.transformIndexHtml(url, template);
            
            res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
            return;
          }
        }
        
        // Let vite handle normal asset requests
        next();
      } catch (e) {
        console.error(`Error handling request: ${e.stack}`);
        next(e);
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`⚡️ Dev server running at: http://localhost:${PORT}`);
      console.log(`Try accessing a payment link: http://localhost:${PORT}/pl_8145379c694816fb`);
    });
    
  } catch (e) {
    console.error(`Error starting dev server: ${e.stack}`);
  }
}

createDevServer(); 