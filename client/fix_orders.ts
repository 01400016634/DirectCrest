import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { Order, User } from './src/lib/models/Schema';

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected");
  const users = await User.find({});
  for (const user of users) {
    if (user.email) {
      const updated = await Order.updateMany(
        { 'shippingAddress.email': user.email, userId: { $exists: false } },
        { $set: { userId: user._id } }
      );
      if (updated.modifiedCount > 0) {
        console.log(`Updated ${updated.modifiedCount} orders for ${user.email}`);
      }
    }
  }
  console.log("Done");
  process.exit(0);
}
run().catch(console.error);
