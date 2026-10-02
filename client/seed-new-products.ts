import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Define the Category schema based on what's expected
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

// Define the product schema based on the actual model
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  retailPrice: { type: Number, required: true },
  wholesalePrice: { type: Number },
  cost: { type: Number },
  stock: { type: Number, default: 0 },
  brand: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  threeDModelUrl: { type: String },
  glbModelPath: { type: String },
  imageUrl: { type: String },
  status: { type: String, default: 'PUBLISHED' },
  condition: { type: String, default: 'NEW' },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const categoryData = [
  'Home & Furniture',
  'Medical & Office Equipment',
  'Bags, Travel & Outdoor',
  'Fashion, Footwear & Accessories',
  'Laptops, Wearables & Gadgets',
  'Toys, RC & Die-Cast Collectibles'
];

const newProducts = [
  // Home & Furniture
  { cat: 'Home & Furniture', brand: 'Generic', name: 'Modular L-Shaped Sectional Sofa', price: 120.00, file: 'sofa_combination.glb', desc: 'A luxurious and modern modular L-shaped sectional sofa. Designed for maximum comfort with premium fabric upholstery and a sturdy frame. Perfect for contemporary living spaces.' },
  { cat: 'Home & Furniture', brand: 'Generic', name: 'Solid Wood Kung-Fu Tea Table', price: 38.00, file: 'chinese_style_tea_table.glb', desc: 'Traditional solid wood Kung-Fu tea table. Features exquisite craftsmanship, natural wood grain finish, and built-in drainage system for an authentic tea ceremony experience.' },
  
  // Medical & Office Equipment
  { cat: 'Medical & Office Equipment', brand: 'Generic', name: 'Clinical Anesthesia Workstation', price: 650.00, file: 'anesthesia_machine.glb', desc: 'Advanced clinical anesthesia workstation with integrated ventilator, precision vaporizers, and comprehensive patient monitoring capabilities. Ensures maximum patient safety.' },
  { cat: 'Medical & Office Equipment', brand: 'Generic', name: 'ICU Electric Hospital Bed Unit', price: 280.00, file: 'medical_bed_unit.glb', desc: 'Fully electric ICU hospital bed with multi-function positioning, side rails, and integrated controls. Designed for critical care environments and patient comfort.' },
  { cat: 'Medical & Office Equipment', brand: 'Generic', name: 'Vitacore-X Diagnostic Monitor', price: 160.00, file: 'vitacore-x_-_medical_equipment.glb', desc: 'High-resolution diagnostic medical monitor providing accurate color reproduction and crystal-clear imaging for precise clinical evaluations.' },
  { cat: 'Medical & Office Equipment', brand: 'Generic', name: 'High-Back Mesh Office Chair', price: 32.00, file: 'office_chair.glb', desc: 'Ergonomic high-back office chair with breathable mesh back, adjustable lumbar support, and smooth-rolling casters. Ideal for long hours of productive work.' },
  { cat: 'Medical & Office Equipment', brand: 'Generic', name: 'Smart Biometric Digital Lock', price: 28.00, file: 'lock_digital_door_computer.glb', desc: 'Next-generation smart door lock featuring biometric fingerprint recognition, PIN code access, and advanced encryption for ultimate office security.' },
  
  // Bags, Travel & Outdoor
  { cat: 'Bags, Travel & Outdoor', brand: 'Generic', name: 'Tactical Military Duffel (55L)', price: 9.40, file: 'military_duffel_bag.glb', desc: 'Rugged 55L tactical military duffel bag. Constructed with heavy-duty water-resistant nylon, reinforced stitching, and multiple MOLLE webbing attachment points.' },
  { cat: 'Bags, Travel & Outdoor', brand: 'Generic', name: 'Vintage Washed Canvas Rucksack', price: 8.90, file: 'old_backpack__renewed_hope.glb', desc: 'Stylish vintage washed canvas rucksack. Features genuine leather accents, spacious main compartment, and durable brass hardware. Perfect for urban commuting or weekend getaways.' },
  { cat: 'Bags, Travel & Outdoor', brand: 'Generic', name: 'Quilted Leather Handbag', price: 6.20, file: 'female_bag.glb', desc: 'Elegant quilted leather handbag with a premium chain strap. A timeless accessory that perfectly blends sophistication with everyday practicality.' },
  { cat: 'Bags, Travel & Outdoor', brand: 'Generic', name: 'Commuter Laptop Backpack', price: 5.20, file: 'backpack.glb', desc: 'Sleek commuter laptop backpack with padded compartment for 15-inch laptops. Ergonomic design, water-resistant exterior, and hidden anti-theft pockets.' },
  { cat: 'Bags, Travel & Outdoor', brand: 'Groove', name: 'Minimalist Travel Shoulder Bag', price: 4.80, file: 'groove_bags.glb', desc: 'Ultra-lightweight minimalist travel shoulder bag by Groove. Designed for essentials, featuring quick-access pockets and an adjustable cross-body strap.' },

  // Fashion, Footwear & Accessories
  { cat: 'Fashion, Footwear & Accessories', brand: 'Converse', name: 'Classic All-Star High-Tops', price: 4.20, file: 'converse__free.glb', desc: 'The iconic Classic All-Star High-Top sneakers. Canvas upper, classic rubber toe cap, and unmistakable star ankle patch. A staple for any wardrobe.' },
  { cat: 'Fashion, Footwear & Accessories', brand: 'Nike', name: 'Air Jordan 1 Retro High Top', price: 14.80, file: 'air_jordan_1.glb', desc: 'Legendary Air Jordan 1 Retro High Tops. Premium leather construction, encapsulated Air-Sole unit, and timeless court-inspired style.' },
  { cat: 'Fashion, Footwear & Accessories', brand: 'Nike', name: 'Air Zoom Pegasus 36', price: 11.50, file: 'nike_air_zoom_pegasus_36.glb', desc: 'Nike Air Zoom Pegasus 36 running shoes. Engineered mesh upper for breathability, slim collar, and Zoom Air cushioning for a responsive ride.' },
  { cat: 'Fashion, Footwear & Accessories', brand: 'RTFKT', name: 'Cyberpunk LED Sneakers', price: 26.00, file: 'rtfkt_cyberpunk.glb', desc: 'Futuristic Cyberpunk LED sneakers by RTFKT. Features dynamic programmable LED strips, chunky bold silhouette, and next-gen cushioning technology.' },
  { cat: 'Fashion, Footwear & Accessories', brand: 'Tommy H.', name: 'Signature Puffer Jacket', price: 16.50, file: 'tommy_hilfiger_jacket.glb', desc: 'Signature Tommy Hilfiger puffer jacket. Insulated for superior warmth, featuring the classic logo embroidery and a modern, flattering fit.' },
  { cat: 'Fashion, Footwear & Accessories', brand: 'Vans', name: 'Old Skool Low-Top Suede', price: 5.60, file: 'unused_blue_vans_shoe.glb', desc: 'Vans Old Skool low-top skate shoes in premium suede. Features the iconic side stripe, reinforced toecaps, and signature rubber waffle outsoles.' },
  { cat: 'Fashion, Footwear & Accessories', brand: 'Generic', name: 'Black Flame Streetwear Hoodie', price: 7.50, file: 'classic_black_flame_hoodie.glb', desc: 'Heavyweight black streetwear hoodie with striking flame graphics. Relaxed drop-shoulder fit, premium cotton blend, and ribbed cuffs.' },
  { cat: 'Fashion, Footwear & Accessories', brand: 'Generic', name: 'Oversized Graphic T-Shirt (Black)', price: 2.80, file: 'tshirt.glb', desc: 'Essential oversized black graphic t-shirt. Soft, breathable cotton construction with a bold contemporary print for an effortless streetwear look.' },

  // Laptops, Wearables & Gadgets
  { cat: 'Laptops, Wearables & Gadgets', brand: 'Apple', name: 'MacBook Pro 14-inch M5 Concept', price: 790.00, file: 'macbook_pro_14-inch_m5.glb', desc: 'Concept MacBook Pro 14-inch featuring the next-generation M5 chip. Unprecedented performance, stunning Liquid Retina XDR display, and all-day battery life.' },
  { cat: 'Laptops, Wearables & Gadgets', brand: 'Apple', name: 'MacBook Pro 16-inch M3 Max', price: 680.00, file: 'macbook_pro_m3_16_inch_2024.glb', desc: 'Powerful MacBook Pro 16-inch with M3 Max chip. Built for extreme workflows, featuring massive unified memory and incredible graphics performance.' },
  { cat: 'Laptops, Wearables & Gadgets', brand: 'Apple', name: 'Watch Ultra 2 Rugged (49mm)', price: 24.00, file: 'apple_watch_ultra_2.glb', desc: 'Apple Watch Ultra 2 with a 49mm aerospace-grade titanium case. The ultimate rugged smartwatch for extreme sports, diving, and outdoor adventures.' },
  { cat: 'Laptops, Wearables & Gadgets', brand: 'Apple', name: 'AirPods Pro OEM Replica', price: 8.50, file: 'airpods_pro.glb', desc: 'High-quality OEM replica of AirPods Pro. Features active noise cancellation, transparency mode, and spatial audio support.' },
  { cat: 'Laptops, Wearables & Gadgets', brand: 'GoPro', name: 'Hero 13 Black Action Camera', price: 68.00, file: 'gopro_hero_13_black.glb', desc: 'GoPro Hero 13 Black action camera. Capture stunning 5.3K video, hyper-smooth stabilization, and incredible low-light performance.' },
  { cat: 'Laptops, Wearables & Gadgets', brand: 'HP', name: 'Pavilion x360 2-in-1 (14-inch)', price: 185.00, file: 'laptop_hp_pavilion_x360.glb', desc: 'Versatile HP Pavilion x360 14-inch 2-in-1 convertible laptop. Features a responsive touchscreen, powerful processor, and flexible 360-degree hinge.' },
  { cat: 'Laptops, Wearables & Gadgets', brand: 'Insta360', name: 'ONE X2 360-Degree Camera', price: 55.00, file: 'insta360_one_x2_sports_and_action.glb', desc: 'Insta360 ONE X2 pocket 360-degree action camera. Shoot in every direction with 5.7K resolution, invisible selfie stick effect, and AI editing.' },
  { cat: 'Laptops, Wearables & Gadgets', brand: 'JBL', name: 'PartyBox 110 High-Power', price: 48.00, file: 'jbl_partybox_110.glb', desc: 'JBL PartyBox 110 portable party speaker. Massive JBL Original Pro Sound, dynamic built-in light show, and splash-proof design.' },
  { cat: 'Laptops, Wearables & Gadgets', brand: 'JBL', name: 'Tour One M2 Over-Ear ANC', price: 24.00, file: 'jbl_tour_one_m2.glb', desc: 'JBL Tour One M2 over-ear headphones. True Adaptive Noise Cancelling, immersive spatial audio, and up to 50 hours of playback time.' },
  { cat: 'Laptops, Wearables & Gadgets', brand: 'JBL', name: 'Charge 3 Waterproof Speaker', price: 11.50, file: 'jbl_charge_3_speaker.glb', desc: 'JBL Charge 3 waterproof portable Bluetooth speaker. Delivers powerful stereo sound and acts as a power bank to charge your devices.' },
  { cat: 'Laptops, Wearables & Gadgets', brand: 'Samsung', name: 'Galaxy Watch 7 (44mm)', price: 22.50, file: 'samsung_galaxy_watch_7.glb', desc: 'Samsung Galaxy Watch 7 44mm. Advanced health tracking, personalized sleep coaching, and seamless integration with the Galaxy ecosystem.' },

  // Toys, RC & Die-Cast Collectibles
  { cat: 'Toys, RC & Die-Cast Collectibles', brand: 'Arcadia', name: 'Classic Wooden Longboard', price: 23.00, file: 'arcadia_longboard.glb', desc: 'Classic wooden longboard by Arcadia. Features a flexible bamboo/maple deck, smooth-rolling polyurethane wheels, and responsive trucks for cruising.' },
  { cat: 'Toys, RC & Die-Cast Collectibles', brand: 'BMW', name: 'M6 GT3 1:18 Scale Endurance', price: 22.00, file: 'bmw_m6_gt3.glb', desc: 'Highly detailed 1:18 scale die-cast replica of the BMW M6 GT3 endurance racer. Features authentic livery, opening doors, and detailed interior.' },
  { cat: 'Toys, RC & Die-Cast Collectibles', brand: 'Chevrolet', name: 'Corvette C6.R 1:18 Race', price: 18.50, file: '2010_chevrolet_corvette_c6.r.glb', desc: '1:18 scale model of the legendary 2010 Chevrolet Corvette C6.R race car. Meticulous aerodynamic details, race interior, and sponsor decals.' },
  { cat: 'Toys, RC & Die-Cast Collectibles', brand: 'Chevrolet', name: '1963 C10 Vintage Pickup', price: 5.40, file: 'low_poly_car_-_chevrolet_c10_pickup_1963.glb', desc: 'Stylized low-poly 1963 Chevrolet C10 vintage pickup truck model. A charming collectible perfect for desk display or architectural dioramas.' },
  { cat: 'Toys, RC & Die-Cast Collectibles', brand: 'McLaren', name: '720S GT3 1:18 Alloy Replica', price: 21.00, file: '2020_mclaren_720s_gt3.glb', desc: 'Premium 1:18 scale alloy replica of the 2020 McLaren 720S GT3. Stunning aerodynamic curves, detailed engine bay, and aggressive race stance.' },
  { cat: 'Toys, RC & Die-Cast Collectibles', brand: 'OneWheel', name: 'Pint Electric Self-Balancing', price: 245.00, file: 'onewheel_pint.glb', desc: 'The OneWheel Pint. A compact, fun, and highly maneuverable electric self-balancing board for urban commuting and carving up pavement.' },
  { cat: 'Toys, RC & Die-Cast Collectibles', brand: 'Porsche', name: '2024 992 GT3 R 1:18 Scale', price: 24.50, file: '2024_porsche_992_gt3_r.glb', desc: 'Exceptional 1:18 scale model of the 2024 Porsche 992 GT3 R. Incredibly detailed track-focused aerodynamics, massive rear wing, and realistic chassis.' },
  { cat: 'Toys, RC & Die-Cast Collectibles', brand: 'Transformers', name: 'Battle-Damaged Optimus Prime', price: 16.00, file: 'earth_wars_86_battle_damaged_optimus_prime.glb', desc: 'Earth Wars \'86 Battle-Damaged Optimus Prime collectible figure. Features authentic battle weathering, iconic blaster, and premium articulation.' }
];

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // 1. Ensure categories exist
    console.log('Ensuring categories exist...');
    const catMap: Record<string, mongoose.Types.ObjectId> = {};
    for (const catName of categoryData) {
      let category = await Category.findOne({ name: catName });
      if (!category) {
        category = await Category.create({
          name: catName,
          slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: `Explore our collection of ${catName}`
        });
        console.log(`Created category: ${catName}`);
      }
      catMap[catName] = category._id;
    }

    // 2. Insert Products
    console.log('Seeding products...');
    let addedCount = 0;
    
    for (const p of newProducts) {
      const sku = `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // We assume the user placed files in public/3d_models
      // Format the file path carefully just in case it has leading slashes in the screenshot
      const cleanFileName = p.file.replace(/^\//, '');
      const modelUrl = `/3d_models/${cleanFileName}`;
      
      const newProduct = new Product({
        name: p.name,
        description: p.desc,
        sku: sku,
        brand: p.brand,
        retailPrice: p.price,
        wholesalePrice: p.price * 0.8, // 20% off for wholesale
        cost: p.price * 0.5,           // 50% profit margin
        stock: 500,
        category: catMap[p.cat],
        threeDModelUrl: modelUrl,
        glbModelPath: modelUrl,
        status: 'PUBLISHED',
        condition: 'NEW'
      });

      await newProduct.save();
      addedCount++;
      console.log(`+ Added: ${p.name}`);
    }

    console.log(`\n🎉 Success! Added ${addedCount} new products with 3D model paths.`);
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seedData();
