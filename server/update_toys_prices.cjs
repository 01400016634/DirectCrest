const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const standardUpdates = [
  { name: "Chevrolet Corvette C6.R 1:18 Toy Car", price: 780 },
  { name: "McLaren 650S GT3 1:24 Toy Car", price: 504 },
  { name: "McLaren 720S GT3 1:18 Toy Car", price: 840 },
  { name: "Porsche 992 GT3 R 1:18 Toy Car", price: 900 },
  { name: "BMW M3 GTR GT2 Toy Car", price: 384 },
  { name: "BMW M6 GT3 Toy Car", price: 480 },
  { name: "1963 Chevrolet C10 Vintage Pickup Toy", price: 456 },
  { name: "MD 500 Military RC Helicopter", price: 780 },
  { name: "Neon Chrome Sci-Fi Toy Tank", price: 1080 },
  { name: "Transformers Optimus Prime Action Figure", price: 1020 },
  { name: "Elena of Avalor Princess Crown Toy", price: 96 },
  { name: "Pokemon Masters Snapback Cap", price: 144 },
  { name: "Pokemon Masters Snapback Cap - Variant", price: 144 },
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
