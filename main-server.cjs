const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5002;

console.log('Starting server...');
console.log('Current directory:', __dirname);
console.log('Dist directory:', path.join(__dirname, 'dist'));

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Handle assets explicitly
app.get('/assets/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'dist', 'assets', filename);
  
  console.log('Asset request:', filename);
  console.log('File path:', filePath);
  
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filename);
    if (ext === '.js') {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (ext === '.css') {
      res.setHeader('Content-Type', 'text/css');
    }
    console.log('Serving file with Content-Type:', res.getHeader('Content-Type'));
    res.sendFile(filePath);
  } else {
    console.log('File not found:', filePath);
    res.status(404).send('Asset not found');
  }
});

// Handle images
app.get('/img/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'dist', 'img', filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Image not found');
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  console.log('Serving index.html for route:', req.url);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📁 Serving from: ${path.join(__dirname, 'dist')}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
}); 