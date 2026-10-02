const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    
    const products = await db.collection('products').find({}).toArray();
    
    let updatedCount = 0;
    for (const p of products) {
      if (p.cost) {
        // Random multiplier between 1.5 and 1.7
        const multiplier = 1.5 + Math.random() * 0.2;
        const newRetailPrice = Math.round(p.cost * multiplier * 100) / 100; // Round to 2 decimals
        
        await db.collection('products').updateOne(
          { _id: p._id },
          { $set: { 
              retailPrice: newRetailPrice,
              price: newRetailPrice 
            } 
          }
        );
        updatedCount++;
      }
    }
    
    console.log(`Fixed retail prices for ${updatedCount} products based on supplier cost.`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
