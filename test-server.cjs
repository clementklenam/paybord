const express = require('express');
const path = require('path');
const app = express();
const PORT = 5003;

console.log('Current directory:', __dirname);
console.log('Dist path:', path.join(__dirname, 'dist'));
console.log('Assets path:', path.join(__dirname, 'dist', 'assets'));

// Simple static file serving
app.use('/assets', express.static(path.join(__dirname, 'dist', 'assets')));

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
}); 