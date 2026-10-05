const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://reajulhasan3230_db_user:oWzhul79tjCDCG8E@ac-qipxgo4-shard-00-00.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-01.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-02.ddoczsm.mongodb.net:27017/directcrest?ssl=true&replicaSet=atlas-xf9mi7-shard-0&authSource=admin&appName=Cluster0";

const data = `Commuter Laptop Backpack (Grey Variant): Wholesale/New: ৳540 – ৳1,140
Vintage Canvas Trekking Backpack: Wholesale/New: ৳780 – ৳1,620
Tactical Military Duffel Bag: Wholesale/New: ৳660 – ৳1,440
Minimalist Travel Shoulder Bag: Wholesale/New: ৳336 – ৳744
Women's Quilted Leather Handbag: Wholesale/New: ৳624 – ৳1,500
Freshwater Pearl Necklace: Wholesale/New: ৳216 – ৳540
Solitaire Gemstone Ring: Wholesale/New: ৳72 – ৳216
Raw Crystal Pendant Necklace: Wholesale/New: ৳96 – ৳264
Jade Donut Pendant Necklace: Wholesale/New: ৳144 – ৳420
Jashin Symbol Anime Necklace: Wholesale/New: ৳48 – ৳144
Jashin Symbol Anime Necklace (Silver Variant): Wholesale/New: ৳48 – ৳144
Minimalist Fine Cable Chain: Wholesale/New: ৳36 – ৳108
Curb Cuban Link Chain: Wholesale/New: ৳96 – ৳300
Classic Aviator Sunglasses: Wholesale/New: ৳72 – ৳216
Blue Light Blocking Optical Glasses: Wholesale/New: ৳84 – ৳264`;

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
