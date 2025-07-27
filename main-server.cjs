const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5002;

// Add some debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static files from dist with explicit MIME types
app.use('/assets', express.static(path.join(__dirname, 'dist', 'assets'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.use('/img', express.static(path.join(__dirname, 'dist', 'img')));

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