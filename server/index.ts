import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// IMPORTANT: First register middleware for JSON and URL-encoded parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add logging middleware for API requests
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  // Debug payment link routes
  if (path.startsWith('/pl_')) {
    console.log(`Received request for payment link: ${path}`);
  }
  
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api") || path.startsWith("/pl_")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Register routes - moved this up to ensure it happens before Vite setup
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // IMPORTANT: Set up vite AFTER registering our routes
  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5001
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5002", 10);

  // Adding event handler for server error to properly handle port conflicts
  server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      log(`Port ${port} is already in use. Please free the port and try again.`);
      // Don't exit as that would terminate the Replit workflow
      // Instead, retry after delay
      setTimeout(() => {
        log(`Retrying to start server on port ${port}...`);
        server.close();
        server.listen({
          port,
          host: "0.0.0.0",
        });
      }, 5000); // Wait 5 seconds before retry
    } else {
      log(`Server error: ${e.message}`);
    }
  });

  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`Server running on port ${port}`);
    log(`Try accessing payment link: http://localhost:${port}/pl_3032c28b28d32637`);
  });
})();
