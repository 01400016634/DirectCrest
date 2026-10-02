import mongoose from 'mongoose';
import { Product, Category } from './src/lib/models/Schema';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const productsRaw = `
TWS Bluetooth Earbuds with LED Display
Details: Bluetooth 5.3, digital battery readout case, noise reduction.
Wholesale: ¥25 | Selling Price in BD: ৳850

20W PD Type-C Fast Charger
Details: Compact travel wall adapter, supports quick charge for iPhone and Android.
Wholesale: ¥12 | Selling Price in BD: ৳550

Magnetic Wireless Power Bank (5000mAh)
Details: MagSafe-compatible slim snap-on battery pack with LED indicators.
Wholesale: ¥45 | Selling Price in BD: ৳1,450

Smart Fitness Band / Watch
Details: 1.4-inch color screen, heart-rate tracking, step counter, IP67 waterproof.
Wholesale: ¥40 | Selling Price in BD: ৳1,250

K8/K9 Wireless Lapel Microphone
Details: Plug-and-play lavalier mic for TikTok, vloggers, and content creators.
Wholesale: ¥18 | Selling Price in BD: ৳650

RGB Mobile Phone Radiator Cooler
Details: Semiconductor cooling fan for lag-free gaming (PUBG/Free Fire).
Wholesale: ¥22 | Selling Price in BD: ৳750

Conductive Gaming Finger Sleeves (Pair)
Details: Breathable silver-fiber touch sleeves, sweat-proof for mobile gaming.
Wholesale: ¥1.5 | Selling Price in BD: ৳120

Bluetooth Selfie Stick Tripod with Remote
Details: Extendable 3-in-1 monopod with detachable wireless shutter.
Wholesale: ¥20 | Selling Price in BD: ৳690

3-in-1 Braided Fast Charging Cable
Details: Simultaneous charging for Type-C, Micro-USB, and Lightning.
Wholesale: ¥6 | Selling Price in BD: ৳250

Waterproof Floating Phone Pouch
Details: Touch-sensitive clear PVC dry bag for rainy season and pools.
Wholesale: ¥3.5 | Selling Price in BD: ৳190

Adjustable Desktop Phone & Tablet Stand
Details: Foldable aluminum/ABS desk mount with weighted non-slip base.
Wholesale: ¥8 | Selling Price in BD: ৳320

Pocket Mini Bluetooth Speaker
Details: Ultra-compact waterproof wireless speaker with deep bass.
Wholesale: ¥18 | Selling Price in BD: ৳650

USB Rechargeable Neck Fan
Details: Bladeless hands-free personal cooler for commutes and load-shedding.
Wholesale: ¥24 | Selling Price in BD: ৳850

RGB Sound-Activated Rhythm Light
Details: Desktop ambient pickup audio light with multi-color spectrum.
Wholesale: ¥15 | Selling Price in BD: ৳550

1080P WiFi Mini Spy/Nanny Camera
Details: Night-vision magnetic wireless micro security camera.
Wholesale: ¥35 | Selling Price in BD: ৳1,200

Bluetooth Wireless Mobile Gamepad
Details: Ergonomic controller with telescopic clamp for mobile gaming.
Wholesale: ¥38 | Selling Price in BD: ৳1,350

10-Inch Desktop Ring Light with Tripod
Details: 3 lighting modes, USB powered, phone holder for live streaming.
Wholesale: ¥25 | Selling Price in BD: ৳850

6-in-1 Type-C Multi-Port Hub
Details: 4K HDMI, USB 3.0 ports, SD card reader, PD passthrough.
Wholesale: ¥32 | Selling Price in BD: ৳1,150

Rechargeable Fabric Shaver / Lint Remover
Details: Rotary stainless-steel blade head to restore sweaters and blankets.
Wholesale: ¥14 | Selling Price in BD: ৳490

Silicone Sleep Earplugs (Noise Reduction)
Details: Reusable ergonomic sound-blocking buds in a travel case.
Wholesale: ¥4 | Selling Price in BD: ৳220
`;

async function seedElectronics() {
  await mongoose.connect(MONGODB_URI!);
  console.log('Connected to DB');

  let category = await Category.findOne({ name: 'Electronics & Gadgets' });
  if (!category) {
    category = await Category.create({ name: 'Electronics & Gadgets' });
    console.log('Created Category: Electronics & Gadgets');
  }

  const blocks = productsRaw.trim().split('\n\n');
  const productsToInsert = [];

  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length >= 3) {
      const name = lines[0].trim();
      const details = lines[1].replace('Details:', '').trim();
      const pricingLine = lines[2];
      
      const wholesaleMatch = pricingLine.match(/Wholesale:\s*[¥$€£৳]?\s*([0-9.]+)/i);
      const retailMatch = pricingLine.match(/Selling Price in BD:\s*[¥$€£৳]?\s*([0-9.,]+)/i);

      let wholesale = 0;
      if (wholesaleMatch) wholesale = parseFloat(wholesaleMatch[1]);
      
      let retail = 0;
      if (retailMatch) retail = parseFloat(retailMatch[1].replace(/,/g, ''));

      productsToInsert.push({
        name,
        description: details,
        categoryId: category._id,
        retailPrice: retail,
        wholesaleStartingPrice: wholesale,
        status: 'PUBLISHED',
        stock: Math.floor(Math.random() * 500) + 100, // random stock between 100-600
        isFeatured: Math.random() > 0.5,
        isTrending: Math.random() > 0.7,
        isNewArrival: true,
        sku: 'ELEC-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        wholesaleTiers: [
          { minQuantity: 10, price: wholesale },
          { minQuantity: 50, price: wholesale * 0.9 },
          { minQuantity: 100, price: wholesale * 0.8 }
        ]
      });
    }
  }

  await Product.insertMany(productsToInsert);
  console.log(`Successfully seeded ${productsToInsert.length} products to "Electronics & Gadgets"`);
  
  process.exit(0);
}

seedElectronics().catch(err => {
  console.error(err);
  process.exit(1);
});
