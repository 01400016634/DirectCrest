import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Product } from '@/lib/models/Schema';

export async function GET() {
  try {
    await dbConnect();
    
    // Clear existing featured products for a clean slate
    await Product.deleteMany({});

    const seedData = [
      {
        name: 'Xiaomi Redmi Note 13 Pro (Global ROM) 8GB/256GB',
        sku: 'XIAO-RN13P-256',
        category: 'Mobile Phones & Digital Gadgets',
        retailPrice: 210,
        status: 'PUBLISHED',
        isTrending: true,
        stock: 500,
        description: '8GB RAM / 256GB Storage, Snapdragon 7s Gen 2.'
      },
      {
        name: 'POCO X6 Pro 5G (Global Version) 12GB/512GB',
        sku: 'POCO-X6P-512',
        category: 'Mobile Phones & Digital Gadgets',
        retailPrice: 280,
        status: 'PUBLISHED',
        isTrending: true,
        stock: 300,
        description: '12GB RAM / 512GB Storage, Dimensity 8300-Ultra.'
      },
      {
        name: 'Huaqiangbei S9 Ultra Smartwatch',
        sku: 'HQB-S9-ULTRA',
        category: 'Mobile Phones & Digital Gadgets',
        retailPrice: 12.50,
        status: 'PUBLISHED',
        isTrending: true,
        stock: 1200,
        description: '49mm titanium alloy replica, AMOLED display, wireless charging.'
      },
      {
        name: '10,000mAh Magnetic Wireless Power Bank',
        sku: 'MAG-PB-10K',
        category: 'Mobile Phones & Digital Gadgets',
        retailPrice: 6.50,
        status: 'PUBLISHED',
        isTrending: true,
        stock: 2000,
        description: '22.5W fast charging, MagSafe compatible.'
      },
      {
        name: 'Men\'s Breathable Mesh Running Sneakers',
        sku: 'M-RUN-MESH-01',
        category: 'Sneakers & Footwear',
        retailPrice: 4.50,
        status: 'PUBLISHED',
        isTrending: false,
        stock: 1500,
        description: 'Ultra-lightweight EVA sole, OEM unbranded, slip-on design.'
      },
      {
        name: 'Nordic Style Washed Cotton Bedding Set',
        sku: 'NORD-BED-4PC',
        category: 'Home & Living Essentials',
        retailPrice: 12.00,
        status: 'PUBLISHED',
        isTrending: true,
        stock: 600,
        description: '4-piece set (1 duvet cover, 1 bedsheet, 2 pillowcases), minimalist solid colors.'
      },
      {
        name: 'Negative Ion High-Speed Hair Dryer',
        sku: 'ION-HD-110K',
        category: 'Beauty, Health & Trending Toys',
        retailPrice: 18.00,
        status: 'PUBLISHED',
        isTrending: true,
        stock: 850,
        description: '110,000 RPM brushless motor, magnetic nozzles (premium OEM alternative).'
      },
      {
        name: '4K Dual Camera Foldable RC Drone',
        sku: 'DRONE-4K-DUAL',
        category: 'Beauty, Health & Trending Toys',
        retailPrice: 14.50,
        status: 'PUBLISHED',
        isTrending: true,
        stock: 400,
        description: 'Optical flow positioning, headless mode, carrying case included.'
      }
    ];

    await Product.insertMany(seedData);

    return NextResponse.json({ message: 'Database seeded successfully', count: seedData.length });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
