const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5002;

console.log('Starting server from client directory...');
console.log('Current directory:', __dirname);

// Path to the built files
const distPath = path.join(__dirname, 'dist');
console.log('Dist path:', distPath);

// Check if dist directory exists
if (!fs.existsSync(distPath)) {
  console.error('Dist directory not found:', distPath);
  process.exit(1);
}

// Serve assets with proper MIME types
app.use('/assets', express.static(path.join(distPath, 'assets'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Serve images
app.use('/img', express.static(path.join(distPath, 'img')));

// Catch-all route - serve the built index.html for all routes except payment links
app.use('*', (req, res) => {
  const url = req.originalUrl;
  
  // Skip processing payment links
  if (url.startsWith('/pl_')) {
    console.log('Skipping payment link:', url);
    return;
  }
  
  // Serve the built index.html
  const builtIndexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(builtIndexPath)) {
    res.sendFile(builtIndexPath);
  } else {
    res.status(404).send('Built index.html not found');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📁 Serving from: ${distPath}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
}); 