const { MongoClient } = require('mongodb');

const uri = 'mongodb://reajulhasan3230_db_user:oWzhul79tjCDCG8E@ac-qipxgo4-shard-00-00.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-01.ddoczsm.mongodb.net:27017,ac-qipxgo4-shard-00-02.ddoczsm.mongodb.net:27017/directcrest?ssl=true&replicaSet=atlas-xf9mi7-shard-0&authSource=admin&appName=Cluster0';

const mapping = {
  "Apple iPhone 5s": "iphone_5s.glb",
  "Apple iPhone XS": "apple_iphone_xs__free.glb",
  "Apple iPhone 12 Pro": "iphone_12_pro.glb",
  "Apple iPhone 13 Pro Max": "apple_iphone_13_pro_max.glb",
  "Apple iPhone 13 Pro Max - Variant": "apple_iphone_13_pro_max (1).glb",
  "Apple iPhone 14 Pro": "iphone_14_pro.glb",
  "Apple iPhone 14 Pro Max": "iphone_14_pro_max.glb",
  "Apple iPhone 15 Pro Max": "iphone_15_pro_max.glb",
  "Apple iPhone 16": "iphone_16_base_model.glb",
  "Apple iPhone 16 Pro Max": "iphone_16_pro_max.glb",
  "Apple iPhone 17 - 6.3 inch": "apple_iphone_17_6.3.glb",
  "Apple iPhone 17 Air Concept": "iphone_17_air_concept.glb",
  "Apple iPhone 17 Pro Concept": "iphone_17_pro.glb",
  "Apple iPhone 17 Pro Concept - Variant": "iphone_17_pro (1).glb",
  "Apple iPhone 17 Pro - 6.3 inch": "apple_iphone_17_pro_6.3.glb",
  "Apple iPhone 17 Pro - 6.3 inch Variant": "apple_iphone_17_pro_6.3 (1).glb",
  "Apple iPhone 17 Pro Max Concept": "phone_17_pro_max.glb",
  "Apple iPhone 18 Pro Max Heritage Edition": "apple_iphone_18_pro_max_burgundy_2026.glb",
  "Apple iPhone Duo Concept": "apple_iphone_duo.glb",
  "Apple iPhone Duo Concept - Variant": "apple_iphone_duo (1).glb",
  "Apple iPhone Duo Fold Animated": "apple_iphone_duo_fold_star_white_2026_animated.glb",
  "Apple iPad Pro": "apple_ipad_pro.glb",
  "Samsung Galaxy S21 Ultra": "samsung_galaxy_s21_ultra.glb",
  "Samsung Galaxy S22 Ultra": "samsung_galaxy_s22_ultra.glb",
  "Samsung Galaxy S24 Ultra": "samsung_s24_ultra.glb",
  "Samsung Galaxy S25 Ultra Concept": "samsung_galaxy_s25_ultra.glb",
  "Samsung Galaxy S25 Ultra Concept - Variant": "samsung_galaxy_s25_ultra (1).glb",
  "Samsung Galaxy S26 Ultra Concept": "samsung_s_26_ultra_3d_model.glb",
  "Samsung Galaxy Z Flip 3": "samsung_galaxy_z_flip_3.glb",
  "Samsung Galaxy Z Fold 7 Concept": "samsung_galaxy_z_fold_7.glb",
  "OnePlus 13S Concept": "one_plus_13s_3d_model.glb",
  "Realme 12 5G": "realme_12_5g.glb",
  "Nothing Phone (4a)": "nothing_4a_3d_model.glb",
  "Vivo X80 Pro": "vivo_x80without_extra_textures.glb",
  "Vivo X200 Pro": "vivo_x200_pro_blue.glb",
  "Vivo X300 Ultra": "vivo_x300_ultra_black.glb",
  "Vivo X300 Ultra - Green": "vivo_x300_ultra_green.glb",
  "Apple MacBook Pro 2021": "macbook_pro_2021.glb",
  "Apple MacBook Pro 16-inch M3 2024": "macbook_pro_m3_16_inch_2024.glb",
  "Apple MacBook Pro 14-inch M5 Concept": "macbook_pro_14-inch_m5.glb",
  "HP Pavilion x360 Laptop": "laptop_hp_pavilion_x360.glb",
  "Apple AirPods Pro": "airpods_pro.glb",
  "Apple Watch Series 7": "apple_watch_series_7_-_free_watch-face_sdctm.glb",
  "Apple Watch Ultra 2": "apple_watch_ultra_2.glb",
  "Samsung Galaxy Watch 7": "samsung_galaxy_watch_7.glb",
  "Amazon Echo Dot 3rd Gen": "alexa_echo_dot_3.glb",
  "JBL Charge 3 Portable Speaker": "jbl_charge_3_speaker.glb",
  "JBL PartyBox 110 Speaker": "jbl_partybox_110.glb",
  "JBL T450 Wired Headphones": "jbl_t450.glb",
  "JBL Tune 720BT Wireless Headphones": "jbl_tune_720bt.glb",
  "JBL Tour One M2 Headphones": "jbl_tour_one_m2.glb",
  "JBL Tour Pro 2 TWS Earbuds": "jbl_tour_pro_2.glb",
  "JBL RGB Gaming Headphones": "jbl_headphone_changeable_colour.glb",
  "GoPro Hero 11 Black Mini": "gopro_hero_11_mini.glb",
  "GoPro Hero 13 Black": "gopro_hero_13_black.glb",
  "Insta360 ONE X2 Action Camera": "insta360_one_x2_sports_and_action_camera.glb",
  "50,000mAh Heavy Duty Power Bank": "fc50_power_bank.glb",
  "Chevrolet Corvette C6.R 1:18 Toy Car": "2010_chevrolet_corvette_c6.r.glb",
  "McLaren 650S GT3 1:24 Toy Car": "2015_mclaren_650s_gt3.glb",
  "McLaren 720S GT3 1:18 Toy Car": "2020_mclaren_720s_gt3.glb",
  "Porsche 992 GT3 R 1:18 Toy Car": "2024_porsche_992_gt3_r.glb",
  "BMW M3 GTR GT2 Toy Car": "bmw_m3_gtr_gt2.glb",
  "BMW M6 GT3 Toy Car": "bmw_m6_gt3.glb",
  "1963 Chevrolet C10 Vintage Pickup Toy": "low_poly_car_-_chevrolet_c10_pickup_1963.glb",
  "MD 500 Military RC Helicopter": "md_500.glb",
  "Neon Chrome Sci-Fi Toy Tank": "neon_chrome_-_tank.glb",
  "Transformers Optimus Prime Action Figure": "earth_wars_86_battle_damaged_optimus_prime.glb",
  "Elena of Avalor Princess Crown Toy": "elena_of_avalor_-_crown.glb",
  "Arcadia Wooden Longboard": "arcadia_longboard.glb",
  "OneWheel Pint Electric Board": "onewheel_pint.glb",
  "Nike Air Jordan 1 Sneakers": "air_jordan_1.glb",
  "Nike Air Zoom Pegasus 36 Shoes": "nike_air_zoom_pegasus_36.glb",
  "Converse All-Star High-Top Sneakers": "converse__free.glb",
  "Vans Old Skool Sneakers": "unused_blue_vans_shoe.glb",
  "RTFKT Cyberpunk LED Sneakers": "rtfkt_cyberpunk.glb",
  "Women's Classic High Heel Pumps": "classic_high_heel_pumps.glb",
  "Men's Leather Oxford Dress Shoe": "dress_shoe_left.glb",
  "Men's Classic Polo Shirt": "polo_shirt.glb",
  "Oversized Graphic T-Shirt - Black": "tshirt.glb",
  "Oversized Graphic T-Shirt - White": "tshirt (1).glb",
  "Black Flame Streetwear Hoodie": "classic_black_flame_hoodie.glb",
  "Two-Tone Varsity Hoodie": "green_and_white_hoodie.glb",
  "Tommy Hilfiger Puffer Jacket": "tommy_hilfiger_jacket.glb",
  "Women's Ribbed Crop Top & Skirt": "casual_clothes_crop_top_and_skirt.glb",
  "Women's Belted Long Overcoat": "female_overcoat.glb",
  "Pokemon Masters Snapback Cap": "pokemon_masters_cap.glb",
  "Pokemon Masters Snapback Cap - Variant": "pokemon_masters_cap (1).glb",
  "Vintage Washed Dad Hat": "hat_01__.rawscan..glb",
  "Vintage Washed Dad Hat - Variant": "hat_01__.rawscan (1).glb",
  "Tactical Half-Finger Combat Gloves": "military_gloves_half-finger_of_color_black_17.glb",
  "Commuter Laptop Backpack": "backpack.glb",
  "Commuter Laptop Backpack - Variant": "backpack (1).glb",
  "Vintage Canvas Trekking Backpack": "old_backpack__renewed_hope.glb",
  "Tactical Military Duffel Bag": "military_duffel_bag.glb",
  "Minimalist Travel Shoulder Bag": "groove_bags.glb",
  "Women's Quilted Leather Handbag": "female_bag.glb",
  "Freshwater Pearl Necklace": "pearl_necklace.glb",
  "Solitaire Gemstone Ring": "gem_ring2.glb",
  "Raw Crystal Pendant Necklace": "gemstone_necklace.glb",
  "Jade Donut Pendant Necklace": "donut_necklace.glb",
  "Jashin Symbol Anime Necklace": "jashin_necklace.glb",
  "Jashin Symbol Anime Necklace - Variant": "jashin_necklace (1).glb",
  "Minimalist Fine Cable Chain": "necklace.glb",
  "Curb Cuban Link Chain": "necklace_c.glb",
  "Classic Aviator Sunglasses": "aviator_sunglasses.glb",
  "Blue Light Blocking Optical Glasses": "glasses.glb",
  "Tactical Serrated Combat Knife": "cod4_tactical_knife-reimagined_game_ready.glb",
  "iPhone 13 Pro Silicone Case": "iphone13_pro_basic_case.glb",
  "Clinical Anesthesia Workstation": "anesthesia_machine.glb",
  "ICU Electric Hospital Bed Unit": "medical_bed_unit.glb",
  "Vitacore-X Patient Monitor": "vitacore-x_-_medical_equipment.glb",
  "Sterile Medical Syringe": "medical_syringe.glb",
  "3-Ply Disposable Face Masks 50-Pack": "face_masks.glb",
  "Solid Wood Kung-Fu Tea Table": "chinese_style_tea_table.glb",
  "Modular L-Shaped Sectional Sofa": "sofa_combination.glb",
  "Nordic Desk Lamp": "lamp.glb",
  "Low-Poly Bedside Table Lamp": "tabel_lapm_-_lowpoly.glb",
  "Ergonomic Mesh Office Chair": "office_chair.glb",
  "Smart Biometric Digital Door Lock": "lock_digital_door_computer.glb",
  "Amber Glass Serum Dropper Bottle": "cosmetic_product.glb",
  "Matte Cosmetic Squeeze Tube": "cosmetic_tube.glb"
};

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('directcrest');
    
    // First, let's unset all threeDModelUrls to clear any products that shouldn't have one
    await db.collection('products').updateMany({}, { $unset: { threeDModelUrl: "" } });
    
    let updated = 0;
    for (const [name, filename] of Object.entries(mapping)) {
      const url = `/3d_models/optimized/${filename}`;
      const result = await db.collection('products').updateOne(
        { name: name },
        { $set: { threeDModelUrl: url } }
      );
      if (result.modifiedCount > 0) {
        updated++;
      } else {
        console.log(`Warning: Product "${name}" not found in DB`);
      }
    }
    console.log(`Successfully updated ${updated} products with exact glb filenames.`);
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run();
