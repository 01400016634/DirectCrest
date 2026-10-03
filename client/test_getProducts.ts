import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '/Users/user/Documents/DirectCrest/client/.env' });
import { Product } from './src/lib/models/Schema';

async function test() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected to MongoDB");
  try {
    const products = await Product.find({}).populate('category').populate('brand').limit(10).lean();
    console.log("Found", products.length, "products");
    if (products.length > 0) console.log(products[0]);
  } catch(e) {
    console.error("Error:", e);
  }
  process.exit(0);
}
test();
