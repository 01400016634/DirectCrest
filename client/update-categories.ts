import mongoose from 'mongoose';
import { Category } from './src/lib/models/Schema';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const categoryMapping = {
  'Consumer Electronics': 'Electronics & Gadgets',
  'Auto & Motorcycle Parts': 'Automotive & Bike Accessories',
  'Apparel & Accessories': 'Fashion & Clothing',
  'Health & Medical Supplies': 'Health & Beauty',
  'Industrial Machinery & Parts': 'production mechine',
  'Green & Renewable Energy': 'Home & Kitchen (Problem-Solving Gadgets)',
  'Plastics, Chemicals & Raw Materials': 'Baby & Kids Products'
};

async function updateCategories() {
  await --mongoose.connect(MONGODB_URI!);
  console.log('Connected to DB');

  for (const [oldName, newName] of Object.entries(categoryMapping)) {
    const updated = await Category.findOneAndUpdate(
      { name: oldName },
      { $set: { name: newName } },
      { new: true }
    );
    if (updated) {
      console.log(`Renamed "${oldName}" to "${newName}"`);
    } else {
      // If it doesn't exist, create it
      const exists = await Category.findOne({ name: newName });
      if (!exists) {
        await Category.create({ name: newName });
        console.log(`Created new category: "${newName}"`);
      }
    }
  }

  // Remove any categories that are not in the new list
  const newNames = Object.values(categoryMapping);
  const deleted = await Category.deleteMany({ name: { $nin: newNames } });
  console.log(`Deleted ${deleted.deletedCount} unmapped categories.`);

  console.log('Done!');
  process.exit(0);
}

updateCategories().catch(err => {
  console.error(err);
  process.exit(1);
});
