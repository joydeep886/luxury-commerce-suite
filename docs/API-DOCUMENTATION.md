
# Luxuria E-commerce API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get User Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

## Product Endpoints

### Search Products
```http
GET /products/search?q=dress&category=women&sort=price_asc&page=1&limit=24
```

**Query Parameters:**
- `q` (string): Search term
- `category` (string): Category slug
- `brand` (string): Brand name
- `price_min` (number): Minimum price
- `price_max` (number): Maximum price
- `rating` (number): Minimum rating
- `sort` (string): Sort by (relevance, price_asc, price_desc, rating, newest, popular)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 24)
- `in_stock` (boolean): Only show in-stock items

### Get Product Details
```http
GET /products/{productId}
```

### Get Featured Products
```http
GET /products/featured
```

### Get New Products
```http
GET /products/new
```

## Category Endpoints

### Get All Categories
```http
GET /categories
```

### Get Category by Slug
```http
GET /categories/{categorySlug}?page=1
```

## Order Endpoints

### Create Order
```http
POST /orders
Authorization: Bearer <token> (optional for guest orders)
Content-Type: application/json

{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "variantInfo": {
        "size": "M",
        "color": "Black"
      }
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "paymentMethod": "credit_card",
  "guestEmail": "guest@example.com" // Required for guest orders
}
```

### Get User Orders
```http
GET /orders
Authorization: Bearer <token>
```

### Get Order Details
```http
GET /orders/{orderId}
Authorization: Bearer <token>
```

## User Management Endpoints

### Update Profile
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

### Get User Addresses
```http
GET /users/addresses
Authorization: Bearer <token>
```

### Add Address
```http
POST /users/addresses
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "address1": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "phone": "+1234567890",
  "isDefault": true
}
```

### Update Address
```http
PUT /users/addresses/{addressId}
Authorization: Bearer <token>
```

### Delete Address
```http
DELETE /users/addresses/{addressId}
Authorization: Bearer <token>
```

### Get Wishlist
```http
GET /users/wishlist
Authorization: Bearer <token>
```

### Add to Wishlist
```http
POST /users/wishlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "uuid"
}
```

### Remove from Wishlist
```http
DELETE /users/wishlist/{productId}
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": { ... },
  "pagination": { ... } // For paginated endpoints
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": [ ... ] // For validation errors
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting
- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: 
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
