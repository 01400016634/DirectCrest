const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const standardUpdates = [
  { name: "Freshwater Pearl Necklace", price: 216 },
  { name: "Solitaire Gemstone Ring", price: 72 },
  { name: "Raw Crystal Pendant Necklace", price: 96 },
  { name: "Jade Donut Pendant Necklace", price: 144 },
  { name: "Jashin Symbol Anime Necklace", price: 48 },
  { name: "Jashin Symbol Anime Necklace - Variant", price: 48 },
  { name: "Minimalist Fine Cable Chain", price: 36 },
  { name: "Curb Cuban Link Chain", price: 96 },
  { name: "Classic Aviator Sunglasses", price: 72 },
  { name: "Blue Light Blocking Optical Glasses", price: 84 },
  { name: "Tactical Serrated Combat Knife", price: 216 },
  { name: "iPhone 13 Pro Silicone Case", price: 42 },
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
