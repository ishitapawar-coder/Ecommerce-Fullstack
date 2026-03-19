# ShopSmart API Documentation

## Base URL
```
http://localhost:5002/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### POST `/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Signup successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/auth/login`
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### GET `/auth/check`
Verify if the current token is valid.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/auth/logout`
Logout user and invalidate token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Products

#### GET `/products`
Get all available products.

**Response:**
```json
[
  {
    "_id": "product_id",
    "name": "Elegant Evening Dress",
    "category": "women",
    "image": "/src/assets/p1.jfif",
    "new_price": 120.0,
    "old_price": 180.0,
    "availableSizes": ["XS", "S", "M", "L", "XL"],
    "date": "2024-01-01T00:00:00.000Z",
    "available": true
  }
]
```

#### GET `/products/:id`
Get a specific product by ID.

**Response:**
```json
{
  "_id": "product_id",
  "name": "Elegant Evening Dress",
  "category": "women",
  "image": "/src/assets/p1.jfif",
  "new_price": 120.0,
  "old_price": 180.0,
  "availableSizes": ["XS", "S", "M", "L", "XL"],
  "date": "2024-01-01T00:00:00.000Z",
  "available": true
}
```

#### GET `/products/category/:category`
Get products filtered by category.

**Parameters:**
- `category`: men, women, or kid

**Response:**
```json
[
  {
    "_id": "product_id",
    "name": "Product Name",
    "category": "women",
    "image": "/src/assets/product.jpg",
    "new_price": 120.0,
    "old_price": 180.0,
    "availableSizes": ["XS", "S", "M", "L", "XL"],
    "date": "2024-01-01T00:00:00.000Z",
    "available": true
  }
]
```

### Cart

#### GET `/cart`
Get the current user's cart.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "cart_id",
  "user": "user_id",
  "items": [
    {
      "product": {
        "_id": "product_id",
        "name": "Elegant Evening Dress",
        "image": "/src/assets/p1.jfif",
        "new_price": 120.0
      },
      "quantity": 2,
      "size": "S",
      "price": 120.0
    }
  ],
  "total": 240.0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### POST `/cart/add`
Add an item to the cart.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 1,
  "size": "S"
}
```

**Response:**
```json
{
  "_id": "cart_id",
  "user": "user_id",
  "items": [
    {
      "product": {
        "_id": "product_id",
        "name": "Elegant Evening Dress",
        "image": "/src/assets/p1.jfif",
        "new_price": 120.0
      },
      "quantity": 1,
      "size": "S",
      "price": 120.0
    }
  ],
  "total": 120.0
}
```

#### PUT `/cart/update/:productId`
Update the quantity of an item in the cart.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": 3,
  "size": "S"
}
```

**Response:**
```json
{
  "_id": "cart_id",
  "user": "user_id",
  "items": [
    {
      "product": {
        "_id": "product_id",
        "name": "Elegant Evening Dress",
        "image": "/src/assets/p1.jfif",
        "new_price": 120.0
      },
      "quantity": 3,
      "size": "S",
      "price": 120.0
    }
  ],
  "total": 360.0
}
```

#### DELETE `/cart/remove/:productId`
Remove an item from the cart.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `size`: The size of the item to remove

**Response:**
```json
{
  "_id": "cart_id",
  "user": "user_id",
  "items": [],
  "total": 0
}
```

#### DELETE `/cart/clear`
Clear all items from the cart.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Cart cleared successfully"
}
```

### Payment

#### POST `/payment/create-order`
Create a new payment order.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 1200,
  "currency": "INR",
  "receipt": "order_receipt_123"
}
```

**Response:**
```json
{
  "id": "order_id",
  "amount": 1200,
  "currency": "INR",
  "receipt": "order_receipt_123",
  "status": "created"
}
```

#### POST `/payment/verify`
Verify payment signature.

**Request Body:**
```json
{
  "razorpay_order_id": "order_id",
  "razorpay_payment_id": "payment_id",
  "razorpay_signature": "signature"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Rate Limiting
- 100 requests per minute per IP address
- 1000 requests per hour per user

## CORS
The API supports CORS for the following origins:
- `http://localhost:5173` (development)
- `https://shopsmart.com` (production)

## Data Validation
All request bodies are validated using Joi schema validation. Invalid data will return a 400 Bad Request response with validation details.
