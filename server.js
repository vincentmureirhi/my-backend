const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/products', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Define your product schema and model
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    barcode: String,
});

const Product = mongoose.model('Product', productSchema);

// API route to add products
app.post('/api/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.send(product);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
