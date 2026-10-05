const fs = require('fs');

const input = fs.readFileSync('/tmp/user_input.txt', 'utf-8');
const lines = input.split('\n');
const updates = [];
let currentCategory = '';

for (const line of lines) {
  if (line.startsWith('### ')) {
    // e.g. "### 📱 1. Smartphones & Tablets (37 Real Models)"
    const match = line.match(/### [^\s]+ \d+\. (.*?)( \(\d+ |$)/);
    if (match) {
      currentCategory = match[1].trim();
      currentCategory = currentCategory.split(' (')[0].trim();
    }
  } else if (line.match(/^\d+\.\s+\*\*(.*?)\*\*/)) {
    const match = line.match(/^\d+\.\s+\*\*(.*?)\*\*:(.*)/);
    if (match) {
      const name = match[1].trim();
      const details = match[2].trim();
      
      let priceMatch = details.match(/Wholesale.*?:.*?[৳$]([\d,.]+)/);
      if (!priceMatch) {
        priceMatch = details.match(/Wholesale\/New.*?[৳$]([\d,.]+)/);
      }
      
      let price = 0;
      if (priceMatch) {
        price = parseFloat(priceMatch[1].replace(/,/g, ''));
      }
      
      updates.push({
        name,
        category: currentCategory,
        retailPrice: price,
        description: `Premium ${name}`
      });
    }
  }
}

// Now read route.ts and update
const routeFile = '/Users/user/Documents/DirectCrest/client/src/app/api/seed/route.ts';
let routeContent = fs.readFileSync(routeFile, 'utf-8');

// We need to parse the existing JSON from route.ts
const startIdx = routeContent.indexOf('const seedData = [');
const endIdx = routeContent.indexOf('    await Product.insertMany(seedData);');

if (startIdx !== -1 && endIdx !== -1) {
  let seedDataStr = routeContent.slice(startIdx, endIdx);
  seedDataStr = seedDataStr.replace('const seedData = ', '').trim();
  if (seedDataStr.endsWith(';')) {
    seedDataStr = seedDataStr.slice(0, -1);
  }

  
  let seedData = [];
  try {
    seedData = JSON.parse(seedDataStr);
  } catch (e) {
    console.log("Failed to parse JSON directly");
  }

  if (seedData.length > 0) {
    for (let i = 0; i < updates.length; i++) {
      if (seedData[i]) {
        seedData[i].name = updates[i].name;
        seedData[i].category = updates[i].category;
        seedData[i].retailPrice = updates[i].retailPrice;
        seedData[i].description = updates[i].description;
      }
    }
    
    // Write out the modified array string
    const newSeedDataStr = JSON.stringify(seedData, null, 6);
    const newContent = routeContent.substring(0, startIdx) + 'const seedData = ' + newSeedDataStr + ';\n\n' + routeContent.substring(endIdx);
    
    fs.writeFileSync(routeFile, newContent);
    console.log('Successfully updated route.ts with new names, categories, and prices.');
  }
} else {
  console.log("Could not locate seedData in route.ts");
}
