const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5002;

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all: send index.html for all other routes
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 