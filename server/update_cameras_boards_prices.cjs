const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const standardUpdates = [
  { name: "Insta360 ONE X2 Action Camera", price: 31200 },
  { name: "50,000mAh Heavy Duty Power Bank", price: 1140 },
  { name: "Arcadia Wooden Longboard", price: 1440 },
  { name: "OneWheel Pint Electric Board", price: 33600 },
];

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const collection = client.db().collection('products');

    console.log("Updating standard product prices...");
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
