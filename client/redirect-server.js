const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 5002;
const VITE_PORT = process.env.VITE_PORT || 5173;

// Redirect all /pl_* routes to /payment/*
app.get('/pl/:id', (req, res) => {
  const id = req.params.id;
  console.log(`Redirecting payment link pl_${id} to /payment/${id}`);
  res.redirect(`/payment/${id}`);
});

// Proxy all other requests to the Vite development server
app.use('/', createProxyMiddleware({
  target: `http://localhost:${VITE_PORT}`,
  changeOrigin: true,
  ws: true,
}));

// Start the server
app.listen(PORT, () => {
  console.log(`Redirect server running on http://localhost:${PORT}`);
  console.log(`Proxying requests to Vite server at http://localhost:${VITE_PORT}`);
  console.log('Payment links will be redirected from /pl_ID to /payment/ID');
}); 