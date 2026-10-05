const fs = require('fs');

const trendingNames = [
  "Apple iPhone 16 Pro Max",
  "Apple iPhone 15 Pro Max",
  "Samsung Galaxy S24 Ultra",
  "Apple MacBook Pro 16-inch M3 2024",
  "Apple AirPods Pro",
  "Apple Watch Ultra 2",
  "JBL PartyBox 110 Speaker",
  "Nike Air Jordan 1 Sneakers",
  "GoPro Hero 13 Black",
  "Smart Biometric Digital Door Lock"
];

const routeFile = '/Users/user/Documents/DirectCrest/client/src/app/api/seed/route.ts';
let routeContent = fs.readFileSync(routeFile, 'utf-8');

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
    process.exit(1);
  }

  if (seedData.length > 0) {
    for (let i = 0; i < seedData.length; i++) {
      if (trendingNames.includes(seedData[i].name)) {
        seedData[i].isTrending = true;
      } else {
        seedData[i].isTrending = false;
      }
    }
    
    const newSeedDataStr = JSON.stringify(seedData, null, 6);
    const newContent = routeContent.substring(0, startIdx) + 'const seedData = ' + newSeedDataStr + ';\n\n' + routeContent.substring(endIdx);
    
    fs.writeFileSync(routeFile, newContent);
    console.log('Successfully updated isTrending flags in route.ts');
  }
} else {
  console.log("Could not locate seedData in route.ts");
}
