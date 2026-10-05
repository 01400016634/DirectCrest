const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://reajulhasan3230_db_user:oWzhul79tjCDCG8E@ac-qipxgo4-shard-00-00.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-01.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-02.ddoczsm.mongodb.net:27017/directcrest?ssl=true&replicaSet=atlas-xf9mi7-shard-0&authSource=admin&appName=Cluster0";

const data = `Apple AirPods Pro: Wholesale/New (OEM): ৳1,440 – ৳3,360 | Refurbished/Used: ৳7,800 – ৳11,400
Apple Watch Series 7: Wholesale/New: ৳21,600 – ৳27,600 | Used: ৳11,400 – ৳16,800
Apple Watch Ultra 2: Wholesale/New: ৳54,000 – ৳66,000 | Used: ৳38,400 – ৳46,800
Samsung Galaxy Watch 7: Wholesale/New: ৳25,200 – ৳32,400 | Used: ৳15,600 – ৳20,400
Amazon Echo Dot 3rd Gen: Wholesale/New: ৳1,020 – ৳1,740 | Used: ৳600 – ৳960
JBL Charge 3 Portable Speaker: Wholesale/New: ৳2,160 – ৳4,200 | Used: ৳1,440 – ৳2,160
JBL PartyBox 110 Speaker: Wholesale/New: ৳16,800 – ৳25,200 | Used: ৳10,800 – ৳14,400
JBL T450 Wired Headphones: Wholesale/New: ৳540 – ৳1,020 | Used: ৳300 – ৳480
JBL Tune 720BT Wireless Headphones: Wholesale/New: ৳2,160 – ৳3,360 | Used: ৳1,200 – ৳1,800
JBL Tour One M2 Headphones: Wholesale/New: ৳6,600 – ৳9,000 | Used: ৳4,200 – ৳5,400
JBL Tour Pro 2 TWS Earbuds: Wholesale/New: ৳5,400 – ৳7,800 | Used: ৳3,000 – ৳4,200
JBL RGB Gaming Headphones: Wholesale/New: ৳1,440 – ৳2,640 | Used: ৳840 – ৳1,320
GoPro Hero 11 Black Mini: Wholesale/New: ৳25,200 – ৳31,200 | Used: ৳16,800 – ৳21,600
GoPro Hero 13 Black: Wholesale/New: ৳37,200 – ৳45,600 | Used: ৳26,400 – ৳31,200`;

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
