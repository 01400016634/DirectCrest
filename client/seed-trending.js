const mongoose = require('mongoose');

async function seed() {
  const MONGODB_URI = "mongodb://reajulhasan3230_db_user:oWzhul79tjCDCG8E@ac-qipxgo4-shard-00-00.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-01.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-02.ddoczsm.mongodb.net:27017/directcrest?ssl=true&replicaSet=atlas-xf9mi7-shard-0&authSource=admin&appName=Cluster0";
  await mongoose.connect(MONGODB_URI);
  
  const top10 = [
    'Apple iPhone 16 Pro Max',
    'Apple iPhone 15 Pro Max',
    'Samsung Galaxy S24 Ultra',
    'Apple MacBook Pro 16-inch M3 2024',
    'Apple AirPods Pro 2',
    'Sony PlayStation 5 DualSense Controller',
    'Apple Watch Series 10',
    'Nike Air Force 1 Low',
    'JBL Tour One M2',
    'Samsung Galaxy Z Fold 6'
  ];

  let totalUpdated = 0;
  for (const name of top10) {
    const res = await mongoose.connection.db.collection('products').updateMany(
      { name: { $regex: name, $options: 'i' } },
      { $set: { isTrending: true } }
    );
    totalUpdated += res.modifiedCount;
  }
  console.log('Updated trending products:', totalUpdated);
  process.exit(0);
}
seed();
