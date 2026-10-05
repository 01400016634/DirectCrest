const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb://localhost:27017/directcrest');
  const cat = await mongoose.connection.db.collection('categories').findOne({});
  console.log('Sample category:', cat);
  const prod = await mongoose.connection.db.collection('products').findOne({});
  console.log('Sample product categoryId:', prod.categoryId, 'type:', typeof prod.categoryId);
  
  const count = await mongoose.connection.db.collection('products').countDocuments({ categoryId: cat._id });
  console.log('Products in category', cat.name, ':', count);
  
  // also check category string vs ObjectId
  process.exit(0);
}
check();
