const mongoose = require('mongoose');

async function migrate() {
  const MONGODB_URI = "mongodb://reajulhasan3230_db_user:oWzhul79tjCDCG8E@ac-qipxgo4-shard-00-00.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-01.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-02.ddoczsm.mongodb.net:27017/directcrest?ssl=true&replicaSet=atlas-xf9mi7-shard-0&authSource=admin&appName=Cluster0";
  await mongoose.connect(MONGODB_URI);
  
  const result = await mongoose.connection.db.collection('products').updateMany(
    { category: { $exists: true } },
    { $rename: { "category": "categoryId" } }
  );
  
  console.log('Migration complete:', result);
  process.exit(0);
}
migrate();
