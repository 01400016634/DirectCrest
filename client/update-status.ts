import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true }
});
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

const productSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  status: String
});
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function update() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected to MongoDB');

    const category = await Category.findOne({ name: 'Smartphones & Tablets' });
    
    if (category) {
      const result = await Product.updateMany(
        { category: category._id },
        { $set: { status: 'PUBLISHED' } }
      );
      console.log(`Updated ${result.modifiedCount} products`);
    } else {
      console.log('Category not found');
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

update();
