import dotenv from 'dotenv';
dotenv.config({ path: '/Users/user/Documents/DirectCrest/client/.env.local' });
// Dynamic import to ensure dotenv is loaded first
async function run() {
  const { getProducts } = await import('./src/actions/product');
  const res = await getProducts();
  console.log(JSON.stringify(res, null, 2));
  process.exit(0);
}
run();
