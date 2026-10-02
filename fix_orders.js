const mongoose = require('mongoose');
const { Order, User } = require('./client/src/lib/models/Schema');
const dbConnect = require('./client/src/lib/mongoose').default;

async function run() {
  await dbConnect();
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
run();
