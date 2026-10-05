const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://reajulhasan3230_db_user:oWzhul79tjCDCG8E@ac-qipxgo4-shard-00-00.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-01.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-02.ddoczsm.mongodb.net:27017/directcrest?ssl=true&replicaSet=atlas-xf9mi7-shard-0&authSource=admin&appName=Cluster0";

const data = `Chevrolet Corvette C6.R 1:18 Toy Car: Wholesale/New (Die-cast Toy): ৳780 – ৳1,440
McLaren 650S GT3 1:24 Toy Car: Wholesale/New (Die-cast Toy): ৳504 – ৳1,020
McLaren 720S GT3 1:18 Toy Car: Wholesale/New (Die-cast Toy): ৳840 – ৳1,680
Porsche 992 GT3 R 1:18 Toy Car: Wholesale/New (Die-cast Toy): ৳900 – ৳1,800
BMW M3 GTR GT2 Toy Car: Wholesale/New (Die-cast Toy): ৳384 – ৳840
BMW M6 GT3 Toy Car: Wholesale/New (Die-cast Toy): ৳480 – ৳984
1963 Chevrolet C10 Vintage Pickup Toy: Wholesale/New (Die-cast Toy): ৳456 – ৳864
MD 500 Military RC Helicopter: Wholesale/New (RC Toy): ৳780 – ৳1,740
Neon Chrome Sci-Fi Toy Tank: Wholesale/New (RC Toy): ৳1,080 – ৳2,340
Transformers Optimus Prime Action Figure: Wholesale/New (Action Figure Toy): ৳1,020 – ৳2,160
Elena of Avalor Princess Crown Toy: Wholesale/New (Kids Toy): ৳96 – ৳264
Pokemon Masters Snapback Cap: Wholesale/New: ৳144 – ৳336
Pokemon Masters Snapback Cap (Black Variant): Wholesale/New: ৳144 – ৳336`;

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
