const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://reajulhasan3230_db_user:oWzhul79tjCDCG8E@ac-qipxgo4-shard-00-00.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-01.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-02.ddoczsm.mongodb.net:27017/directcrest?ssl=true&replicaSet=atlas-xf9mi7-shard-0&authSource=admin&appName=Cluster0";

const data = `Amber Glass Serum Dropper Bottle: Wholesale/New: ৳9.60 – ৳26.40 / unit
Matte Cosmetic Squeeze Tube: Wholesale/New: ৳6.00 – ৳18.00 / unit`;

async function update() {
  await mongoose.connect(MONGODB_URI);
  const lines = data.split('\n').filter(Boolean);
  let updatedCount = 0;

  for (const line of lines) {
    const parts = line.split(':');
    if (parts.length < 2) continue;
    const nameStr = parts[0].trim();
    let name = nameStr;
    if (name.includes(' (')) {
      name = name.split(' (')[0];
    }
    
    // Extract numbers, allowing decimals
    const numbers = [...line.matchAll(/৳([\d,.]+)/g)].map(m => parseFloat(m[1].replace(/,/g, '')));
    
    if (numbers.length >= 2) {
      let wholesalePrice = numbers[0];
      let retailPrice = numbers[1];

      // Update in DB
      const result = await mongoose.connection.db.collection('products').updateMany(
        { name: { $regex: name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
        { $set: { wholesalePrice, retailPrice } }
      );
      updatedCount += result.modifiedCount;
      console.log(`Updated ${name} (matched ${result.modifiedCount}): Wholesale=${wholesalePrice}, Retail=${retailPrice}`);
    }
  }
  console.log(`Total products updated: ${updatedCount}`);
  process.exit(0);
}
update();
