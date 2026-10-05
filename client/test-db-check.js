const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb://localhost:27017/directcrest');
  const prod = await mongoose.connection.db.collection('products').findOne({});
  console.log('Product keys:', Object.keys(prod));
  console.log('categoryId key:', prod.categoryId, typeof prod.categoryId);
  
  const cat = await mongoose.connection.db.collection('categories').findOne({ _id: prod.categoryId });
  console.log('Found category?', !!cat);

  const filterCount = await mongoose.connection.db.collection('products').countDocuments({ status: 'PUBLISHED' });
  console.log('Total PUBLISHED products:', filterCount);

  process.exit(0);
}
check();
