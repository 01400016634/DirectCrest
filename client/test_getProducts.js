require('dotenv').config({ path: '/Users/user/Documents/DirectCrest/client/.env' });
const mongoose = require('mongoose');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
  const { Product, Category, Brand } = require('/Users/user/Documents/DirectCrest/client/src/lib/models/Schema.ts'); // Can't require TS file directly in Node
}
