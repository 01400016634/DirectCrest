const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const standardUpdates = [
  { name: "Nike Air Jordan 1 Sneakers", price: 1440 },
  { name: "Nike Air Zoom Pegasus 36 Shoes", price: 1200 },
  { name: "Converse All-Star High-Top Sneakers", price: 780 },
  { name: "Vans Old Skool Sneakers", price: 720 },
  { name: "RTFKT Cyberpunk LED Sneakers", price: 2160 },
  { name: "Women's Classic High Heel Pumps", price: 660 },
  { name: "Men's Leather Oxford Dress Shoe", price: 1020 },
  { name: "Men's Classic Polo Shirt", price: 300 },
  { name: "Oversized Graphic T-Shirt - Black", price: 264 },
  { name: "Oversized Graphic T-Shirt - White", price: 264 },
  { name: "Black Flame Streetwear Hoodie", price: 660 },
  { name: "Two-Tone Varsity Hoodie", price: 720 },
  { name: "Tommy Hilfiger Puffer Jacket", price: 1500 },
  { name: "Women's Ribbed Crop Top & Skirt", price: 420 },
  { name: "Women's Belted Long Overcoat", price: 1320 },
  { name: "Vintage Washed Dad Hat", price: 108 },
  { name: "Vintage Washed Dad Hat - Variant", price: 108 },
  { name: "Tactical Half-Finger Combat Gloves", price: 180 },
  { name: "Commuter Laptop Backpack", price: 540 },
  { name: "Commuter Laptop Backpack - Variant", price: 540 },
  { name: "Vintage Canvas Trekking Backpack", price: 780 },
  { name: "Tactical Military Duffel Bag", price: 660 },
  { name: "Minimalist Travel Shoulder Bag", price: 336 },
  { name: "Women's Quilted Leather Handbag", price: 624 },
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
