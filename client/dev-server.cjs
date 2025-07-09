const express = require('express');
const { createServer: createViteServer } = require('vite');
const path = require('path');
const fs = require('fs');

async function createServer() {
  const app = express();
  
  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: path.resolve(__dirname)
  });
  
  // Use vite's connect instance as middleware
  app.use(vite.middlewares);
  
  // Handle all routes for client-side routing
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    
    try {
      // Always serve index.html for any route
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      );
      
      // Apply Vite HTML transforms
      template = await vite.transformIndexHtml(url, template);
      
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      next(e);
    }
  });
  
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => {
    console.log(`Dev server running at: http://localhost:${PORT}`);
  });
}

createServer(); 