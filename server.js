const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());

// In-memory store (replace with database in production)
const products = {};

// Add Product Endpoint
app.post('/api/products', (req, res) => {
  const { name, code, price } = req.body;
  if (!name || !code || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  products[code] = { name, price };
  res.status(201).json({ message: 'Product added successfully' });
});

// Fetch Product Details Endpoint
app.get('/api/products/:code', (req, res) => {
  const { code } = req.params;
  const product = products[code];
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
