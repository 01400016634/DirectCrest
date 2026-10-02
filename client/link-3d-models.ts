import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

// Ensure you have a MONGODB_URI in your .env.local
const MONGODB_URI = process.env.MONGODB_URI;

const productSchema = new mongoose.Schema({
  sku: String,
  threeDModelUrl: String,
  glbModelPath: String, // In case you use this field name on the backend
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function linkModels() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const modelsDir = path.join(process.cwd(), 'public', '3d_models');
    
    if (!fs.existsSync(modelsDir)) {
      console.error(`❌ Directory not found: ${modelsDir}`);
      console.error('Please move your 3d_models folder inside client/public/');
      process.exit(1);
    }

    const files = fs.readdirSync(modelsDir);
    const glbFiles = files.filter(f => f.endsWith('.glb') || f.endsWith('.gltf'));
    
    console.log(`Found ${glbFiles.length} 3D models in public/3d_models/`);

    let updatedCount = 0;

    for (const file of glbFiles) {
      // Assuming filename matches the SKU (e.g., 'APPL-IP15PM-256.glb' -> SKU: 'APPL-IP15PM-256')
      const sku = file.replace(/\.(glb|gltf)$/, '');
      const modelUrl = `/3d_models/${file}`;

      // Update the product matching the SKU
      const result = await Product.updateOne(
        { sku: sku },
        { 
          $set: { 
            threeDModelUrl: modelUrl,
            glbModelPath: modelUrl // Updating both fields just in case!
          } 
        }
      );

      if (result.matchedCount > 0) {
        console.log(`🔗 Linked ${file} to product SKU: ${sku}`);
        updatedCount++;
      } else {
        console.log(`⚠️ No product found with SKU: ${sku} (for file ${file})`);
      }
    }

    console.log(`\n🎉 Finished! Successfully linked ${updatedCount} models to products.`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

linkModels();
