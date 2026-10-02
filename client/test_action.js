require('dotenv').config({ path: '/Users/user/Documents/DirectCrest/client/.env.local' });
const { getProducts } = require('/Users/user/Documents/DirectCrest/client/src/actions/product');

async function run() {
  const res = await getProducts();
  console.log(JSON.stringify(res, null, 2));
}

run();
