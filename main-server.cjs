const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5002;

// Add debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Explicitly handle assets directory
app.get('/assets/*', (req, res) => {
  const filePath = path.join(__dirname, 'dist', req.url);
  console.log('Serving asset:', filePath);
  
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath);
    if (ext === '.js') {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (ext === '.css') {
      res.setHeader('Content-Type', 'text/css');
    }
    res.sendFile(filePath);
  } else {
    res.status(404).send('Asset not found');
  }
});

// Serve other static files
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all: send index.html for all other routes
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Serving static files from: ${path.join(__dirname, 'dist')}`);
}); 