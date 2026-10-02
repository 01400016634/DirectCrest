const mongoose = require('mongoose');
require('dotenv').config({ path: '/Users/user/Documents/DirectCrest/client/.env' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to DB");
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  try {
    const products = await Product.find({}).limit(10).lean();
    console.log("Found", products.length, "products");
  } catch (e) {
    console.error("Error finding products:", e);
  }
  process.exit(0);
}
run();
