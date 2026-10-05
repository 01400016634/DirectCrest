const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://reajulhasan3230_db_user:oWzhul79tjCDCG8E@ac-qipxgo4-shard-00-00.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-01.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-02.ddoczsm.mongodb.net:27017/directcrest?ssl=true&replicaSet=atlas-xf9mi7-shard-0&authSource=admin&appName=Cluster0";

async function fix() {
  await mongoose.connect(MONGODB_URI);
  
  const m5 = await mongoose.connection.db.collection('products').findOne({ name: { $regex: 'M5 Concept', $options: 'i' } });
  if (m5) {
    console.log('Found:', m5.name);
    const result = await mongoose.connection.db.collection('products').updateOne(
      { _id: m5._id },
      { 
        $set: { 
          name: 'Apple MacBook Air M2 13-inch',
          wholesalePrice: 95000,
          retailPrice: 115000
        }
      }
    );
    console.log('Updated to Air M2:', result.modifiedCount);
  } else {
    const existing = await mongoose.connection.db.collection('products').findOne({ name: 'Apple MacBook Air M2 13-inch' });
    console.log('Already renamed?', !!existing);
  }
  
  process.exit(0);
}
fix();
