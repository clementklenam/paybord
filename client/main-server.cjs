const express = require('express');
const app = express();
const PORT = process.env.PORT || 5002;

console.log('Registering route: /');
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 