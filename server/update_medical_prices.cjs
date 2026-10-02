const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const standardUpdates = [
  { name: "Clinical Anesthesia Workstation", price: 144000 },
  { name: "ICU Electric Hospital Bed Unit", price: 54000 },
  { name: "Vitacore-X Patient Monitor", price: 21600 },
  { name: "Sterile Medical Syringe", price: 3.6 },
  { name: "3-Ply Disposable Face Masks 50-Pack", price: 54 },
  { name: "Solid Wood Kung-Fu Tea Table", price: 5400 },
  { name: "Modular L-Shaped Sectional Sofa", price: 14400 },
  { name: "Nordic Desk Lamp", price: 420 },
  { name: "Low-Poly Bedside Table Lamp", price: 336 },
  { name: "Ergonomic Mesh Office Chair", price: 2160 },
  { name: "Smart Biometric Digital Door Lock", price: 2640 },
  { name: "Amber Glass Serum Dropper Bottle", price: 9.6 },
  { name: "Matte Cosmetic Squeeze Tube", price: 6 },
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
