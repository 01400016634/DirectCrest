const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const updates = [
  { match: "Kung-Fu Tea Table", modelUrl: "/3d_models/chinese_style_tea_table.glb" },
  { match: "1963 Chevrolet C10", modelUrl: "/3d_models/low_poly_car_-_chevrolet_c10_pickup_1963.glb" },
  { match: "Vintage Canvas Trekking Backpack", modelUrl: "/3d_models/old_backpack__renewed_hope.glb" },
  { match: "Tommy Hilfiger", modelUrl: "/3d_models/tommy_hilfiger_jacket.glb" }
];

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const collection = client.db().collection('products');

    for (const update of updates) {
      const result = await collection.updateOne(
        { name: { $regex: update.match, $options: 'i' } },
        { $set: { threeDModelUrl: update.modelUrl } }
      );
      console.log(`- Matched ${update.match}: ${result.matchedCount}, Updated: ${result.modifiedCount}`);
    }

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
