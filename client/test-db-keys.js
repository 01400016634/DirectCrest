const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb://localhost:27017/directcrest');
  const prod = await mongoose.connection.db.collection('products').findOne({});
  console.log('Product keys:', Object.keys(prod));
  console.log('category key:', prod.category, typeof prod.category);
  console.log('categoryId key:', prod.categoryId, typeof prod.categoryId);
  process.exit(0);
}
check();
