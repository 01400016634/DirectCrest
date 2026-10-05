const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://reajulhasan3230_db_user:oWzhul79tjCDCG8E@ac-qipxgo4-shard-00-00.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-01.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-02.ddoczsm.mongodb.net:27017/directcrest?ssl=true&replicaSet=atlas-xf9mi7-shard-0&authSource=admin&appName=Cluster0";

const data = `Clinical Anesthesia Workstation: Wholesale: ৳144,000 – ৳336,000 | Single New: ৳420,000 – ৳780,000 | Used: ৳78,000 – ৳144,000
ICU Electric Hospital Bed Unit: Wholesale: ৳54,000 – ৳102,000 | Single New: ৳102,000 – ৳180,000 | Used: ৳26,400 – ৳45,600
Vitacore-X Patient Monitor: Wholesale: ৳21,600 – ৳38,400 | Single New: ৳38,400 – ৳60,000 | Used: ৳10,800 – ৳18,000
Sterile Medical Syringe: Wholesale/New: ৳3.60 – ৳9.60 / unit
3-Ply Disposable Face Masks 50-Pack: Wholesale/New: ৳54 – ৳108 / box`;

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
