const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5002;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// For any route that doesn't match a static file, serve index.html
// This allows client-side routing to work
app.get('/pl_:id', (req, res) => {
  console.log(`Received request for payment link: ${req.path}`);
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`You can access payment links at http://localhost:${PORT}/pl_YOUR_LINK_ID`);
}); 