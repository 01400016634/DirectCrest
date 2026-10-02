import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Define the Category schema based on what's expected
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);


async function cleanup() {
  await mongoose.connect(MONGODB_URI!);
  console.log('Connected to DB');

  const newCategoryNames = [
    'Home & Furniture',
    'Medical & Office Equipment',
    'Bags, Travel & Outdoor',
    'Fashion, Footwear & Accessories',
    'Laptops, Wearables & Gadgets',
    'Toys, RC & Die-Cast Collectibles'
  ];

  // Find all categories NOT in the new list
  const oldCategories = await Category.find({ name: { $nin: newCategoryNames } });
  const oldCategoryIds = oldCategories.map(c => c._id);
  
  if (oldCategoryIds.length > 0) {
    // Delete all products in old categories
    const deletedProducts = await Product.deleteMany({ category: { $in: oldCategoryIds } });
    console.log(`Deleted ${deletedProducts.deletedCount} old products.`);
    
    // Delete old categories
    const deletedCats = await Category.deleteMany({ _id: { $in: oldCategoryIds } });
    console.log(`Deleted ${deletedCats.deletedCount} old categories.`);
  } else {
    console.log('No old categories found to delete.');
  }

  console.log('Done!');
  process.exit(0);
}

cleanup().catch(err => {
  console.error(err);
  process.exit(1);
});
