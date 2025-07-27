const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5002;

// Log static files middleware
console.log('Registering static middleware:', path.join(__dirname, 'dist'));
app.use(express.static(path.join(__dirname, 'dist')));

// Log /pl/:id route
console.log('Registering route: /pl/:id');
app.get('/pl/:id', (req, res) => {
  console.log(`Received request for payment link: ${req.path}`);
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Log catch-all route
console.log('Registering route: *');
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`You can access payment links at http://localhost:${PORT}/pl_YOUR_LINK_ID`);
}); 