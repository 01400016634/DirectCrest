const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://reajulhasan3230_db_user:oWzhul79tjCDCG8E@ac-qipxgo4-shard-00-00.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-01.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-02.ddoczsm.mongodb.net:27017/directcrest?ssl=true&replicaSet=atlas-xf9mi7-shard-0&authSource=admin&appName=Cluster0";

const data = `Nike Air Jordan 1 Sneakers: Wholesale Replica: ৳1,440 – ৳2,880 | Used Authentic: ৳5,400 – ৳10,200
Nike Air Zoom Pegasus 36 Shoes: Wholesale Replica: ৳1,200 – ৳2,160 | Used Authentic: ৳3,000 – ৳4,800
Converse All-Star High-Top Sneakers: Wholesale Replica: ৳780 – ৳1,440 | Used Authentic: ৳2,160 – ৳3,600
Vans Old Skool Sneakers: Wholesale Replica: ৳720 – ৳1,320 | Used Authentic: ৳1,800 – ৳3,000
RTFKT Cyberpunk LED Sneakers: Wholesale/New: ৳2,160 – ৳4,200
Women's Classic High Heel Pumps: Wholesale/New: ৳660 – ৳1,440
Men's Leather Oxford Dress Shoe: Wholesale/New: ৳1,020 – ৳2,220
Men's Classic Polo Shirt: Wholesale/New: ৳300 – ৳660
Oversized Graphic T-Shirt - Black: Wholesale/New: ৳264 – ৳576
Oversized Graphic T-Shirt - White: Wholesale/New: ৳264 – ৳576
Black Flame Streetwear Hoodie: Wholesale/New: ৳660 – ৳1,320
Two-Tone Varsity Hoodie: Wholesale/New: ৳720 – ৳1,500
Tommy Hilfiger Puffer Jacket: Wholesale/New: ৳1,500 – ৳2,640
Women's Ribbed Crop Top & Skirt: Wholesale/New: ৳420 – ৳900
Women's Belted Long Overcoat: Wholesale/New: ৳1,320 – ৳2,880
Vintage Washed Dad Hat: Wholesale/New: ৳108 – ৳264
Vintage Washed Dad Hat (Navy Variant): Wholesale/New: ৳108 – ৳264
Tactical Half-Finger Combat Gloves: Wholesale/New: ৳180 – ৳420
Commuter Laptop Backpack: Wholesale/New: ৳540 – ৳1,140`;

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
