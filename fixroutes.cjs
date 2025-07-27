#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = 5002;
const API_PORT = 5000;

// Serve static files
app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(express.static(path.join(__dirname, 'client/public')));

// Special handler for payment links
app.get('/pl/:id', (req, res) => {
  const fullPath = req.path;
  // Extract the ID part
  const id = fullPath.slice(1); // Remove leading slash
  
  console.log(`Payment link requested: ${fullPath}`);
  console.log(`Redirecting to /payment/${id.replace('pl_', '')}`);
  
  // Redirect to the payment page route
  res.redirect(`/payment/${id.replace('pl_', '')}`);
});

// Proxy API requests to the backend server
app.use('/api', createProxyMiddleware({
  target: `http://localhost:${API_PORT}`,
  changeOrigin: true,
}));

// For any other path, serve the main index.html file
app.get('*', (req, res) => {
  // Check if this is a direct browser navigation to a route
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 URL routing server running at http://localhost:${PORT}`);
  console.log(`Payment links will be accessible at http://localhost:${PORT}/pl_YOUR_ID`);
  console.log(`API requests will be proxied to http://localhost:${API_PORT}`);
}); 