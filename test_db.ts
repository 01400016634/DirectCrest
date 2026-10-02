import dbConnect from './client/src/lib/mongoose';
import { Order } from './client/src/lib/models/Schema';

async function main() {
  await dbConnect();
  const orders = await Order.find({}).lean();
  console.log("Total orders:", orders.length);
  const deleted = await Order.find({ userDeleted: true }).lean();
  console.log("Deleted orders:", deleted.length);
}
main().then(() => process.exit(0));
