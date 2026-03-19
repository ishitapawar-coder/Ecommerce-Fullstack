const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

// Enhanced product data with more variety and size information
const products = [
  // Women's Clothing
  {
    name: "Elegant Evening Dress",
    category: "women",
    image: "/src/assets/p1.jfif",
    new_price: 120.0,
    old_price: 180.0,
    availableSizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: "Bodycon Party Dress",
    category: "women",
    image: "/src/assets/p2.jfif",
    new_price: 85.0,
    old_price: 130.0,
    availableSizes: ['S', 'M', 'L', 'XL']
  },
  {
    name: "Business Suit Set",
    category: "women",
    image: "/src/assets/p3.avif",
    new_price: 150.0,
    old_price: 220.0,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    name: "Summer Maxi Dress",
    category: "women",
    image: "/src/assets/1.avif",
    new_price: 65.0,
    old_price: 95.0,
    availableSizes: ['XS', 'S', 'M', 'L']
  },
  {
    name: "Athletic Wear Set",
    category: "women",
    image: "/src/assets/3.jfif",
    new_price: 75.0,
    old_price: 110.0,
    availableSizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: "Casual Blouse",
    category: "women",
    image: "/src/assets/4.avif",
    new_price: 45.0,
    old_price: 70.0,
    availableSizes: ['S', 'M', 'L', 'XL']
  },
  {
    name: "Romper Jumpsuit",
    category: "women",
    image: "/src/assets/5.avif",
    new_price: 80.0,
    old_price: 120.0,
    availableSizes: ['XS', 'S', 'M', 'L']
  },
  {
    name: "Formal Gown",
    category: "women",
    image: "/src/assets/7.jpg",
    new_price: 200.0,
    old_price: 300.0,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    name: "Crop Top",
    category: "women",
    image: "/src/assets/women7.webp",
    new_price: 35.0,
    old_price: 55.0,
    availableSizes: ['XS', 'S', 'M', 'L']
  },
  {
    name: "Pencil Skirt",
    category: "women",
    image: "/src/assets/women8.jfif",
    new_price: 60.0,
    old_price: 90.0,
    availableSizes: ['S', 'M', 'L', 'XL']
  },
  {
    name: "Winter Coat",
    category: "women",
    image: "/src/assets/p1.jfif",
    new_price: 180.0,
    old_price: 250.0,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    name: "Denim Jeans",
    category: "women",
    image: "/src/assets/p2.jfif",
    new_price: 70.0,
    old_price: 100.0,
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },

  // Men's Clothing
  {
    name: "Formal Business Suit",
    category: "men",
    image: "/src/assets/p4.jfif",
    new_price: 250.0,
    old_price: 350.0,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    name: "Casual Hoodie",
    category: "men",
    image: "/src/assets/2.webp",
    new_price: 55.0,
    old_price: 80.0,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    name: "Wool Sweater",
    category: "men",
    image: "/src/assets/6.webp",
    new_price: 95.0,
    old_price: 140.0,
    availableSizes: ['M', 'L', 'XL', 'XXL']
  },
  {
    name: "Dress Shirt",
    category: "men",
    image: "/src/assets/p1.jfif",
    new_price: 65.0,
    old_price: 95.0,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    name: "Leather Jacket",
    category: "men",
    image: "/src/assets/men7.jfif",
    new_price: 120.0,
    old_price: 180.0,
    availableSizes: ['M', 'L', 'XL', 'XXL']
  },
  {
    name: "Polo T-Shirt",
    category: "men",
    image: "/src/assets/men8.jpg",
    new_price: 40.0,
    old_price: 60.0,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    name: "Chino Pants",
    category: "men",
    image: "/src/assets/p3.avif",
    new_price: 75.0,
    old_price: 110.0,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    name: "Denim Jacket",
    category: "men",
    image: "/src/assets/p4.jfif",
    new_price: 85.0,
    old_price: 125.0,
    availableSizes: ['S', 'M', 'L', 'XL']
  },
  {
    name: "Track Suit",
    category: "men",
    image: "/src/assets/2.webp",
    new_price: 90.0,
    old_price: 130.0,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    name: "Winter Parka",
    category: "men",
    image: "/src/assets/men7.jfif",
    new_price: 160.0,
    old_price: 220.0,
    availableSizes: ['M', 'L', 'XL', 'XXL']
  },

  // Kids' Clothing
  {
    name: "Kids Denim Shirt",
    category: "kid",
    image: "/src/assets/kid1.jpg",
    new_price: 45.0,
    old_price: 65.0,
    availableSizes: ['2Y', '4Y', '6Y', '8Y', '10Y']
  },
  {
    name: "Kids Cargo Pants",
    category: "kid",
    image: "/src/assets/kid2.jfif",
    new_price: 50.0,
    old_price: 75.0,
    availableSizes: ['2Y', '4Y', '6Y', '8Y', '10Y', '12Y']
  },
  {
    name: "Kids School Uniform",
    category: "kid",
    image: "/src/assets/kid3.jfif",
    new_price: 60.0,
    old_price: 85.0,
    availableSizes: ['4Y', '6Y', '8Y', '10Y', '12Y']
  },
  {
    name: "Kids Tank Top",
    category: "kid",
    image: "/src/assets/kid4.webp",
    new_price: 25.0,
    old_price: 40.0,
    availableSizes: ['2Y', '4Y', '6Y', '8Y', '10Y']
  },
  {
    name: "Kids Formal Pants",
    category: "kid",
    image: "/src/assets/kid5.jfif",
    new_price: 55.0,
    old_price: 80.0,
    availableSizes: ['4Y', '6Y', '8Y', '10Y', '12Y']
  },
  {
    name: "Kids Winter Jacket",
    category: "kid",
    image: "/src/assets/kid6.jfif",
    new_price: 80.0,
    old_price: 120.0,
    availableSizes: ['2Y', '4Y', '6Y', '8Y', '10Y', '12Y']
  },
  {
    name: "Kids Sports Shorts",
    category: "kid",
    image: "/src/assets/kid7.webp",
    new_price: 30.0,
    old_price: 45.0,
    availableSizes: ['2Y', '4Y', '6Y', '8Y', '10Y']
  },
  {
    name: "Kids Blazer",
    category: "kid",
    image: "/src/assets/kid8.jfif",
    new_price: 70.0,
    old_price: 100.0,
    availableSizes: ['4Y', '6Y', '8Y', '10Y', '12Y']
  },
  {
    name: "Kids Summer Dress",
    category: "kid",
    image: "/src/assets/kid1.jpg",
    new_price: 40.0,
    old_price: 60.0,
    availableSizes: ['2Y', '4Y', '6Y', '8Y', '10Y']
  },
  {
    name: "Kids Hoodie",
    category: "kid",
    image: "/src/assets/kid2.jfif",
    new_price: 35.0,
    old_price: 50.0,
    availableSizes: ['2Y', '4Y', '6Y', '8Y', '10Y', '12Y']
  },

  // Accessories
  {
    name: "Leather Handbag",
    category: "accessories",
    image: "/src/assets/p1.jfif",
    new_price: 90.0,
    old_price: 130.0,
    availableSizes: ['One Size']
  },
  {
    name: "Sunglasses",
    category: "accessories",
    image: "/src/assets/p2.jfif",
    new_price: 45.0,
    old_price: 70.0,
    availableSizes: ['One Size']
  },
  {
    name: "Wristwatch",
    category: "accessories",
    image: "/src/assets/p3.avif",
    new_price: 120.0,
    old_price: 180.0,
    availableSizes: ['One Size']
  },
  {
    name: "Scarf",
    category: "accessories",
    image: "/src/assets/1.avif",
    new_price: 25.0,
    old_price: 40.0,
    availableSizes: ['One Size']
  },
  {
    name: "Belt",
    category: "accessories",
    image: "/src/assets/2.webp",
    new_price: 30.0,
    old_price: 45.0,
    availableSizes: ['S', 'M', 'L', 'XL']
  },

  // Footwear
  {
    name: "Running Shoes",
    category: "footwear",
    image: "/src/assets/3.jfif",
    new_price: 85.0,
    old_price: 120.0,
    availableSizes: ['6', '7', '8', '9', '10', '11']
  },
  {
    name: "Formal Shoes",
    category: "footwear",
    image: "/src/assets/4.avif",
    new_price: 95.0,
    old_price: 140.0,
    availableSizes: ['7', '8', '9', '10', '11', '12']
  },
  {
    name: "Casual Sneakers",
    category: "footwear",
    image: "/src/assets/5.avif",
    new_price: 65.0,
    old_price: 95.0,
    availableSizes: ['6', '7', '8', '9', '10', '11', '12']
  },
  {
    name: "High Heels",
    category: "footwear",
    image: "/src/assets/6.webp",
    new_price: 75.0,
    old_price: 110.0,
    availableSizes: ['5', '6', '7', '8', '9']
  },
  {
    name: "Kids Shoes",
    category: "footwear",
    image: "/src/assets/7.jpg",
    new_price: 45.0,
    old_price: 65.0,
    availableSizes: ['1Y', '2Y', '3Y', '4Y', '5Y']
  }
];

async function populateProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`Successfully inserted ${insertedProducts.length} products`);

    // Display the products with their IDs
    console.log('\nProducts with their MongoDB IDs:');
    insertedProducts.forEach(product => {
      console.log(`ID: ${product._id}, Name: ${product.name}, Category: ${product.category}, Price: ₹${product.new_price}, Sizes: ${product.availableSizes.join(', ')}`);
    });

    // Show category summary
    const categorySummary = {};
    insertedProducts.forEach(product => {
      categorySummary[product.category] = (categorySummary[product.category] || 0) + 1;
    });

    console.log('\n📊 Category Summary:');
    Object.entries(categorySummary).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });

    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('Error populating products:', error);
    process.exit(1);
  }
}

populateProducts();

