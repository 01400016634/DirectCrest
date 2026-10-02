// @ts-nocheck
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });
const MONGODB_URI = process.env.MONGODB_URI;

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  retailPrice: { type: Number, required: true },
  wholesalePrice: { type: Number },
  cost: { type: Number },
  stock: { type: Number, default: 0 },
  brand: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  threeDModelUrl: { type: String },
  glbModelPath: { type: String },
  imageUrl: { type: String },
  status: { type: String, default: 'PUBLISHED' },
  condition: { type: String, default: 'NEW' },
}, { timestamps: true });
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');
    
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    const productsData = JSON.parse(fs.readFileSync('parsed121.json', 'utf8'));
    const catMap = {};
    for (const p of productsData) {
      if (!catMap[p.category]) {
        const newCat = await Category.create({
          name: p.category,
          slug: p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: `Explore our collection of ${p.category}`
        });
        catMap[p.category] = newCat._id;
        console.log(`Created category: ${p.category}`);
      }
    }

    let addedCount = 0;
    for (const p of productsData) {
      const sku = `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const modelUrl = `/3d_models/${p.file}`;
      
      const brand = p.name.split(' ')[0] || 'Generic';

      const newProduct = new Product({
        name: p.name,
        description: p.desc,
        sku: sku,
        brand: brand,
        retailPrice: p.price,
        wholesalePrice: p.price * 0.8,
        cost: p.price * 0.5,
        stock: 500,
        category: catMap[p.category],
        threeDModelUrl: modelUrl,
        glbModelPath: modelUrl,
        imageUrl: '/images/placeholder.png',
        status: 'PUBLISHED',
        condition: 'NEW'
      });
      await newProduct.save();
      addedCount++;
      console.log(`+ Added: ${p.name}`);
    }
    console.log(`\n🎉 Success! Added ${addedCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
seedData();
