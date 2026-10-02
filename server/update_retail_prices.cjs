const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    
    const supplierProducts = await db.collection('supplierproducts').find({}).toArray();
    
    let updatedCount = 0;
    for (const sp of supplierProducts) {
      if (sp.cost && sp.productId) {
        // Random multiplier between 1.5 and 1.7
        const multiplier = 1.5 + Math.random() * 0.2;
        const newRetailPrice = Math.round(sp.cost * multiplier * 100) / 100; // Round to 2 decimals
        
        await db.collection('products').updateOne(
          { _id: sp.productId },
          { $set: { retailPrice: newRetailPrice } }
        );
        updatedCount++;
      }
    }
    
    console.log(`Updated retailPrice for ${updatedCount} products based on supplier cost.`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
