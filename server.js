// server.js - Complete Express server for Week 2 assignment

// Load environment variables if .env file exists
require('dotenv').config();

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Custom error classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

// Custom middleware for request logging
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} request to ${req.originalUrl}`);
  next();
};

// Load environment variables
require('dotenv').config();

// ... other imports ...

// Authentication middleware (updated to use environment variables)
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // Use environment variable instead of hardcoded value
  const validApiKey = process.env.API_KEY || 'secret-api-key-123';
  
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Valid API key required in x-api-key header'
    });
  }
  
  next();
};

// Validation middleware for product creation/updates
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('Description is required and must be a non-empty string');
  }

  if (price === undefined || typeof price !== 'number' || price < 0) {
    errors.push('Price is required and must be a non-negative number');
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('Category is required and must be a non-empty string');
  }

  if (typeof inStock !== 'boolean') {
    errors.push('inStock is required and must be a boolean');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// Middleware setup
app.use(bodyParser.json());
app.use(requestLogger);

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  },
  {
    id: '4',
    name: 'Desk Chair',
    description: 'Ergonomic office chair with lumbar support',
    price: 150,
    category: 'furniture',
    inStock: true
  },
  {
    id: '5',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling Bluetooth headphones',
    price: 200,
    category: 'electronics',
    inStock: true
  }
];

// Helper function to find product by ID
const findProductById = (id) => {
  return products.find(product => product.id === id);
};

// Helper function for async error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// GET /api/products - Get all products with filtering, pagination, and search
app.get('/api/products', asyncHandler(async (req, res) => {
  let filteredProducts = [...products];
  
  // Filter by category
  if (req.query.category) {
    filteredProducts = filteredProducts.filter(
      product => product.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }
  
  // Search by name
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      product => product.name.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by inStock status
  if (req.query.inStock) {
    const inStock = req.query.inStock === 'true';
    filteredProducts = filteredProducts.filter(
      product => product.inStock === inStock
    );
  }
  
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const result = {
    page,
    limit,
    total: filteredProducts.length,
    totalPages: Math.ceil(filteredProducts.length / limit),
    products: filteredProducts.slice(startIndex, endIndex)
  };
  
  res.json(result);
}));

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', asyncHandler(async (req, res) => {
  const product = findProductById(req.params.id);
  
  if (!product) {
    throw new NotFoundError(`Product with ID ${req.params.id} not found`);
  }
  
  res.json(product);
}));

// POST /api/products - Create a new product (requires authentication)
app.post('/api/products', apiKeyAuth, validateProduct, asyncHandler(async (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  
  const newProduct = {
    id: uuidv4(),
    name: name.trim(),
    description: description.trim(),
    price,
    category: category.trim(),
    inStock
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    message: 'Product created successfully',
    product: newProduct
  });
}));

// PUT /api/products/:id - Update a product (requires authentication)
app.put('/api/products/:id', apiKeyAuth, validateProduct, asyncHandler(async (req, res) => {
  const productIndex = products.findIndex(product => product.id === req.params.id);
  
  if (productIndex === -1) {
    throw new NotFoundError(`Product with ID ${req.params.id} not found`);
  }
  
  const { name, description, price, category, inStock } = req.body;
  
  products[productIndex] = {
    ...products[productIndex],
    name: name.trim(),
    description: description.trim(),
    price,
    category: category.trim(),
    inStock
  };
  
  res.json({
    message: 'Product updated successfully',
    product: products[productIndex]
  });
}));

// DELETE /api/products/:id - Delete a product (requires authentication)
app.delete('/api/products/:id', apiKeyAuth, asyncHandler(async (req, res) => {
  const productIndex = products.findIndex(product => product.id === req.params.id);
  
  if (productIndex === -1) {
    throw new NotFoundError(`Product with ID ${req.params.id} not found`);
  }
  
  const deletedProduct = products.splice(productIndex, 1)[0];
  
  res.json({
    message: 'Product deleted successfully',
    product: deletedProduct
  });
}));

// GET /api/products/stats - Get product statistics
app.get('/api/products/stats', asyncHandler(async (req, res) => {
  const stats = {
    totalProducts: products.length,
    totalInStock: products.filter(p => p.inStock).length,
    totalOutOfStock: products.filter(p => !p.inStock).length,
    categories: {}
  };
  
  // Count by category
  products.forEach(product => {
    if (!stats.categories[product.category]) {
      stats.categories[product.category] = 0;
    }
    stats.categories[product.category]++;
  });
  
  // Average price
  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
  stats.averagePrice = totalPrice / products.length;
  
  // Highest and lowest priced products
  const sortedByPrice = [...products].sort((a, b) => a.price - b.price);
  stats.highestPricedProduct = sortedByPrice[sortedByPrice.length - 1];
  stats.lowestPricedProduct = sortedByPrice[0];
  
  res.json(stats);
}));

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error instanceof NotFoundError || error instanceof ValidationError) {
    return res.status(error.statusCode).json({
      error: error.name,
      message: error.message
    });
  }
  
  // Handle other types of errors
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server'
  });
});

// 404 handler for undefined routes - FIXED VERSION
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;