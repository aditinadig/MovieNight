const express = require('express');
const app = express();
const port = process.env.PORT || 5002;

app.get('/', (req, res) => {
  res.send('Welcome to the Movie Night Picker Backend');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});