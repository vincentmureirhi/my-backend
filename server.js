const express = require('express');
const mysql = require('mysql');

// Initialize the app
const app = express();

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'naivasuser',
    password: 'yourpassword',
    database: 'naivasdb'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

// Route to add a new product
app.post('/addProduct', (req, res) => {
    const { productName, productCode, price } = req.body;

    if (!productName || !productCode || !price) {
        return res.status(400).json({ message: 'Please provide all product details' });
    }

    const query = 'INSERT INTO products (productName, productCode, price) VALUES (?, ?, ?)';
    db.query(query, [productName, productCode, price], (err, result) => {
        if (err) {
            console.error('Failed to add product:', err);
            return res.status(500).json({ message: 'Failed to add product' });
        }
        res.status(200).json({ message: 'Product added successfully', productId: result.insertId });
    });
});

// Route to get all products
app.get('/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Failed to fetch products:', err);
            return res.status(500).json({ message: 'Failed to fetch products' });
        }
        res.status(200).json(results);
    });
});

// Route to get a product by code
app.get('/product/:code', (req, res) => {
    const productCode = req.params.code;
    const query = 'SELECT * FROM products WHERE productCode = ?';
    db.query(query, [productCode], (err, results) => {
        if (err) {
            console.error('Failed to fetch product:', err);
            return res.status(500).json({ message: 'Failed to fetch product' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(results[0]);
    });
});

// Route to update a product's price
app.put('/updateProduct/:code', (req, res) => {
    const productCode = req.params.code;
    const { price } = req.body;

    if (!price) {
        return res.status(400).json({ message: 'Please provide a new price' });
    }

    const query = 'UPDATE products SET price = ? WHERE productCode = ?';
    db.query(query, [price, productCode], (err, result) => {
        if (err) {
            console.error('Failed to update product price:', err);
            return res.status(500).json({ message: 'Failed to update product price' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product price updated successfully' });
    });
});

// Route to delete a product
app.delete('/deleteProduct/:code', (req, res) => {
    const productCode = req.params.code;

    const query = 'DELETE FROM products WHERE productCode = ?';
    db.query(query, [productCode], (err, result) => {
        if (err) {
            console.error('Failed to delete product:', err);
            return res.status(500).json({ message: 'Failed to delete product' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
