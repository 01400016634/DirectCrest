import mongoose from 'mongoose';
import { Product } from './src/lib/models/Schema';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const priceUpdates = [
  { name: 'Apple iPhone 5s', price: 5400 },
  { name: 'Apple iPhone XS', price: 26400 },
  { name: 'Apple iPhone 12 Pro', price: 62400 },
  { name: 'Apple iPhone 13 Pro Max', price: 90000 },
  { name: 'Apple iPhone 13 Pro Max - Variant', price: 90000 },
  { name: 'Apple iPhone 14 Pro', price: 102000 },
  { name: 'Apple iPhone 14 Pro Max', price: 110400 },
  { name: 'Apple iPhone 15 Pro Max', price: 138000 },
  { name: 'Apple iPhone 16', price: 117600 },
  { name: 'Apple iPhone 16 Pro Max', price: 162000 },
  { name: 'Apple iPhone 17 - 6.3 inch', price: 1800 },
  { name: 'Apple iPhone 17 Air Concept', price: 1800 },
  { name: 'Apple iPhone 17 Pro Concept', price: 1800 },
  { name: 'Apple iPhone 17 Pro Concept - Variant', price: 1800 },
  { name: 'Apple iPhone 17 Pro - 6.3 inch', price: 1800 },
  { name: 'Apple iPhone 17 Pro - 6.3 inch Variant', price: 1800 },
  { name: 'Apple iPhone 17 Pro Max Concept', price: 1800 },
  { name: 'Apple iPhone 18 Pro Max Heritage Edition', price: 2160 },
  { name: 'Apple iPhone Duo Concept', price: 2160 },
  { name: 'Apple iPhone Duo Concept - Variant', price: 2160 },
  { name: 'Apple iPhone Duo Fold Animated', price: 2640 },
  { name: 'Apple iPad Pro', price: 114000 },
  { name: "Samsung Galaxy S21 Ultra", price: 50400 },
  { name: "Samsung Galaxy S22 Ultra", price: 57600 },
  { name: "Samsung Galaxy S24 Ultra", price: 132000 },
  { name: "Samsung Galaxy S25 Ultra Concept", price: 2160 },
  { name: "Samsung Galaxy S25 Ultra Concept - Variant", price: 2160 },
  { name: "Samsung Galaxy S26 Ultra Concept", price: 2160 },
  { name: "Samsung Galaxy Z Flip 3", price: 45600 },
  { name: "Samsung Galaxy Z Fold 7 Concept", price: 3000 },
  { name: "OnePlus 13S Concept", price: 2160 },
  { name: "Realme 12 5G", price: 25200 },
  { name: "Nothing Phone (4a)", price: 34800 },
  { name: "Vivo X80 Pro", price: 64800 },
  { name: "Vivo X200 Pro", price: 93600 },
  { name: "Vivo X300 Ultra", price: 102000 },
  { name: "Vivo X300 Ultra - Green", price: 102000 },
  { name: "Apple MacBook Pro 2021 (14/16-inch)", price: 150000 },
  { name: "Apple MacBook Pro 16-inch M3 2024", price: 312000 },
  { name: "Apple MacBook Pro 14-inch M5 Concept", price: 5400 },
  { name: "HP Pavilion x360 Laptop", price: 74400 },
  { name: "Apple AirPods Pro", price: 28800 },
  { name: "Apple Watch Series 7", price: 38400 },
  { name: "Apple Watch Ultra 2", price: 90000 },
  { name: "Samsung Galaxy Watch 7", price: 40800 },
  { name: "Amazon Echo Dot 3rd Gen", price: 3600 },
  { name: "JBL Charge 3 Portable Speaker", price: 7800 },
  { "name": "JBL PartyBox 110 Speaker", price: 42000 },
  { name: "JBL T450 Wired Headphones", price: 2640 },
  { name: "JBL Tune 720BT Wireless Headphones", price: 6600 },
  { name: "JBL Tour One M2 Headphones", price: 19200 },
  { name: "JBL Tour Pro 2 TWS Earbuds", price: 16800 },
  { name: "JBL RGB Gaming Headphones", price: 5400 },
  { name: "GoPro Hero 11 Black Mini", price: 40800 },
  { name: "GoPro Hero 13 Black", price: 58800 },
  { name: "Insta360 ONE X2 Action Camera", price: 50400 },
  { name: "50,000mAh Heavy Duty Power Bank", price: 3840 },
  { name: "Arcadia Wooden Longboard", price: 6000 },
  { name: "OneWheel Pint Electric Board", price: 84000 },
  { name: "Chevrolet Corvette C6.R 1:18 Toy Car", price: 3360 },
  { name: "McLaren 650S GT3 1:24 Toy Car", price: 2400 },
  { name: "McLaren 720S GT3 1:18 Toy Car", price: 3840 },
  { name: "Porsche 992 GT3 R 1:18 Toy Car", price: 4200 },
  { name: "BMW M3 GTR GT2 Toy Car", price: 1920 },
  { name: "BMW M6 GT3 Toy Car", price: 2160 },
  { name: "1963 Chevrolet C10 Vintage Pickup Toy", price: 2160 },
  { name: "MD 500 Military RC Helicopter", price: 4200 },
  { name: "Neon Chrome Sci-Fi Toy Tank", price: 5400 },
  { name: "Transformers Optimus Prime Action Figure", price: 5040 },
  { name: "Elena of Avalor Princess Crown Toy", price: 960 },
  { name: "Pokemon Masters Snapback Cap", price: 1440 },
  { name: "Pokemon Masters Snapback Cap - Variant", price: 1440 },
  { name: "Nike Air Jordan 1 Sneakers", price: 21600 },
  { name: "Nike Air Zoom Pegasus 36 Shoes", price: 14400 },
  { name: "Converse All-Star High-Top Sneakers", price: 9000 },
  { name: "Vans Old Skool Sneakers", price: 8400 },
  { name: "RTFKT Cyberpunk LED Sneakers", price: 9000 },
  { name: "Women's Classic High Heel Pumps", price: 3840 },
  { name: "Men's Leather Oxford Dress Shoe", price: 5760 },
  { name: "Men's Classic Polo Shirt", price: 2160 },
  { name: "Oversized Graphic T-Shirt - Black", price: 1800 },
  { name: "Oversized Graphic T-Shirt - White", price: 1800 },
  { name: "Black Flame Streetwear Hoodie", price: 3600 },
  { name: "Two-Tone Varsity Hoodie", price: 4200 },
  { "name": "Tommy Hilfiger Puffer Jacket", price: 9600 },
  { name: "Women's Ribbed Crop Top & Skirt", price: 2640 },
  { name: "Women's Belted Long Overcoat", price: 7800 },
  { name: "Vintage Washed Dad Hat", price: 1200 },
  { name: "Vintage Washed Dad Hat - Variant", price: 1200 },
  { name: "Tactical Half-Finger Combat Gloves", price: 1440 },
  { name: "Commuter Laptop Backpack", price: 3840 },
  { name: "Commuter Laptop Backpack - Variant", price: 3840 },
  { name: "Vintage Canvas Trekking Backpack", price: 4560 },
  { name: "Tactical Military Duffel Bag", price: 4200 },
  { name: "Minimalist Travel Shoulder Bag", price: 2160 },
  { name: "Women's Quilted Leather Handbag", price: 5040 },
  { name: "Freshwater Pearl Necklace", price: 2160 },
  { name: "Solitaire Gemstone Ring", price: 1200 },
  { name: "Raw Crystal Pendant Necklace", price: 1440 },
  { name: "Jade Donut Pendant Necklace", price: 1800 },
  { name: "Jashin Symbol Anime Necklace", price: 960 },
  { name: "Jashin Symbol Anime Necklace - Variant", price: 960 },
  { name: "Minimalist Fine Cable Chain", price: 600 },
  { name: "Curb Cuban Link Chain", price: 1440 },
  { name: "Classic Aviator Sunglasses", price: 1200 },
  { name: "Blue Light Blocking Optical Glasses", price: 1440 },
  { name: "Tactical Serrated Combat Knife", price: 1920 },
  { name: "iPhone 13 Pro Silicone Case", price: 960 },
  { name: "Clinical Anesthesia Workstation", price: 780000 },
  { name: "ICU Electric Hospital Bed Unit", price: 216000 },
  { name: "Vitacore-X Patient Monitor", price: 90000 },
  { name: "Sterile Medical Syringe", price: 36 },
  { name: "3-Ply Disposable Face Masks 50-Pack", price: 480 },
  { name: "Solid Wood Kung-Fu Tea Table", price: 30000 },
  { name: "Modular L-Shaped Sectional Sofa", price: 90000 },
  { name: "Nordic Desk Lamp", price: 3360 },
  { name: "Low-Poly Bedside Table Lamp", price: 2640 },
  { name: "Ergonomic Mesh Office Chair", price: 11400 },
  { name: "Smart Biometric Digital Door Lock", price: 14400 },
  { name: "Amber Glass Serum Dropper Bottle", price: 84 },
  { name: "Matte Cosmetic Squeeze Tube", price: 60 }
];

async function updatePrices() {
  await mongoose.connect(MONGODB_URI!);
  console.log('Connected to DB');
  let count = 0;
  for (const item of priceUpdates) {
    const updated = await Product.findOneAndUpdate(
      { name: item.name },
      { $set: { retailPrice: item.price } },
      { new: true }
    );
    if (updated) {
      console.log(`Updated price for: "${item.name}" to BDT ${item.price}`);
      count++;
    } else {
      console.log(`Product not found: "${item.name}"`);
    }
  }

  console.log(`Done updating ${count} products.`);
  process.exit(0);
}

updatePrices().catch(err => {
  console.error(err);
  process.exit(1);
});
