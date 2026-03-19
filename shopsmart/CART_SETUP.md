# Cart System Setup Guide

This guide explains how to set up and use the new cart system that integrates with MongoDB backend.

## Features

- ✅ Products stored in MongoDB with unique IDs
- ✅ Cart items saved to MongoDB database
- ✅ User authentication required for cart operations
- ✅ Real-time cart updates
- ✅ Quantity controls in cart
- ✅ Cart persistence across sessions

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd shopsmart/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   PORT=5002
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Populate Products Database

Run the product population script to add products to MongoDB:

```bash
npm run populate-products
```

This will:
- Connect to your MongoDB database
- Clear existing products
- Insert all products from the frontend data
- Display the MongoDB IDs for each product

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd shopsmart/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## How It Works

### Product Management
- Products are now fetched from the backend API instead of local data
- Each product has a unique MongoDB `_id` that is used for cart operations
- Products are stored in the `products` collection in MongoDB

### Cart Operations
- Cart items are stored in the `carts` collection in MongoDB
- Each user has their own cart document
- Cart operations require user authentication
- Cart data persists across browser sessions

### API Endpoints

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category

#### Cart
- `GET /api/cart` - Get user's cart (requires auth)
- `POST /api/cart/add` - Add item to cart (requires auth)
- `PUT /api/cart/update/:productId` - Update item quantity (requires auth)
- `DELETE /api/cart/remove/:productId` - Remove item from cart (requires auth)
- `DELETE /api/cart/clear` - Clear entire cart (requires auth)

## Usage

### Adding Items to Cart
1. User must be logged in
2. Click "ADD TO CART" on any product
3. Item is saved to MongoDB with product ID
4. Cart count updates in real-time

### Managing Cart
1. Navigate to `/cart` page
2. View all cart items with quantities
3. Use +/- buttons to adjust quantities
4. Click remove icon to delete items
5. Use "Clear Cart" to remove all items

### Authentication
- Users must be logged in to use cart features
- Cart data is tied to the authenticated user
- Cart persists across browser sessions

## Database Schema

### Product Schema
```javascript
{
  _id: ObjectId,
  name: String,
  category: String,
  image: String,
  new_price: Number,
  old_price: Number,
  date: Date,
  available: Boolean
}
```

### Cart Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  total: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### Common Issues

1. **Products not loading**: Check if MongoDB is running and the connection string is correct
2. **Cart not working**: Ensure user is logged in and backend server is running
3. **API errors**: Check browser console and backend logs for error messages

### Debug Steps

1. Check MongoDB connection in backend logs
2. Verify products are populated using MongoDB Compass or CLI
3. Check authentication token in browser localStorage
4. Verify API endpoints are accessible

## Migration from Old System

The new system is backward compatible with the old local cart system. The frontend will:
1. Try to fetch products from the backend API
2. Fall back to local data if API is unavailable
3. Maintain the same user interface and experience

## Security Features

- Authentication required for all cart operations
- User can only access their own cart
- Product IDs validated against database
- Input validation and error handling
