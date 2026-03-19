# ShopSmart JSX Data Dictionary

## Context Files

### AuthContext.jsx
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| user | Object | Current user data | {name: "John", email: "john@example.com"} |
| token | String | JWT token | "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." |
| loading | Boolean | Loading state | false |
| login | Function | Login handler | login(userData, token) |
| logout | Function | Logout handler | logout() |
| isAuthenticated | Boolean | Auth status | true |

### ShopContext.jsx
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| all_product | Array | All products | [{id: 1, name: "Dress", price: 120}] |
| cartItems | Object | Cart items | {"1_S": {quantity: 2, size: "S"}} |
| cartLoading | Boolean | Cart loading | false |
| addTocart | Function | Add to cart | addTocart(productId, size) |
| getTotalCartItems | Function | Get cart count | getTotalCartItems() |

## Page Components

### LoginSignup.jsx
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| state | String | Form state | "Login" |
| formData | Object | Form inputs | {username: "", password: "", email: ""} |
| isLoading | Boolean | Loading state | false |
| message | String | Status message | "Login successful!" |
| changeHandler | Function | Input handler | changeHandler(e) |
| loginHandler | Function | Login submit | loginHandler() |

### Shop.jsx
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| category | String | Product category | "men" |
| products | Array | Filtered products | [{id: 1, name: "Shirt"}] |
| loading | Boolean | Loading state | false |

### Product.jsx
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | String | Product ID | "123" |
| product | Object | Product data | {id: 123, name: "Dress"} |
| loading | Boolean | Loading state | false |

### Cart.jsx
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| cartItems | Array | Cart items | [{product: {...}, quantity: 2}] |
| total | Number | Cart total | 240.00 |
| updateQuantity | Function | Update quantity | updateQuantity(id, size, qty) |

## UI Components

### Navbar.jsx
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| menu | String | Active menu | "home" |
| logo | String | Logo path | "../../assets/s.png" |
| cart_icon | String | Cart icon | "../../assets/cart_icon.png" |
| setMenu | Function | Set menu | setMenu("mens") |
| handleLogout | Function | Logout | handleLogout() |
| user | Object | Current user | {name: "John"} |

### ProductDisplay.jsx
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| product | Object | Product data | {id: 1, name: "Dress", price: 120} |
| selectedSize | String | Selected size | "M" |
| star_icon | String | Star icon | "../../assets/star_icon.png" |
| handleAddToCart | Function | Add to cart | handleAddToCart() |
| handleSizeSelect | Function | Select size | handleSizeSelect("L") |

### CartItems.jsx
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | String | Product ID | "123" |
| name | String | Product name | "Elegant Dress" |
| image | String | Product image | "/product.jpg" |
| new_price | Number | Price | 120.00 |
| size | String | Size | "M" |
| quantity | Number | Quantity | 2 |
| removeFromCart | Function | Remove item | removeFromCart(id, size) |

## Feature Components

### Payment.jsx
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| amount | Number | Payment amount | 1200 |
| currency | String | Currency | "INR" |
| receipt | String | Receipt ID | "order_123" |
| loading | Boolean | Loading state | false |
| orderId | String | Order ID | "order_abc123" |
| createOrder | Function | Create order | createOrder(amount) |
| handlePayment | Function | Process payment | handlePayment(response) |

### RazorpayButton.jsx
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| amount | Number | Payment amount | 1200 |
| productName | String | Product name | "Elegant Dress" |
| buttonText | String | Button text | "BUY NOW" |
| onSuccess | Function | Success handler | onSuccess(response) |
| onFailure | Function | Failure handler | onFailure(error) |
| loading | Boolean | Loading state | false |

### GoogleLogin.jsx
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| clientId | String | Google client ID | "google_client_id" |
| buttonText | String | Button text | "Sign in with Google" |
| onSuccess | Function | Success handler | onSuccess(response) |
| onFailure | Function | Failure handler | onFailure(error) |
| cookiePolicy | String | Cookie policy | "single_host_origin" |
| className | String | CSS class | "google-login-btn" |
| disabled | Boolean | Disabled state | false |

## Utility Components

### AuthDebug.jsx
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| user | Object | Current user | {name: "John"} |
| token | String | JWT token | "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." |
| isAuthenticated | Boolean | Auth status | true |
| loading | Boolean | Loading state | false |
| addTocart | Function | Add to cart | addTocart(productId, size) |
| testAddToCart | Function | Test cart | testAddToCart() |

### Products.jsx
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| products | Array | Products to display | [{id: 1, name: "Dress"}] |
| loading | Boolean | Loading state | false |
| category | String | Product category | "women" |
| handleProductClick | Function | Product click | handleProductClick(productId) |

### About.jsx
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| title | String | About title | "About ShopSmart" |
| content | String | About content | "ShopSmart is a leading..." |
| image | String | About image | "../../assets/about.jpg" |

### Contact.jsx
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| formData | Object | Contact form | {name: "", email: "", message: ""} |
| loading | Boolean | Form loading | false |
| message | String | Status message | "Message sent!" |
| handleSubmit | Function | Form submit | handleSubmit(e) |
| handleChange | Function | Form change | handleChange(e) |

## Data Flow

### Authentication Flow
LoginSignup.jsx → AuthContext.jsx → API → User State → Navbar.jsx

### Product Flow
Shop.jsx → API → Products.jsx → ProductDisplay.jsx → ShopContext.jsx

### Cart Flow
ProductDisplay.jsx → ShopContext.jsx → Cart.jsx → CartItems.jsx

### Payment Flow
Cart.jsx → Payment.jsx → RazorpayButton.jsx → API → Order Confirmation

## Component Relationships

### Parent-Child
- App.jsx → Navbar.jsx + Pages + Footer.jsx
- Shop.jsx → Products.jsx → ProductDisplay.jsx
- Cart.jsx → CartItems.jsx

### Context Consumers
- Navbar.jsx: Uses AuthContext and ShopContext
- ProductDisplay.jsx: Uses ShopContext
- Cart.jsx: Uses ShopContext
- LoginSignup.jsx: Uses AuthContext
