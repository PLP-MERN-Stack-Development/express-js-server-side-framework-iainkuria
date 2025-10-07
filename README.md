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
   npm install express body-parser uuid

   Start the server:

bash
node server.js
The server will run on http://localhost:3000

Environment Variables
No environment variables are required for this basic implementation, but in a production app you would want to configure:

PORT

API_KEY

DATABASE_URL

API Documentation
Authentication
Include the API key in the x-api-key header for POST, PUT, and DELETE requests.

Example:

text
x-api-key: secret-api-key-123
Endpoints
GET /
Description: Welcome message

Response: Plain text welcome message

GET /api/products
Description: Get all products with optional filtering, pagination, and search

Query Parameters:

category (optional): Filter by category

search (optional): Search in product names

inStock (optional): Filter by stock status (true/false)

page (optional): Page number for pagination (default: 1)

limit (optional): Number of items per page (default: 10)

Response: Paginated list of products with metadata

GET /api/products/:id
Description: Get a specific product by ID

Parameters: Product ID in URL

Response: Single product object

POST /api/products
Description: Create a new product

Authentication: Required (x-api-key header)

Body: Product object (name, description, price, category, inStock)

Response: Created product with generated ID

PUT /api/products/:id
Description: Update an existing product

Authentication: Required (x-api-key header)

Parameters: Product ID in URL

Body: Updated product object

Response: Updated product

DELETE /api/products/:id
Description: Delete a product

Authentication: Required (x-api-key header)

Parameters: Product ID in URL

Response: Deleted product

GET /api/products/stats
Description: Get product statistics

Response: Statistics object with counts, averages, and category breakdown

Request/Response Examples
Create a Product
Request:

bash
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
Response:

json
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
Get Products with Filtering
Request:

bash
curl "http://localhost:3000/api/products?category=electronics&page=1&limit=5"
Response:

json
{
  "page": 1,
  "limit": 5,
  "total": 3,
  "totalPages": 1,
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    },
    ...
  ]
}
Error Response Example
Response:

json
{
  "error": "NotFoundError",
  "message": "Product with ID 999 not found"
}
text

**.env.example**
```bash
# Server Configuration
PORT=3000

# API Security
API_KEY=secret-api-key-123

# Database Configuration (for future use)
# DATABASE_URL=mongodb://localhost:27017/products
# DB_HOST=localhost
# DB_PORT=27017
# DB_NAME=products