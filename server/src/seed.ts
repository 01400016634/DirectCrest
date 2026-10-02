import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { 
  Country, Currency, Language, Category, Product, Supplier, Role
} from './models/Schema.js';

dotenv.config();

// DO NOT hardcode production URIs. Use environment variables.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/directcrest';

async function seed() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    // Only clearing specific collections for a safe restart
    console.log('🧹 Clearing old seed data...');
    await Country.deleteMany({});
    await Currency.deleteMany({});
    await Language.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Role.deleteMany({});
    // Supplier costs remain empty/unseeded intentionally to avoid leaking fake data

    console.log('🛡️  Seeding Roles...');
    await Role.insertMany([
      { name: 'CUSTOMER' },
      { name: 'WHOLESALE_CUSTOMER' },
      { name: 'ADMIN' },
      { name: 'SUPER_ADMIN' },
      { name: 'PRODUCT_MANAGER' },
      { name: 'ORDER_MANAGER' },
      { name: 'SHIPPING_MANAGER' },
      { name: 'FINANCE_MANAGER' },
      { name: 'SUPPORT_AGENT' }
    ]);

    console.log('🌍 Seeding Countries...');
    await Country.insertMany([
      { code: 'BD', name: 'Bangladesh' },
      { code: 'IN', name: 'India' },
      { code: 'PK', name: 'Pakistan' },
      { code: 'CN', name: 'China' },
      { code: 'AE', name: 'UAE' },
      { code: 'US', name: 'USA' },
      { code: 'GB', name: 'UK' },
      { code: 'JP', name: 'Japan' },
    ]);

    console.log('💵 Seeding Currencies...');
    await Currency.insertMany([
      { code: 'USD', symbol: '$' },
      { code: 'BDT', symbol: '৳' },
      { code: 'INR', symbol: '₹' },
      { code: 'PKR', symbol: '₨' },
      { code: 'CNY', symbol: '¥' },
      { code: 'AED', symbol: 'د.إ' },
      { code: 'GBP', symbol: '£' },
      { code: 'JPY', symbol: '¥' },
    ]);

    console.log('🗣️  Seeding Languages...');
    await Language.insertMany([
      { code: 'en', name: 'English' },
      { code: 'bn', name: 'Bengali' },
      { code: 'hi', name: 'Hindi' },
      { code: 'ur', name: 'Urdu' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ar', name: 'Arabic' },
      { code: 'ja', name: 'Japanese' },
    ]);

    console.log('📂 Seeding Categories...');
    const category = await Category.create({ name: 'Office Furniture' });

    console.log('📦 Seeding Demo Product...');
    await Product.create({
      sku: 'DEMO-CHAIR-001',
      categoryId: category._id,
      retailPrice: 249.99,
      wholesaleStartingPrice: 150.00, // Safe placeholder (NOT private supplier cost)
      condition: 'NEW',
      stock: 500
    });

    console.log('✨ Seed completed successfully!');
    console.log('NOTE: Supplier costs have intentionally not been seeded to keep fake private data out of the system.');

  } catch (error) {
    console.error('❌ Error during seed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

seed();
