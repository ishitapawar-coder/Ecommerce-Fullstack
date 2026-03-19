# ShopSmart Development Guide

This guide is for developers who want to contribute to the ShopSmart e-commerce application.

## Development Environment Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Git
- VS Code (recommended)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd E-commerce-reactjs-main
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   cd shopsmart/backend
   npm install

   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` files in both backend and frontend directories:
   
   **Backend (.env):**
   ```env
   MONGODB_URI=mongodb://localhost:27017/shopsmart_dev
   PORT=5002
   JWT_SECRET=dev_jwt_secret
   NODE_ENV=development
   ```

   **Frontend (.env):**
   ```env
   VITE_API_BASE_URL=http://localhost:5002/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd shopsmart/backend
   npm run dev

   # Terminal 2 - Frontend
   cd shopsmart/frontend
   npm run dev
   ```

## Project Structure

### Frontend Structure
```
frontend/src/
├── Components/          # Reusable UI components
│   ├── Navbar/         # Navigation component
│   ├── ProductDisplay/ # Product detail component
│   ├── CartItems/      # Cart management component
│   └── ...
├── Context/            # React context providers
│   ├── AuthContext.jsx # Authentication state
│   └── ShopContext.jsx # Shopping cart state
├── Pages/              # Page components
│   ├── Shop.jsx        # Main shop page
│   ├── Product.jsx     # Product detail page
│   ├── Cart.jsx        # Shopping cart page
│   └── LoginSignup.jsx # Authentication page
├── services/           # API service functions
│   ├── cartService.js  # Cart API calls
│   └── productService.js # Product API calls
├── utils/              # Utility functions
│   └── authUtils.js    # Authentication utilities
└── assets/             # Static assets
    ├── images/         # Product images
    └── all_product.js  # Product data
```

### Backend Structure
```
backend/
├── config/             # Configuration files
│   └── razorpay.js     # Payment gateway config
├── middleware/         # Express middleware
│   └── auth.js         # Authentication middleware
├── models/             # MongoDB models
│   ├── User.js         # User model
│   ├── Product.js      # Product model
│   └── Cart.js         # Cart model
├── routes/             # API routes
│   ├── auth.js         # Authentication routes
│   ├── products.js     # Product routes
│   ├── cart.js         # Cart routes
│   └── paymentRoutes.js # Payment routes
├── scripts/            # Database scripts
│   └── populateProducts.js # Product data population
└── server.js           # Main server file
```

## Development Workflow

### 1. Feature Development

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards
   - Write tests for new features
   - Update documentation

3. **Test your changes**
   ```bash
   # Backend tests
   cd shopsmart/backend
   npm test

   # Frontend tests
   cd ../frontend
   npm test
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### 2. Code Standards

#### JavaScript/React
- Use ES6+ features
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

#### CSS
- Use BEM methodology for class naming
- Keep styles modular
- Use CSS variables for theming
- Ensure responsive design

#### Backend
- Use async/await for database operations
- Implement proper error handling
- Validate input data
- Use meaningful HTTP status codes

### 3. Testing

#### Frontend Testing
```bash
cd shopsmart/frontend
npm test
```

#### Backend Testing
```bash
cd shopsmart/backend
npm test
```

#### Manual Testing Checklist
- [ ] User registration and login
- [ ] Product browsing and search
- [ ] Cart functionality
- [ ] Payment integration
- [ ] Responsive design
- [ ] Cross-browser compatibility

## Common Development Tasks

### Adding a New Product

1. **Add product data**
   ```javascript
   // In backend/scripts/populateProducts.js
   {
     name: "New Product",
     category: "women",
     image: "/src/assets/new-product.jpg",
     new_price: 150.0,
     old_price: 200.0,
     availableSizes: ['S', 'M', 'L', 'XL']
   }
   ```

2. **Run population script**
   ```bash
   cd shopsmart/backend
   node scripts/populateProducts.js
   ```

### Adding a New API Endpoint

1. **Create route handler**
   ```javascript
   // In backend/routes/yourRoute.js
   router.get('/your-endpoint', auth, async (req, res) => {
     try {
       // Your logic here
       res.json({ success: true, data: result });
     } catch (error) {
       res.status(500).json({ success: false, message: error.message });
     }
   });
   ```

2. **Add route to server.js**
   ```javascript
   app.use('/api/your-route', require('./routes/yourRoute'));
   ```

### Adding a New Component

