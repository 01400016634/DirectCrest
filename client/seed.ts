import mongoose from 'mongoose';
import { Category, Product } from './src/lib/models/Schema';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../server/.env') });
dotenv.config({ path: path.resolve(__dirname, '.env.local') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Create Categories
    const categoriesData = [
      { name: 'Electronics' },
      { name: 'Home & Kitchen' },
      { name: 'Fashion' },
      { name: 'Beauty & Personal Care' },
      { name: 'Sports & Outdoors' },
      { name: 'Toys & Games' },
      { name: 'Automotive' },
      { name: 'Tools & Home Improvement' },
    ];

    console.log('Clearing existing categories...');
    await Category.deleteMany({});
    
    console.log('Inserting categories...');
    const categories = await Category.insertMany(categoriesData);
    console.log(`Inserted ${categories.length} categories.`);

    // Map categories by name for easy reference
    const catMap = categories.reduce((acc, cat) => {
      acc[cat.name] = cat._id;
      return acc;
    }, {} as Record<string, any>);

    // Create Products
    const productsData = [
      {
        name: 'Wireless Noise-Canceling Headphones',
        description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound.',
        sku: 'ELEC-HP-001',
        categoryId: catMap['Electronics'],
        retailPrice: 199.99,
        wholesaleStartingPrice: 120.00,
        wholesaleTiers: [
          { minQuantity: 10, price: 110.00 },
          { minQuantity: 50, price: 95.00 },
          { minQuantity: 100, price: 80.00 }
        ],
        condition: 'NEW',
        status: 'PUBLISHED',
        stock: 500,
        weight: 0.8,
        isFeatured: true,
        isTrending: true,
        isNewArrival: true,
        rating: 4.8,
        numReviews: 124
      },
      {
        name: 'Smart Home Security Camera',
        description: '1080p HD indoor/outdoor security camera with night vision, two-way audio, and motion detection.',
        sku: 'ELEC-CAM-002',
        categoryId: catMap['Electronics'],
        retailPrice: 89.99,
        wholesaleStartingPrice: 50.00,
        wholesaleTiers: [
          { minQuantity: 20, price: 45.00 },
          { minQuantity: 100, price: 38.00 }
        ],
        condition: 'NEW',
        status: 'PUBLISHED',
        stock: 1200,
        weight: 0.5,
        isFeatured: false,
        isTrending: true,
        isNewArrival: false,
        rating: 4.5,
        numReviews: 312
      },
      {
        name: 'Stainless Steel Chef Knife Set',
        description: 'Professional-grade 5-piece kitchen knife set with high-carbon stainless steel blades and ergonomic handles.',
        sku: 'HOME-KN-003',
        categoryId: catMap['Home & Kitchen'],
        retailPrice: 129.99,
        wholesaleStartingPrice: 75.00,
        wholesaleTiers: [
          { minQuantity: 10, price: 65.00 },
          { minQuantity: 50, price: 55.00 }
        ],
        condition: 'NEW',
        status: 'PUBLISHED',
        stock: 300,
        weight: 1.2,
        isFeatured: true,
        isTrending: false,
        isNewArrival: true,
        rating: 4.9,
        numReviews: 89
      },
      {
        name: 'Yoga Mat with Alignment Lines',
        description: 'Eco-friendly TPE yoga mat with non-slip texture and body alignment system. Includes carrying strap.',
        sku: 'SPORT-YM-004',
        categoryId: catMap['Sports & Outdoors'],
        retailPrice: 35.00,
        wholesaleStartingPrice: 18.00,
        wholesaleTiers: [
          { minQuantity: 50, price: 15.00 },
          { minQuantity: 200, price: 12.00 }
        ],
        condition: 'NEW',
        status: 'PUBLISHED',
        stock: 2000,
        weight: 1.0,
        isFeatured: false,
        isTrending: true,
        isNewArrival: true,
        rating: 4.6,
        numReviews: 421
      },
      {
        name: 'Organic Vitamin C Serum',
        description: 'Anti-aging facial serum with hyaluronic acid, vitamin E, and natural botanical extracts. 1 oz bottle.',
        sku: 'BEAUTY-VC-005',
        categoryId: catMap['Beauty & Personal Care'],
        retailPrice: 24.99,
        wholesaleStartingPrice: 12.00,
        wholesaleTiers: [
          { minQuantity: 100, price: 9.50 },
          { minQuantity: 500, price: 7.00 }
        ],
        condition: 'NEW',
        status: 'PUBLISHED',
        stock: 5000,
        weight: 0.1,
        isFeatured: true,
        isTrending: true,
        isNewArrival: false,
        rating: 4.7,
        numReviews: 856
      },
      {
        name: 'Men\'s Polarized Sunglasses',
        description: 'Classic aviator style sunglasses with polarized lenses, UV400 protection, and lightweight alloy frame.',
        sku: 'FASH-SG-006',
        categoryId: catMap['Fashion'],
        retailPrice: 45.00,
        wholesaleStartingPrice: 20.00,
        wholesaleTiers: [
          { minQuantity: 50, price: 16.00 },
          { minQuantity: 250, price: 12.50 }
        ],
        condition: 'NEW',
        status: 'PUBLISHED',
        stock: 800,
        weight: 0.2,
        isFeatured: false,
        isTrending: false,
        isNewArrival: true,
        rating: 4.4,
        numReviews: 67
      },
      {
        name: 'Portable Power Bank 20000mAh',
        description: 'High-capacity external battery pack with fast charging, dual USB outputs, and LED display.',
        sku: 'ELEC-PB-007',
        categoryId: catMap['Electronics'],
        retailPrice: 39.99,
        wholesaleStartingPrice: 22.00,
        wholesaleTiers: [
          { minQuantity: 100, price: 18.00 },
          { minQuantity: 1000, price: 14.50 }
        ],
        condition: 'NEW',
        status: 'PUBLISHED',
        stock: 3500,
        weight: 0.4,
        isFeatured: true,
        isTrending: true,
        isNewArrival: false,
        rating: 4.8,
        numReviews: 1205
      },
      {
        name: 'Silicone Kitchen Utensil Set',
        description: '12-piece heat-resistant silicone cooking utensils with natural wooden handles and storage barrel.',
        sku: 'HOME-KU-008',
        categoryId: catMap['Home & Kitchen'],
        retailPrice: 32.99,
        wholesaleStartingPrice: 16.00,
        wholesaleTiers: [
          { minQuantity: 50, price: 13.50 },
          { minQuantity: 300, price: 10.00 }
        ],
        condition: 'NEW',
        status: 'PUBLISHED',
        stock: 600,
        weight: 1.5,
        isFeatured: false,
        isTrending: true,
        isNewArrival: true,
        rating: 4.5,
        numReviews: 243
      }
    ];

    console.log('Clearing existing products...');
    await Product.deleteMany({});

    console.log('Inserting products...');
    const products = await Product.insertMany(productsData);
    console.log(`Inserted ${products.length} products.`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
