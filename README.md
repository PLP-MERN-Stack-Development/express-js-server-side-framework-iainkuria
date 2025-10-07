# Product API - Express.js RESTful API

A complete RESTful API for managing products, built with Express.js as part of the Week 2 assignment.

## Features

- Full CRUD operations for products
- Request logging
- API key authentication
- Input validation
- Error handling
- Advanced features: filtering, pagination, search, statistics
- Product statistics endpoint

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   Or:
   ```bash
   node server.js
   ```
4. The server will run on `http://localhost:3000`

## Environment Variables

Copy `.env.example` to `.env` and configure your environment variables:

```bash
# Server Configuration
PORT=3000

# API Security
API_KEY=your-secret-api-key-here

# Database Configuration (for future use)
# DATABASE_URL=mongodb://localhost:27017/products
# DB_HOST=localhost
# DB_PORT=27017
# DB_NAME=products
```

For testing purposes, the API will work with the default hardcoded API key: `secret-api-key-123`

## API Documentation

### Authentication

Include the API key in the `x-api-key` header for POST, PUT, and DELETE requests.

**Example:**
```
x-api-key: secret-api-key-123
```

### Endpoints

#### GET /
- **Description:** Welcome message
- **Response:** Plain text welcome message

**Example Request:**
```bash
curl http://localhost:3000/
```

**Example Response:**
```
Welcome to the Product API! Go to /api/products to see all products.
```

#### GET /api/products
- **Description:** Get all products with optional filtering, pagination, and search
- **Query Parameters:**
  - `category` (optional): Filter by category
  - `search` (optional): Search in product names
  - `inStock` (optional): Filter by stock status (true/false)
  - `page` (optional): Page number for pagination (default: 1)
  - `limit` (optional): Number of items per page (default: 10)
- **Response:** Paginated list of products with metadata

**Example Request:**
```bash
curl "http://localhost:3000/api/products?category=electronics&page=1&limit=2"
```

**Example Response:**
```json
{
  "page": 1,
  "limit": 2,
  "total": 3,
  "totalPages": 2,
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    },
    {
      "id": "2",
      "name": "Smartphone",
      "description": "Latest model with 128GB storage",
      "price": 800,
      "category": "electronics",
      "inStock": true
    }
  ]
}
```

#### GET /api/products/:id
- **Description:** Get a specific product by ID
- **Parameters:** Product ID in URL
- **Response:** Single product object

**Example Request:**
```bash
curl http://localhost:3000/api/products/1
```

**Example Response:**
```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}
```

#### POST /api/products
- **Description:** Create a new product
- **Authentication:** Required (x-api-key header)
- **Body:** Product object (name, description, price, category, inStock)
- **Response:** Created product with generated ID

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: secret-api-key-123" \
  -d '{
    "name": "New Product",
    "description": "A great new product",
    "price": 99.99,
    "category": "electronics",
    "inStock": true
  }'
```

**Example Response:**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "New Product",
    "description": "A great new product",
    "price": 99.99,
    "category": "electronics",
    "inStock": true
  }
}
```

#### PUT /api/products/:id
- **Description:** Update an existing product
- **Authentication:** Required (x-api-key header)
- **Parameters:** Product ID in URL
- **Body:** Updated product object
- **Response:** Updated product

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -H "x-api-key: secret-api-key-123" \
  -d '{
    "name": "Updated Laptop",
    "description": "Updated description with more features",
    "price": 1300,
    "category": "electronics",
    "inStock": false
  }'
```

**Example Response:**
```json
{
  "message": "Product updated successfully",
  "product": {
    "id": "1",
    "name": "Updated Laptop",
    "description": "Updated description with more features",
    "price": 1300,
    "category": "electronics",
    "inStock": false
  }
}
```

#### DELETE /api/products/:id
- **Description:** Delete a product
- **Authentication:** Required (x-api-key header)
- **Parameters:** Product ID in URL
- **Response:** Deleted product

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/products/1 \
  -H "x-api-key: secret-api-key-123"
```

**Example Response:**
```json
{
  "message": "Product deleted successfully",
  "product": {
    "id": "1",
    "name": "Laptop",
    "description": "High-performance laptop with 16GB RAM",
    "price": 1200,
    "category": "electronics",
    "inStock": true
  }
}
```

#### GET /api/products/stats
- **Description:** Get product statistics
- **Response:** Statistics object with counts, averages, and category breakdown

**Example Request:**
```bash
curl http://localhost:3000/api/products/stats
```

**Example Response:**
```json
{
  "totalProducts": 5,
  "totalInStock": 4,
  "totalOutOfStock": 1,
  "averagePrice": 480,
  "categories": {
    "electronics": 3,
    "kitchen": 1,
    "furniture": 1
  },
  "highestPricedProduct": {
    "id": "1",
    "name": "Laptop",
    "description": "High-performance laptop with 16GB RAM",
    "price": 1200,
    "category": "electronics",
    "inStock": true
  },
  "lowestPricedProduct": {
    "id": "3",
    "name": "Coffee Maker",
    "description": "Programmable coffee maker with timer",
    "price": 50,
    "category": "kitchen",
    "inStock": false
  }
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

### Common Error Responses:

**400 Bad Request (Validation Error):**
```json
{
  "error": "Validation failed",
  "details": [
    "Name is required and must be a non-empty string",
    "Price is required and must be a non-negative number"
  ]
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "Valid API key required in x-api-key header"
}
```

**404 Not Found:**
```json
{
  "error": "NotFoundError",
  "message": "Product with ID 999 not found"
}
```

**404 Route Not Found:**
```json
{
  "error": "Route not found",
  "message": "The route /api/nonexistent does not exist"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong on the server"
}
```

## Request/Response Examples

### Successful Product Creation
**Request:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: secret-api-key-123" \
  -d '{
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with long battery life",
    "price": 25.99,
    "category": "electronics",
    "inStock": true
  }'
```

**Response:**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with long battery life",
    "price": 25.99,
    "category": "electronics",
    "inStock": true
  }
}
```

### Search and Filter Example
**Request:**
```bash
curl "http://localhost:3000/api/products?search=laptop&category=electronics&inStock=true"
```

**Response:**
```json
{
  "page": 1,
  "limit": 10,
  "total": 1,
  "totalPages": 1,
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
  ]
}
```

## Technologies Used

- **Express.js** - Web framework
- **Body Parser** - JSON request parsing
- **UUID** - Unique ID generation
- **Node.js** - Runtime environment

## Project Structure

```
express-js-server-side-framework-iainkuria/
├── server.js          # Main application file
├── package.json       # Dependencies and scripts
├── README.md          # This file
├── .env.example       # Environment variables template
└── .gitignore         # Git ignore rules
```

## Development

The server includes:
- Custom middleware for request logging
- Authentication middleware
- Validation middleware
- Global error handling
- Async error handling wrapper

##Requirements Completed

✅ **Express.js Setup** - Server running on port 3000 with root endpoint  
✅ **RESTful API Routes** - Full CRUD operations for products  
✅ **Middleware Implementation** - Logger, authentication, and validation  
✅ **Error Handling** - Custom error classes and global error handler  
✅ **Advanced Features** - Filtering, pagination, search, and statistics  

## License

ISC