const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const dummyUpdates = [
  { old: "Apple MacBook Pro 14-inch M5 Concept", new: "Apple MacBook Air M2 13-inch", price: 95000 },
];

const standardUpdates = [
  { name: "Apple MacBook Pro 2021", price: 98400 },
  { name: "Apple MacBook Pro 16-inch M3 2024", price: 222000 },
  { name: "HP Pavilion x360 Laptop", price: 45600 },
  { name: "Apple AirPods Pro", price: 1440 },
  { name: "Apple Watch Series 7", price: 21600 },
  { name: "Apple Watch Ultra 2", price: 54000 },
  { name: "Samsung Galaxy Watch 7", price: 25200 },
  { name: "Amazon Echo Dot 3rd Gen", price: 1020 },
  { name: "JBL Charge 3 Portable Speaker", price: 2160 },
  { name: "JBL PartyBox 110 Speaker", price: 16800 },
  { name: "JBL T450 Wired Headphones", price: 540 },
  { name: "JBL Tune 720BT Wireless Headphones", price: 2160 },
  { name: "JBL Tour One M2 Headphones", price: 6600 },
  { name: "JBL Tour Pro 2 TWS Earbuds", price: 5400 },
  { name: "JBL RGB Gaming Headphones", price: 1440 },
  { name: "GoPro Hero 11 Black Mini", price: 25200 },
  { name: "GoPro Hero 13 Black", price: 37200 },
];

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const collection = client.db().collection('products');

    console.log("Updating dummy concepts and their prices...");
    for (const update of dummyUpdates) {
      const result = await collection.updateOne(
        { name: update.old },
        { $set: { name: update.new, price: update.price } }
      );
      console.log(`- ${update.old} -> ${update.new} (Price: ${update.price}) | Matched: ${result.matchedCount}, Updated: ${result.modifiedCount}`);
    }

    console.log("\\nUpdating standard product prices...");
    for (const update of standardUpdates) {
      const result = await collection.updateOne(
        { name: update.name },
        { $set: { price: update.price } }
      );
      console.log(`- ${update.name} (Price: ${update.price}) | Matched: ${result.matchedCount}, Updated: ${result.modifiedCount}`);
    }

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