1. **Create component file**
   ```javascript
   // In frontend/src/Components/YourComponent/YourComponent.jsx
   import React from 'react';
   import './YourComponent.css';

   const YourComponent = ({ props }) => {
     return (
       <div className="your-component">
         {/* Your component content */}
       </div>
     );
   };

   export default YourComponent;
   ```

2. **Add CSS file**
   ```css
   /* In frontend/src/Components/YourComponent/YourComponent.css */
   .your-component {
     /* Your styles */
   }
   ```

## Database Operations

### MongoDB Commands

```javascript
// Connect to MongoDB
mongo

// Switch to database
use shopsmart_dev

// View collections
show collections

// Query products
db.products.find({ category: "women" })

// Query users
db.users.find({ email: "user@example.com" })

// Query carts
db.carts.find({ user: ObjectId("user_id") })
```

### Database Schema Updates

1. **Update model file**
   ```javascript
   // In backend/models/YourModel.js
   const yourSchema = new mongoose.Schema({
     // Add new fields
     newField: {
       type: String,
       required: false
     }
   });
   ```

2. **Create migration script**
   ```javascript
   // In backend/scripts/migrate.js
   const updateDocuments = async () => {
     await YourModel.updateMany(
       { newField: { $exists: false } },
       { $set: { newField: "default_value" } }
     );
   };
   ```

## Debugging

### Frontend Debugging

1. **Browser Developer Tools**
   - Use React Developer Tools extension
   - Check console for errors
   - Monitor network requests

2. **React Context Debugging**
   ```javascript
   // Add to components
   console.log('Context state:', { user, isAuthenticated });
   ```

### Backend Debugging

1. **Server Logs**
   ```bash
   cd shopsmart/backend
   npm run dev
   # Check terminal output for errors
   ```

2. **Database Debugging**
   ```javascript
   // Add to route handlers
   console.log('Database query result:', result);
   ```

### Common Issues

1. **CORS Errors**
   - Check backend CORS configuration
   - Verify frontend API base URL

2. **Authentication Issues**
   - Check JWT token in localStorage
   - Verify token expiration
   - Check auth middleware

3. **Database Connection**
   - Ensure MongoDB is running
   - Check connection string
   - Verify database permissions

## Performance Optimization

### Frontend Optimization

1. **Code Splitting**
   ```javascript
   // Use React.lazy for route-based splitting
   const Product = React.lazy(() => import('./Pages/Product'));
   ```

2. **Image Optimization**
   - Use WebP format
   - Implement lazy loading
   - Optimize image sizes

3. **Bundle Optimization**
   ```bash
   npm run build
   # Analyze bundle size
   npm run analyze
   ```

### Backend Optimization

1. **Database Indexing**
   ```javascript
   // Add indexes for frequently queried fields
   db.products.createIndex({ "category": 1 });
   db.carts.createIndex({ "user": 1 });
   ```

2. **Caching**
   - Implement Redis for session storage
   - Cache frequently accessed data
   - Use CDN for static assets

## Security Best Practices

### Frontend Security

1. **Input Validation**
   - Validate all user inputs
   - Sanitize data before sending to API
   - Use proper form validation

2. **Authentication**
   - Store tokens securely
   - Implement token refresh
   - Handle logout properly

### Backend Security

1. **Input Validation**
   ```javascript
   // Use Joi for request validation
   const schema = Joi.object({
     email: Joi.string().email().required(),
     password: Joi.string().min(6).required()
   });
   ```

2. **Authentication**
   - Implement proper JWT handling
   - Use secure token storage
   - Implement rate limiting

3. **Database Security**
   - Use parameterized queries
   - Validate all inputs
   - Implement proper access controls

## Contributing Guidelines

### Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Write/update tests**
5. **Update documentation**
6. **Submit pull request**

### Commit Message Format

```
type(scope): description

feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

### Code Review Checklist

- [ ] Code follows project standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance impact considered
- [ ] Cross-browser compatibility tested

## Resources

### Documentation
- [React Documentation](https://reactjs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

### Tools
- [VS Code Extensions](https://marketplace.visualstudio.com/)
- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI

### Learning Resources
- [React Tutorial](https://reactjs.org/tutorial/tutorial.html)
- [Node.js Tutorial](https://nodejs.org/en/learn/)
- [MongoDB Tutorial](https://docs.mongodb.com/manual/tutorial/)

## Support

For development questions:
- Check existing documentation
- Search existing issues
- Create a new issue with detailed description
- Contact the development team

## License

This project is licensed under the MIT License. See LICENSE file for details.
