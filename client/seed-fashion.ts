import mongoose from 'mongoose';
import { Product, Category } from './src/lib/models/Schema';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const productsRaw = `
Anti-Theft Sling Chest Bag with USB
Details: Water-resistant crossbody shoulder pack with combination lock.
Wholesale: ¥18 | Selling Price in BD: ৳750

RFID-Blocking Pop-Up Aluminum Wallet
Details: Minimalist cardholder with automatic slider lever mechanism.
Wholesale: ¥12 | Selling Price in BD: ৳490

Foldable Dry/Wet Separation Travel Duffle
Details: Expandable waterproof gym bag with trolley sleeve.
Wholesale: ¥16 | Selling Price in BD: ৳650

Heavy-Duty Aesthetic Clear Mesh Backpack
Details: Breathable see-through school and commute pack.
Wholesale: ¥22 | Selling Price in BD: ৳890

Seamless High-Waist Tummy Control Shaper
Details: Elastic slimming underwear with anti-slip silicone band.
Wholesale: ¥8 | Selling Price in BD: ৳350

Quick-Release Tactical Nylon Belt
Details: Heavy-duty alloy buckle military-style utility waist belt.
Wholesale: ¥7 | Selling Price in BD: ৳320

Photochromic Day & Night Driving Glasses
Details: Polarized UV400 lenses that darken under direct sunlight.
Wholesale: ¥11 | Selling Price in BD: ৳450

Stainless Steel Cuban Chain Necklace
Details: Non-tarnish waterproof curb link chain for men and women.
Wholesale: ¥6 | Selling Price in BD: ৳290

Vintage PU Leather Underarm Shoulder Bag
Details: Classic baguette tote with zipper closure for everyday wear.
Wholesale: ¥24 | Selling Price in BD: ৳950

Magnetic Couple Attraction Bracelets (Pair)
Details: Braided rope matching charm bracelets for relationships.
Wholesale: ¥4 | Selling Price in BD: ৳220

Retro Vintage Small Square Sunglasses
Details: 90s aesthetic narrow rectangular UV-blocking shades.
Wholesale: ¥5 | Selling Price in BD: ৳250

Elastic No-Tie Shoelaces with Metal Lock
Details: Stretch tieless shoestring capsules for sneakers.
Wholesale: ¥2.5 | Selling Price in BD: ৳150

Multi-Pocket Canvas Tote Bag
Details: Large commuter handbag with zipper and inner compartments.
Wholesale: ¥15 | Selling Price in BD: ৳590

Sweat-Wicking Non-Slip Sports Headband
Details: Moisture-absorbing elastic athletic band for workout and running.
Wholesale: ¥3 | Selling Price in BD: ৳160

Portable Mini Travel Jewelry Case
Details: PU leather travel organizer for rings, earrings, and necklaces.
Wholesale: ¥9 | Selling Price in BD: ৳390

Silicone Waterproof Rain Shoe Covers
Details: Reusable non-slip boot protectors for monsoon puddles.
Wholesale: ¥6 | Selling Price in BD: ৳280

Seamless Wire-Free Push-Up Bralette
Details: Deep-V breathable everyday contour bra.
Wholesale: ¥10 | Selling Price in BD: ৳420

Graduated Compression Running Socks
Details: Knee-high circulation-boosting socks for swelling relief.
Wholesale: ¥6 | Selling Price in BD: ৳270

Anti-Blue Light Computer Glasses
Details: TR90 lightweight frame to block screen glare and eye fatigue.
Wholesale: ¥6 | Selling Price in BD: ৳290

Ultra-Lightweight Slip-On Mesh Sneakers
Details: Breathable soft-sole walking shoes for daily transit.
Wholesale: ¥28 | Selling Price in BD: ৳1,150
`;

async function seedFashion() {
  await mongoose.connect(MONGODB_URI!);
  console.log('Connected to DB');

  let category = await Category.findOne({ name: 'Fashion & Clothing' });
  if (!category) {
    category = await Category.create({ name: 'Fashion & Clothing' });
    console.log('Created Category: Fashion & Clothing');
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
        stock: Math.floor(Math.random() * 500) + 100,
        isFeatured: Math.random() > 0.5,
        isTrending: Math.random() > 0.7,
        isNewArrival: true,
        sku: 'FASH-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        wholesaleTiers: [
          { minQuantity: 10, price: wholesale },
          { minQuantity: 50, price: wholesale * 0.9 },
          { minQuantity: 100, price: wholesale * 0.8 }
        ]
      });
    }
  }

  await Product.insertMany(productsToInsert);
  console.log(`Successfully seeded ${productsToInsert.length} products to "Fashion & Clothing"`);
  
  process.exit(0);
}

seedFashion().catch(err => {
  console.error(err);
  process.exit(1);
});
