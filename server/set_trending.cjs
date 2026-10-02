const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const trendingProducts = [
  "Apple iPhone 16 Pro Max",
  "Samsung Galaxy S24 Ultra",
  "Apple AirPods Pro",
  "Apple Watch Ultra 2",
  "Smart Biometric Digital Door Lock",
  "50,000mAh Heavy Duty Power Bank",
  "JBL Tour Pro 2 TWS Earbuds",
  "Oversized Graphic T-Shirt - Black",
  "Commuter Laptop Backpack",
  "Porsche 992 GT3 R 1:18 Toy Car"
];

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const collection = client.db().collection('products');

    // First, set all products to not trending
    await collection.updateMany({}, { $set: { isTrending: false } });

    // Set the specific 10 products to trending
    console.log("Setting 10 products to trending...");
    for (const name of trendingProducts) {
      const result = await collection.updateOne(
        { name: name },
        { $set: { isTrending: true } }
      );
      console.log(`- ${name} | Matched: ${result.matchedCount}, Updated: ${result.modifiedCount}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
