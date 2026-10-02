import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Define the Category schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

// Define the product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  retailPrice: { type: Number, required: true },
  wholesalePrice: { type: Number },
  cost: { type: Number },
  stock: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String },
  imageUrl: { type: String },
  threeDModelUrl: { type: String },
  isPublished: { type: Boolean, default: true },
  condition: { type: String, enum: ['New', 'Refurbished', 'Used'], default: 'New' },
  status: { type: String, enum: ['Active', 'Draft', 'Archived'], default: 'Active' }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const productsData = [
  {
    brand: "Apple",
    name: "iPhone 18 Pro Max Heritage (512GB)",
    description: "Experience the ultimate iPhone with a heritage burgundy finish.",
    retailPrice: 760.00,
    wholesalePrice: 760.00 * 0.8,
    cost: 760.00 * 0.6,
    threeDModelUrl: "3d_models/apple_iphone_18_pro_max_burgundy_2026.glb"
  },
  {
    brand: "Apple",
    name: "iPhone 17 Pro Max (512GB)",
    description: "The pro standard with advanced cameras.",
    retailPrice: 720.00,
    wholesalePrice: 720.00 * 0.8,
    cost: 720.00 * 0.6,
    threeDModelUrl: "3d_models/phone_17_pro_max.glb"
  },
  {
    brand: "Apple",
    name: "iPhone 17 Pro Titanium Black",
    description: "Premium titanium finish.",
    retailPrice: 610.00,
    wholesalePrice: 610.00 * 0.8,
    cost: 610.00 * 0.6,
    threeDModelUrl: "3d_models/apple_iphone_17_pro_6.3.glb"
  },
  {
    brand: "Apple",
    name: "iPhone 17 Air Ultra-Slim",
    description: "Incredibly thin and lightweight.",
    retailPrice: 510.00,
    wholesalePrice: 510.00 * 0.8,
    cost: 510.00 * 0.6,
    threeDModelUrl: "3d_models/iphone_17_air_concept.glb"
  },
  {
    brand: "Apple",
    name: "iPhone 16 Pro Max (256GB)",
    description: "Powerful performance in a large form factor.",
    retailPrice: 580.00,
    wholesalePrice: 580.00 * 0.8,
    cost: 580.00 * 0.6,
    threeDModelUrl: "3d_models/iphone_16_pro_max.glb"
  },
  {
    brand: "Apple",
    name: "iPad Pro M-Series (11-inch)",
    description: "The ultimate iPad experience.",
    retailPrice: 460.00,
    wholesalePrice: 460.00 * 0.8,
    cost: 460.00 * 0.6,
    threeDModelUrl: "3d_models/apple_ipad_pro.glb"
  },
  {
    brand: "Nothing",
    name: "Phone (4a) Transparent Concept",
    description: "Unique transparent design.",
    retailPrice: 240.00,
    wholesalePrice: 240.00 * 0.8,
    cost: 240.00 * 0.6,
    threeDModelUrl: "3d_models/nothing_4a_3d_model.glb"
  },
  {
    brand: "OnePlus",
    name: "13S Flagship (16GB/512GB)",
    description: "Unmatched speed and multitasking.",
    retailPrice: 380.00,
    wholesalePrice: 380.00 * 0.8,
    cost: 380.00 * 0.6,
    threeDModelUrl: "3d_models/one_plus_13s_3d_model.glb"
  },
  {
    brand: "Realme",
    name: "12 5G (8GB/128GB)",
    description: "Affordable 5G connectivity.",
    retailPrice: 125.00,
    wholesalePrice: 125.00 * 0.8,
    cost: 125.00 * 0.6,
    threeDModelUrl: "3d_models/realme_12_5g.glb"
  },
  {
    brand: "Samsung",
    name: "Galaxy Z Fold 7 Concept",
    description: "The future of folding phones.",
    retailPrice: 820.00,
    wholesalePrice: 820.00 * 0.8,
    cost: 820.00 * 0.6,
    threeDModelUrl: "3d_models/samsung_galaxy_z_fold_7.glb"
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected to MongoDB');

    let category = await Category.findOne({ name: 'Smartphones & Tablets' });
    if (!category) {
      category = await Category.create({
        name: 'Smartphones & Tablets',
        slug: 'smartphones-tablets',
        description: 'Latest smartphones and tablets.'
      });
      console.log('Created Smartphones & Tablets category');
    } else {
      console.log('Found Smartphones & Tablets category');
    }

    for (const item of productsData) {
      const sku = `SMT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const exists = await Product.findOne({ name: item.name });
      if (exists) {
        console.log(`Product ${item.name} already exists. Skipping.`);
        continue;
      }

      await Product.create({
        ...item,
        sku,
        stock: 50,
        category: category._id,
        imageUrl: '/images/placeholder.png', // Fallback
      });
      console.log(`Added product: ${item.name}`);
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
