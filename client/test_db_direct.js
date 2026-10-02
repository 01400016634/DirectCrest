const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://reajulhasan3230_db_user:oWzhul79tjCDCG8E@ac-qipxgo4-shard-00-00.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-01.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-02.ddoczsm.mongodb.net:27017/directcrest?ssl=true&replicaSet=atlas-xf9mi7-shard-0&authSource=admin&appName=Cluster0');
  console.log("Connected to DB");
  
  // Just use a raw schema to count without imports
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }), 'products');
  
  try {
    const products = await Product.find({}).limit(10).lean();
    console.log("Found", products.length, "products in raw query");
    if (products.length > 0) {
      console.log("Sample ID:", products[0]._id.toString());
      console.log("Sample Name:", products[0].name);
    }
  } catch (e) {
    console.error("Error finding products:", e);
  }
  process.exit(0);
}
run();
