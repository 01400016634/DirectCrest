const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://reajulhasan3230_db_user:oWzhul79tjCDCG8E@ac-qipxgo4-shard-00-00.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-01.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-02.ddoczsm.mongodb.net:27017/directcrest?ssl=true&replicaSet=atlas-xf9mi7-shard-0&authSource=admin&appName=Cluster0";

const data = `Apple iPhone 5s: Wholesale: ৳3,360 – ৳4,560 | Single New: ৳4,200 – ৳5,400 | Used: ৳1,440 – ৳2,640
Apple iPhone XS: Wholesale/New: ৳18,600 – ৳21,600 | Used: ৳13,200 – ৳17,400
Apple iPhone 12 Pro: Wholesale/New: ৳43,200 – ৳50,400 | Used: ৳33,600 – ৳40,800
Apple iPhone 13 Pro Max: Wholesale/New: ৳63,600 – ৳74,400 | Used: ৳50,400 – ৳61,200
Apple iPhone 13 Pro Max (256GB Variant): Wholesale/New: ৳68,400 – ৳78,000 | Used: ৳54,000 – ৳64,800
Apple iPhone 14 Pro: Wholesale/New: ৳74,400 – ৳86,400 | Used: ৳57,600 – ৳69,600
Apple iPhone 14 Pro Max: Wholesale/New: ৳81,600 – ৳93,600 | Used: ৳62,400 – ৳75,600
Apple iPhone 15 Pro Max: Wholesale/New: ৳102,000 – ৳117,600 | Used: ৳78,000 – ৳93,600
Apple iPhone 16: Wholesale/New: ৳94,800 – ৳102,000 | Used: ৳74,400 – ৳84,000
Apple iPhone 16 Pro Max: Wholesale/New: ৳126,000 – ৳138,000 | Used: ৳93,600 – ৳105,600
Apple iPhone 15: Wholesale/New: ৳78,000 – ৳90,000 | Used: ৳58,000 – ৳68,000
Apple iPhone 15 Plus: Wholesale/New: ৳88,000 – ৳102,000 | Used: ৳66,000 – ৳76,000
Apple iPhone 15 Pro: Wholesale/New: ৳98,000 – ৳114,000 | Used: ৳75,000 – ৳88,000
Apple iPhone 14: Wholesale/New: ৳66,000 – ৳76,000 | Used: ৳48,000 – ৳56,000
Apple iPhone 14 Plus: Wholesale/New: ৳74,000 – ৳86,000 | Used: ৳54,000 – ৳64,000
Apple iPhone 13: Wholesale/New: ৳55,000 – ৳65,000 | Used: ৳40,000 – ৳48,000
Apple iPhone 13 Pro: Wholesale/New: ৳68,000 – ৳80,000 | Used: ৳52,000 – ৳62,000
Apple iPhone 12: Wholesale/New: ৳42,000 – ৳52,000 | Used: ৳30,000 – ৳38,000
Apple iPhone 11: Wholesale/New: ৳32,000 – ৳40,000 | Used: ৳22,000 – ৳28,000
Apple iPhone 11 Pro Max: Wholesale/New: ৳45,000 – ৳55,000 | Used: ৳34,000 – ৳42,000
Apple iPhone SE (3rd Gen): Wholesale/New: ৳28,000 – ৳35,000 | Used: ৳18,000 – ৳24,000
Apple iPad Pro: Wholesale/New: ৳70,800 – ৳98,400 | Used: ৳45,600 – ৳69,600
Samsung Galaxy S21 Ultra: Wholesale/New: ৳33,600 – ৳42,000 | Used: ৳25,200 – ৳32,400
Samsung Galaxy S22 Ultra: Wholesale/New: ৳38,400 – ৳46,800 | Used: ৳30,000 – ৳37,200
Samsung Galaxy S24 Ultra: Wholesale/New: ৳98,400 – ৳115,200 | Used: ৳74,400 – ৳88,800
Samsung Galaxy S23 Ultra: Wholesale/New: ৳75,000 – ৳90,000 | Used: ৳58,000 – ৳68,000
Samsung Galaxy S23+: Wholesale/New: ৳58,000 – ৳70,000 | Used: ৳42,000 – ৳52,000
Samsung Galaxy S23: Wholesale/New: ৳48,000 – ৳58,000 | Used: ৳34,000 – ৳42,000
Samsung Galaxy Z Flip 3: Wholesale/New: ৳30,000 – ৳37,200 | Used: ৳19,200 – ৳25,200
Samsung Galaxy Z Fold 5: Wholesale/New: ৳110,000 – ৳135,000 | Used: ৳82,000 – ৳98,000
OnePlus 12: Wholesale/New: ৳62,000 – ৳74,000 | Used: ৳46,000 – ৳56,000
Realme 12 5G: Wholesale/New: ৳17,400 – ৳21,000 | Used: ৳11,400 – ৳15,000
Nothing Phone (2a): Wholesale/New: ৳28,000 – ৳35,000 | Used: ৳20,000 – ৳25,000
Vivo X80 Pro: Wholesale/New: ৳45,600 – ৳54,000 | Used: ৳34,800 – ৳40,800
Vivo X200 Pro: Wholesale/New: ৳66,000 – ৳78,000 | Used: ৳49,200 – ৳57,600
Vivo X100 Pro: Wholesale/New: ৳68,000 – ৳82,000 | Used: ৳52,000 – ৳62,000
Vivo X100 Ultra (Green): Wholesale/New: ৳82,000 – ৳98,000 | Used: ৳65,000 – ৳76,000`;

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
