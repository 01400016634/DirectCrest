import mongoose from 'mongoose';
import { Product, Category } from './src/lib/models/Schema';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const productsRaw = `
Hydrocolloid Acne Pimple Patches (36 pcs)
Details: Invisible spot-absorbing stickers for blemish extraction.
Wholesale: ¥3 | Selling Price in BD: ৳220

Jade Roller & Gua Sha Facial Tool
Details: Natural stone set for lymphatic drainage and reducing facial puffiness.
Wholesale: ¥12 | Selling Price in BD: ৳490

Ultrasonic Facial Skin Scrubber
Details: Deep pore spatula for blackhead removal and serum infusion.
Wholesale: ¥30 | Selling Price in BD: ৳1,150

Silicone Scalp Massage Shampoo Brush
Details: Soft bristles for dandruff removal and scalp blood circulation.
Wholesale: ¥3 | Selling Price in BD: ৳180

Electric 4-in-1 Facial Cleansing Brush
Details: Rotating waterproof scrubber with exfoliating and soft brush heads.
Wholesale: ¥18 | Selling Price in BD: ৳650

Portable Nano Hydrating Mist Sprayer
Details: Pocket USB water vaporizer for instant skin hydration.
Wholesale: ¥6 | Selling Price in BD: ৳280

Vacuum Blackhead Suction Remover
Details: 3-speed electronic pore vacuum with interchangeable nozzle heads.
Wholesale: ¥24 | Selling Price in BD: ৳850

Heated USB Eyelash Curler
Details: Quick-heating temperature-controlled curved silicone curler.
Wholesale: ¥14 | Selling Price in BD: ৳520

Nano Crystal Painless Hair Eraser
Details: Physical exfoliating hair removal tool for arms and legs.
Wholesale: ¥5 | Selling Price in BD: ৳250

13-Piece Soft Bristle Makeup Brush Set
Details: Complete powder, foundation, and eye brush kit in a matching pouch.
Wholesale: ¥16 | Selling Price in BD: ৳600

Adjustable Clavicle Posture Corrector
Details: Breathable back support brace to fix slouching and shoulder pain.
Wholesale: ¥15 | Selling Price in BD: ৳550

Pocket Deep-Tissue Mini Massage Gun
Details: 4 interchangeable heads, USB-C rechargeable, muscular recovery.
Wholesale: ¥38 | Selling Price in BD: ৳1,350

Electric Heated Shiatsu Neck Massager
Details: 3D kneading rollers for neck, shoulder, and lower back relief.
Wholesale: ¥45 | Selling Price in BD: ৳1,600

Electric Callus Foot Grinder
Details: Motorized roller pedicure file to remove dead skin and calluses.
Wholesale: ¥16 | Selling Price in BD: ৳590

Reusable Silicone Anti-Wrinkle Eye Pads
Details: Medical-grade silicone patches to lift under-eye wrinkles.
Wholesale: ¥4 | Selling Price in BD: ৳200

Painless Eyebrow Trimmer Pen
Details: Precision micro-blade electric razor for eyebrow shaping.
Wholesale: ¥8 | Selling Price in BD: ৳350

Silicone Anti-Snoring Nose Clip
Details: Magnetic breathing dilator to clear airways and reduce snoring.
Wholesale: ¥3 | Selling Price in BD: ৳180

Compression Knee Support Sleeve
Details: Elastic silicone-padded knee brace for gym and joint pain.
Wholesale: ¥9 | Selling Price in BD: ৳380

Bluetooth Sleep Eye Mask with Headphones
Details: Blackout padded mask with integrated slim flat speakers.
Wholesale: ¥28 | Selling Price in BD: ৳990

Silicone Ice Face Roller
Details: Refillable ice mold for facial cryotherapy, depuffing, and pores.
Wholesale: ¥7 | Selling Price in BD: ৳320
`;

async function seedHealthBeauty() {
  await mongoose.connect(MONGODB_URI!);
  console.log('Connected to DB');

  let category = await Category.findOne({ name: 'Health & Beauty' });
  if (!category) {
    category = await Category.create({ name: 'Health & Beauty' });
    console.log('Created Category: Health & Beauty');
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
        sku: 'HBTN-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        wholesaleTiers: [
          { minQuantity: 10, price: wholesale },
          { minQuantity: 50, price: wholesale * 0.9 },
          { minQuantity: 100, price: wholesale * 0.8 }
        ]
      });
    }
  }

  await Product.insertMany(productsToInsert);
  console.log(`Successfully seeded ${productsToInsert.length} products to "Health & Beauty"`);
  
  process.exit(0);
}

seedHealthBeauty().catch(err => {
  console.error(err);
  process.exit(1);
});
