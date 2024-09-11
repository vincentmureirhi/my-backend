const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Path to the JSON file where product data will be stored
const PRODUCTS_FILE = './products.json';

// Initialize products.json if it doesn't exist
if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, '[]'); // Create an empty array
}

// Route to add a product (Admin functionality)
app.post("/add-product", (req, res) => {
    const { name, code, price } = req.body;

    if (!name || !code || !price) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Read the current product data from products.json
    let products = JSON.parse(fs.readFileSync(PRODUCTS_FILE));

    // Add the new product to the list
    products.push({ name, code, price });

    // Write the updated list back to products.json
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products));

    res.status(200).json({ message: "Product added successfully" });
});

// Route to get product details by scanning (Customer functionality)
app.get("/product/:code", (req, res) => {
    const productCode = req.params.code;

    // Read the products data from products.json
    let products = JSON.parse(fs.readFileSync(PRODUCTS_FILE));

    // Find the product by code
    const product = products.find(p => p.code === productCode);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
