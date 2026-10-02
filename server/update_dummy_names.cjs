const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/directcrest";

const updates = [
  { old: "Apple iPhone 17 - 6.3 inch", new: "Apple iPhone 15", price: 84000 },
  { old: "Apple iPhone 17 Air Concept", new: "Apple iPhone 15 Plus", price: 95000 },
  { old: "Apple iPhone 17 Pro Concept", new: "Apple iPhone 15 Pro", price: 106000 },
  { old: "Apple iPhone 17 Pro Concept - Variant", new: "Apple iPhone 14", price: 71000 },
  { old: "Apple iPhone 17 Pro - 6.3 inch", new: "Apple iPhone 14 Plus", price: 80000 },
  { old: "Apple iPhone 17 Pro - 6.3 inch Variant", new: "Apple iPhone 13", price: 60000 },
  { old: "Apple iPhone 17 Pro Max Concept", new: "Apple iPhone 13 Pro", price: 74000 },
  { old: "Apple iPhone 18 Heritage Edition", new: "Apple iPhone 12", price: 47000 },
  { old: "Apple iPhone Duo Concept", new: "Apple iPhone 11", price: 36000 },
  { old: "Apple iPhone Duo Concept - Variant", new: "Apple iPhone 11 Pro Max", price: 50000 },
  { old: "Apple iPhone Duo Fold", new: "Apple iPhone SE (3rd Gen)", price: 31500 },
  { old: "Samsung Galaxy S25 Ultra Concept", new: "Samsung Galaxy S23 Ultra", price: 82500 },
  { old: "Samsung Galaxy S25 Ultra Concept - Variant", new: "Samsung Galaxy S23+", price: 64000 },
  { old: "Samsung Galaxy S26 Ultra Concept", new: "Samsung Galaxy S23", price: 53000 },
  { old: "Samsung Galaxy Z Fold 7 Concept", new: "Samsung Galaxy Z Fold 5", price: 122500 },
  { old: "OnePlus 13S Concept", new: "OnePlus 12", price: 68000 },
  { old: "Nothing Phone 4a Concept", new: "Nothing Phone (2a)", price: 31500 },
  { old: "Vivo X300 Ultra", new: "Vivo X100 Pro", price: 75000 },
  { old: "Vivo X300 Ultra (Green)", new: "Vivo X100 Ultra (Green)", price: 90000 },
];

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db();
    const collection = database.collection('products');

    for (const update of updates) {
        // Try multiple variations of the old name since exact names might differ slightly
        const result = await collection.updateMany(
            { name: { $regex: new RegExp(update.old.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'i') } },
            { $set: { name: update.new, price: update.price } }
        );
        console.log("Matched " + result.matchedCount + " and updated " + result.modifiedCount + " for " + update.old + " -> " + update.new);
    }

  } finally {
    await client.close();
  }
}
run().catch(console.dir);
