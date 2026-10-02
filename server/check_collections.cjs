const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    // Check products
    const sampleProduct = await db.collection('products').findOne({});
    console.log("Sample product:", sampleProduct);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
