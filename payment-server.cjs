const express = require('express');
const path = require('path');
const app = express();
const PORT = 5002;

// Tell Express where our static files are located
app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(express.static(path.join(__dirname, 'client/public')));

// Handle payment link routes
app.get('/pl_:id', (req, res) => {
  const { id } = req.params;
  console.log(`Payment link accessed: pl_${id}`);
  
  // Redirect to the payment page
  res.redirect(`/payment/${id}`);
});

// Send index.html for all other routes for SPA client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`⚡️ Payment link server running at http://localhost:${PORT}`);
  console.log(`Try accessing a payment link: http://localhost:${PORT}/pl_8145379c694816fb`);
}); 