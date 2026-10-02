const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './server/.env' });

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('directcrest');
    const productsCollection = db.collection('products');

    const result = await productsCollection.updateOne(
      { name: "Solid Wood Kung-Fu Tea Table" },
      { $unset: { threeDModelUrl: "" } }
    );
    console.log(`Matched ${result.matchedCount}, Modified ${result.modifiedCount}`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
