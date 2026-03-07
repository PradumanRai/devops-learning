// app.js - Simple E-Commerce Application for Abstergo Corp
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Sample product data
const products = [
    { id: 1, name: 'Laptop Pro X1', price: 1299.99, category: 'Electronics' },
    { id: 2, name: 'Wireless Mouse', price: 29.99, category: 'Accessories' },
    { id: 3, name: 'USB-C Hub', price: 49.99, category: 'Accessories' },
    { id: 4, name: 'Monitor 27"', price: 399.99, category: 'Electronics' },
    { id: 5, name: 'Mechanical Keyboard', price: 149.99, category: 'Accessories' }
];

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Abstergo Corp E-Commerce Portal running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the application`);
});
