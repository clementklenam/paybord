const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5002;

console.log('Registering static middleware:', path.join(__dirname, 'dist'));
app.use(express.static(path.join(__dirname, 'dist')));

console.log('Registering route: /pl/:id');
app.get('/pl/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

console.log('Registering route: /');
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

console.log('Registering route: *');
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 