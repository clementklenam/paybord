import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // IMPORTANT: Add payment link route BEFORE other routes to ensure it's matched first
  console.log("Registering payment link route handler");
  
  // Handle payment link routes
  app.get('/pl/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Payment link accessed: pl_${id}`);
    
    // Redirect to the payment page with explicit status code
    res.redirect(302, `/payment/${id}`);
  });
  
  // API proxy routes - forward API requests to backend server
  console.log("Registering API proxy routes");
  
  app.use('/api/*', async (req, res) => {
    const backendUrl = `http://localhost:5000${req.originalUrl}`;
    log(`Proxying API request: ${req.method} ${req.originalUrl} -> ${backendUrl}`);
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      // Copy relevant headers
      if (req.headers.authorization) headers.authorization = req.headers.authorization as string;
      if (req.headers['user-agent']) headers['user-agent'] = req.headers['user-agent'] as string;
      
      const response = await fetch(backendUrl, {
        method: req.method,
        headers,
        body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
      });
      
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log(`API proxy error: ${errorMessage}`);
      res.status(500).json({ error: 'Failed to proxy API request' });
    }
  });

  // put application routes here
  // prefix all routes with /api
  console.log("Registering remaining API routes");

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);
  return httpServer;
}
