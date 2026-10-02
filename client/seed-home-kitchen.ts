import mongoose from 'mongoose';
import { Product, Category } from './src/lib/models/Schema';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const productsRaw = `
Portable USB Smoothie Blender
Details: 6-blade rechargeable personal juicer bottle for shakes on the go.
Wholesale: ¥22 | Selling Price in BD: ৳850

12-in-1 Multifunctional Vegetable Chopper
Details: Manual slicer, dicer, and grater with catch container and drain basket.
Wholesale: ¥28 | Selling Price in BD: ৳990

Handheld Mini Heat Sealer with Cutter
Details: 2-in-1 portable bag resealer for snack freshness.
Wholesale: ¥6 | Selling Price in BD: ৳290

Automatic Electric Water Dispenser Pump
Details: Rechargeable pump that fits standard 5-gallon water carboys.
Wholesale: ¥12 | Selling Price in BD: ৳480

Glass Oil Sprayer Bottle for Air Fryer
Details: Fine mist spray bottle for controlled cooking oil distribution.
Wholesale: ¥8 | Selling Price in BD: ৳350

360° Rotating Faucet Aerator Filter
Details: Splash-proof dual spray nozzle with built-in mineral filter.
Wholesale: ¥6 | Selling Price in BD: ৳260

Silicone Stretch Lids (Set of 6)
Details: Airtight, reusable food preservation covers for bowls and fruits.
Wholesale: ¥5 | Selling Price in BD: ৳240

Non-Stick Silicone Spatula & Egg Tongs
Details: 2-in-1 grip and flip silicone clamp spatula for omelets.
Wholesale: ¥5 | Selling Price in BD: ৳220

Under-Sink 2-Tier Sliding Drawer Rack
Details: Space-saving storage organizer with hooks for kitchen or bath.
Wholesale: ¥32 | Selling Price in BD: ৳1,200

5-Blade Stainless Steel Herb Scissors
Details: Multi-shear culinary scissors with cleaning comb.
Wholesale: ¥7 | Selling Price in BD: ৳290

3-Stage Diamond Ceramic Knife Sharpener
Details: Quick manual edge-restoring whetstone kitchen tool.
Wholesale: ¥8 | Selling Price in BD: ৳340

Super Absorbent Quick-Dry Floor Mat
Details: Diatomite rubber-backed non-slip bathroom runner.
Wholesale: ¥9 | Selling Price in BD: ৳380

Triangular Corner Sink Strainer Basket
Details: Hanging filter mesh for food waste disposal and leftover collection.
Wholesale: ¥3 | Selling Price in BD: ৳160

Reusable Lint & Pet Fur Remover Roller
Details: Self-cleaning base brush for sofas, clothes, and rugs.
Wholesale: ¥9 | Selling Price in BD: ৳390

Waterproof Mildew-Resistant Caulk Tape
Details: Self-adhesive PVC sealing strip for sink borders and toilets.
Wholesale: ¥4 | Selling Price in BD: ৳200

Collapsible Silicone Funnel Set
Details: Food-grade folding funnels for liquid transfer.
Wholesale: ¥2.5 | Selling Price in BD: ৳140

Wall-Mounted Toothpaste Squeezer Dispenser
Details: Punch-free automatic vacuum dispenser with toothbrush rack.
Wholesale: ¥14 | Selling Price in BD: ৳550

Reusable Silicone Air Fryer Liner Pan
Details: Heat-resistant, non-stick reusable baking bowl with handles.
Wholesale: ¥6 | Selling Price in BD: ৳280

Handheld Electric Milk Frother
Details: Stainless steel whisk for coffee foam, matcha, and beat eggs.
Wholesale: ¥5.5 | Selling Price in BD: ৳260

Stainless Steel Pineapple Peeler & Corer
Details: Spiral coring machine that slices rings in seconds.
Wholesale: ¥7 | Selling Price in BD: ৳320
`;

async function seedHomeKitchen() {
  await mongoose.connect(MONGODB_URI!);
  console.log('Connected to DB');

  let category = await Category.findOne({ name: 'Home & Kitchen (Problem-Solving Gadgets)' });
  if (!category) {
    category = await Category.create({ name: 'Home & Kitchen (Problem-Solving Gadgets)' });
    console.log('Created Category: Home & Kitchen (Problem-Solving Gadgets)');
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
        sku: 'HMG-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        wholesaleTiers: [
          { minQuantity: 10, price: wholesale },
          { minQuantity: 50, price: wholesale * 0.9 },
          { minQuantity: 100, price: wholesale * 0.8 }
        ]
      });
    }
  }

  await Product.insertMany(productsToInsert);
  console.log(`Successfully seeded ${productsToInsert.length} products to "Home & Kitchen (Problem-Solving Gadgets)"`);
  
  process.exit(0);
}

seedHomeKitchen().catch(err => {
  console.error(err);
  process.exit(1);
});
