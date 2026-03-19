# ShopSmart E-commerce Application
## Data Dictionary

## Overview

This data dictionary documents all data structures, entities, relationships, and business rules used in the ShopSmart e-commerce application. The system uses MongoDB with Mongoose ODM for data modeling and validation.

## Entity Relationship Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      User       │    │     Product     │    │      Cart       │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ _id (PK)        │    │ _id (PK)        │    │ _id (PK)        │
│ name            │    │ name            │    │ user (FK)       │
│ email           │    │ category        │    │ items[]         │
│ password        │    │ image           │    │ total           │
│ googleId        │    │ new_price       │    │ createdAt       │
│ avatar          │    │ old_price       │    │ updatedAt       │
│ isVerified      │    │ sizes[]         │    └─────────────────┘
│ authToken       │    │ availableSizes[]│              │
│ tokenExpires    │    │ date            │              │
│ createdAt       │    │ available       │              │
└─────────────────┘    └─────────────────┘              │
         │                       │                      │
         │                       │                      │
         └───────────────────────┼──────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────┐
                    │   CartItem      │
                    │   (Embedded)    │
                    ├─────────────────┤
                    │ product (FK)    │
                    │ quantity        │
                    │ size            │
                    │ price           │
                    └─────────────────┘
```

## Data Entities

### 1. User Entity
**Purpose**: Stores user account information and authentication data
**Collection**: `users`

### 2. Product Entity
**Purpose**: Manages product catalog with pricing and availability
**Collection**: `products`

### 3. Cart Entity
**Purpose**: Manages user shopping carts and cart items
**Collection**: `carts`

### 4. CartItem Entity (Embedded)
**Purpose**: Individual items within a user's shopping cart
**Embedded In**: Cart Entity

## Field Definitions

### User Entity Fields

| Field Name | Data Type | Size | Required | Default | Description |
|------------|-----------|------|----------|---------|-------------|
| `_id` | ObjectId | 24 chars | Yes | Auto | Unique identifier |
| `name` | String | 100 chars | Yes | - | Full name |
| `email` | String | 255 chars | Yes | - | Email address (unique) |
| `password` | String | 255 chars | No* | - | Encrypted password |
| `googleId` | String | 255 chars | No | null | Google OAuth ID |
| `avatar` | String | 500 chars | No | null | Profile picture URL |
| `isVerified` | Boolean | - | No | false | Email verification |
| `authToken` | String | 500 chars | No | null | JWT token |
| `tokenExpires` | Date | ISO 8601 | No | null | Token expiry |
| `createdAt` | Date | ISO 8601 | No | Current | Creation timestamp |

*Required unless using Google OAuth

### Product Entity Fields

| Field Name | Data Type | Size | Required | Default | Description |
|------------|-----------|------|----------|---------|-------------|
| `_id` | ObjectId | 24 chars | Yes | Auto | Unique identifier |
| `name` | String | 200 chars | Yes | - | Product name |
| `category` | String | 50 chars | Yes | - | Category (men/women/kid) |
| `image` | String | 500 chars | Yes | - | Product image URL |
| `new_price` | Number | Decimal | Yes | - | Current price |
| `old_price` | Number | Decimal | Yes | - | Original price |
| `sizes` | Array[String] | 10 items | No | ['S','M','L','XL','XXL'] | Available sizes |
| `availableSizes` | Array[String] | 10 items | No | ['S','M','L','XL','XXL'] | In-stock sizes |
| `date` | Date | ISO 8601 | No | Current | Listing date |
| `available` | Boolean | - | No | true | Availability status |

### Cart Entity Fields

| Field Name | Data Type | Size | Required | Default | Description |
|------------|-----------|------|----------|---------|-------------|
| `_id` | ObjectId | 24 chars | Yes | Auto | Unique identifier |
| `user` | ObjectId | 24 chars | Yes | - | User reference |
| `items` | Array[CartItem] | Unlimited | Yes | [] | Cart items |
| `total` | Number | Decimal | No | 0 | Cart total |
| `createdAt` | Date | ISO 8601 | No | Current | Creation time |
| `updatedAt` | Date | ISO 8601 | No | Current | Update time |

### CartItem Entity Fields (Embedded)

| Field Name | Data Type | Size | Required | Default | Description |
|------------|-----------|------|----------|---------|-------------|
| `product` | ObjectId | 24 chars | Yes | - | Product reference |
| `quantity` | Number | Integer | Yes | 1 | Item quantity |
| `size` | String | 10 chars | Yes | 'S' | Selected size |
| `price` | Number | Decimal | Yes | - | Item price |

## Business Rules

### User Management
1. **Email Uniqueness**: Each email can only have one account
2. **Authentication**: Email/password OR Google OAuth (not both required)
3. **Password**: Minimum 6 characters for email/password auth
4. **Token Management**: JWT tokens with expiration times
5. **Profile**: Name and email required for account creation

### Product Management
1. **Categories**: Must be 'men', 'women', or 'kid'
2. **Pricing**: New price ≤ old price
3. **Sizes**: Available sizes ⊆ all possible sizes
4. **Images**: All products must have image URLs
5. **Availability**: Products can be marked available/unavailable

### Cart Management
1. **User Association**: One cart per user
2. **Item Uniqueness**: No duplicate product+size combinations
3. **Quantity**: Minimum 1 for all items
4. **Price Consistency**: Cart prices reflect product prices at addition
5. **Total Calculation**: Auto-calculated from item totals
6. **Size Validation**: Cart sizes must be available for product

### Data Integrity
1. **References**: Cart items must reference valid products
2. **Ownership**: Users can only access their own carts
3. **Consistency**: Cart totals = sum of item totals
4. **Timestamps**: Auto-managed creation and update times

## Data Validation Rules

### User Validation
```javascript
name: { type: String, required: true, maxlength: 100 }
email: { type: String, required: true, unique: true, match: email_regex }
password: { type: String, minlength: 6, required: function() { return !this.googleId; } }
```

### Product Validation
```javascript
category: { type: String, required: true, enum: ['men', 'women', 'kid'] }
new_price: { type: Number, required: true, min: 0 }
availableSizes: { validate: function(sizes) { return sizes.every(s => this.sizes.includes(s)); } }
```

### Cart Validation
```javascript
user: { type: ObjectId, ref: 'User', required: true, unique: true }
items: { type: [cartItemSchema], default: [] }
total: { type: Number, default: 0, min: 0 }
```

## Indexes and Performance

### Primary Indexes
- **Users**: `_id`, `email` (unique), `googleId` (sparse), `authToken`
- **Products**: `_id`, `category`, `available`, `name` (text)
- **Carts**: `_id`, `user` (unique)

### Performance Optimizations
1. **Query Optimization**: Indexes on frequently queried fields
2. **Aggregation**: Efficient cart total calculations
3. **Projection**: Select only required fields
4. **Connection Pooling**: Optimized database connections
5. **Caching**: Session data caching

## Data Flow

### User Registration
```
Input → Validation → Password Hash → User Creation → JWT Token
Google OAuth → Verification → Account Creation → Session Management
```

### Product Management
```
Creation → Validation → Image Upload → Storage → Catalog Update
Update → Validation → Database Update → Cache Invalidation → UI Refresh
```

### Cart Management
```
Add Item → Product Validation → Size Check → Cart Update → Total Recalc
Modify → Item Validation → Quantity Update → Total Recalc → UI Update
Retrieve → Auth Check → Cart Load → Item Population → Display
```

### Payment Processing
```
Checkout → Cart Validation → Payment Gateway → Transaction → Order Creation
Verification → Receipt → Cart Clear → Order Confirmation
```

## Data Security

### Encryption
- **Passwords**: bcrypt hashing with salt
- **Tokens**: JWT with expiration and refresh
- **Transmission**: HTTPS encryption
- **Storage**: PII encryption at rest

### Access Control
- **Authentication**: JWT-based tokens
- **Authorization**: Role-based access (User/Admin)
- **Sessions**: Secure session management
- **API Security**: Rate limiting and validation

### Privacy
- **GDPR**: User data rights and deletion
- **Minimization**: Collect only necessary data
- **Consent**: User consent management
- **Retention**: Automatic data cleanup

## Data Backup

### Backup Strategy
- **Daily Backups**: Automated database backups
- **Incremental**: Hourly incremental backups
- **Verification**: Regular backup integrity checks
- **Offsite**: Secure cloud storage

### Recovery
- **Point-in-Time**: Restore to specific timestamps
- **Validation**: Post-recovery data checks
- **Automation**: Service recovery procedures
- **Communication**: Service status notifications

---

*This data dictionary provides comprehensive documentation of all data structures, relationships, and business rules for the ShopSmart e-commerce application.*
