const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

// Map to update names (old -> new) and set price
const dummyUpdates = [
  { old: "Apple iPhone 17 - 6.3 inch", new: "Apple iPhone 15", price: 78000 },
  { old: "Apple iPhone 17 Air Concept", new: "Apple iPhone 15 Plus", price: 88000 },
  { old: "Apple iPhone 17 Pro Concept", new: "Apple iPhone 15 Pro", price: 98000 },
  { old: "Apple iPhone 17 Pro Concept - Variant", new: "Apple iPhone 14", price: 66000 },
  { old: "Apple iPhone 17 Pro - 6.3 inch", new: "Apple iPhone 14 Plus", price: 74000 },
  { old: "Apple iPhone 17 Pro - 6.3 inch Variant", new: "Apple iPhone 13", price: 55000 },
  { old: "Apple iPhone 17 Pro Max Concept", new: "Apple iPhone 13 Pro", price: 68000 },
  { old: "Apple iPhone 18 Pro Max Heritage Edition", new: "Apple iPhone 12", price: 42000 },
  { old: "Apple iPhone Duo Concept", new: "Apple iPhone 11", price: 32000 },
  { old: "Apple iPhone Duo Concept - Variant", new: "Apple iPhone 11 Pro Max", price: 45000 },
  { old: "Apple iPhone Duo Fold Animated", new: "Apple iPhone SE (3rd Gen)", price: 28000 },
  { old: "Samsung Galaxy S25 Ultra Concept", new: "Samsung Galaxy S23 Ultra", price: 75000 },
  { old: "Samsung Galaxy S25 Ultra Concept - Variant", new: "Samsung Galaxy S23+", price: 58000 },
  { old: "Samsung Galaxy S26 Ultra Concept", new: "Samsung Galaxy S23", price: 48000 },
  { old: "Samsung Galaxy Z Fold 7 Concept", new: "Samsung Galaxy Z Fold 5", price: 110000 },
  { old: "OnePlus 13S Concept", new: "OnePlus 12", price: 62000 },
  { old: "Nothing Phone", new: "Nothing Phone (2a)", price: 28000 },
  { old: "Vivo X300 Ultra", new: "Vivo X100 Pro", price: 68000 },
  { old: "Vivo X300 Ultra - Green", new: "Vivo X100 Ultra (Green)", price: 82000 },
];

// Map for existing items whose name doesn't change, just the price
const standardUpdates = [
  { name: "Apple iPhone 5s", price: 3360 },
  { name: "Apple iPhone XS", price: 18600 },
  { name: "Apple iPhone 12 Pro", price: 43200 },
  { name: "Apple iPhone 13 Pro Max", price: 63600 },
  { name: "Apple iPhone 13 Pro Max - Variant", price: 68000 }, // Apple iPhone 13 Pro Max (256GB Color Variant)
  { name: "Apple iPhone 14 Pro", price: 74400 },
  { name: "Apple iPhone 14 Pro Max", price: 81600 },
  { name: "Apple iPhone 15 Pro Max", price: 102000 },
  { name: "Apple iPhone 16", price: 94800 },
  { name: "Apple iPhone 16 Pro Max", price: 126000 },
  { name: "Apple iPad Pro", price: 70800 },
  { name: "Samsung Galaxy S21 Ultra", price: 33600 },
  { name: "Samsung Galaxy S22 Ultra", price: 38400 },
  { name: "Samsung Galaxy S24 Ultra", price: 98400 },
  { name: "Samsung Galaxy Z Flip 3", price: 30000 },
  { name: "Realme 12 5G", price: 17400 },
  { name: "Vivo X80 Pro", price: 45600 },
  { name: "Vivo X200 Pro", price: 66000 },
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
