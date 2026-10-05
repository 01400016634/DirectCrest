const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://reajulhasan3230_db_user:oWzhul79tjCDCG8E@ac-qipxgo4-shard-00-00.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-01.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-02.ddoczsm.mongodb.net:27017/directcrest?ssl=true&replicaSet=atlas-xf9mi7-shard-0&authSource=admin&appName=Cluster0";

const data = `Apple MacBook Pro 2021 (14/16-inch): Wholesale/New: ৳98,400 – ৳117,600 | Used: ৳81,600 – ৳102,000
Apple MacBook Pro 16-inch M3 2024: Wholesale/New: ৳222,000 – ৳264,000 | Used: ৳162,000 – ৳192,000
Apple MacBook Air M2 13-inch: Wholesale/New: ৳95,000 – ৳115,000 | Used: ৳75,000 – ৳88,000
HP Pavilion x360 Laptop: Wholesale/New: ৳45,600 – ৳57,600 | Used: ৳21,600 – ৳31,200`;

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
    
    // Extract first number in string for wholesale price, second for retail
    const numbers = [...line.matchAll(/৳([\d,]+)/g)].map(m => parseInt(m[1].replace(/,/g, '')));
    
    if (numbers.length >= 2) {
      let wholesalePrice = numbers[0];
      let retailPrice = numbers[1];

      // Update in DB
      const result = await mongoose.connection.db.collection('products').updateMany(
        { name: { $regex: name, $options: 'i' } },
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
