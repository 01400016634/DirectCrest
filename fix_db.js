const mongoose = require('mongoose');
const { Product, Category } = require('./client/src/lib/models/Schema.js');
const fs = require('fs');

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://directcrest:direct12345@directcrest.8y01s.mongodb.net/directcrest?retryWrites=true&w=majority&appName=directcrest');
  
  const files = fs.readdirSync('./client/public/3d_models');
  console.log('Total files in public/3d_models:', files.length);

  const products = await Product.find({});
  let fixedCount = 0;
  for (let p of products) {
    if (p.threeDModelUrl) {
      let url = p.threeDModelUrl.replace('/3d_models/', '');
      url = decodeURIComponent(url);
      
      // Try to find the correct file
      const match = files.find(f => f.toLowerCase() === url.toLowerCase() || f.replace(' ', '') === url.replace(' ', ''));
      if (!match) {
        console.log('Not found:', url);
        // Maybe try to find a close match
        const closeMatch = files.find(f => f.includes(url.split('.')[0]));
        if (closeMatch) {
            console.log('  -> Found close match:', closeMatch);
            p.threeDModelUrl = '/3d_models/' + encodeURIComponent(closeMatch);
            await p.save();
            fixedCount++;
        }
      } else if (match !== url || encodeURIComponent(match) !== p.threeDModelUrl.replace('/3d_models/', '')) {
         p.threeDModelUrl = '/3d_models/' + encodeURIComponent(match);
         await p.save();
         fixedCount++;
      }
    }
  }
  
  console.log('Fixed', fixedCount, 'products');

  const cats = await Category.find({});
  console.log('\nCategories:');
  for (let c of cats) {
    const count = await Product.countDocuments({ categoryId: c._id });
    console.log(`- ${c.name}: ${count} products`);
  }

  process.exit();
}

fix();
