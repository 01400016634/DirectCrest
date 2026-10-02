import dotenv from 'dotenv';
dotenv.config({ path: '/Users/user/Documents/DirectCrest/client/.env.local' });
// Dynamic import to ensure dotenv is loaded first
async function run() {
  const { getUsers } = await import('./src/actions/user');
  const res = await getUsers();
  console.log(JSON.stringify(res, null, 2));
  process.exit(0);
}
run();
