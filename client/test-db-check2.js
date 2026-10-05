const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb://localhost:27017/directcrest');
  const cat = await mongoose.connection.db.collection('categories').findOne({ name: 'Smartphones & Tablets' });
  console.log('Cat ID:', cat._id);
  
  const products = await mongoose.connection.db.collection('products').find({ categoryId: cat._id }).toArray();
  console.log('Products found by object ID:', products.length);

  const productsAll = await mongoose.connection.db.collection('products').find({}).toArray();
  console.log('Total products:', productsAll.length);
  if (productsAll.length > 0) {
    console.log('Sample product categoryId type:', typeof productsAll[0].categoryId, productsAll[0].categoryId);
  }
  process.exit(0);
}
check();
