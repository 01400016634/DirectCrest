import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongoose';
import { Product } from '@/lib/models/Schema';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://directcrest.com';
  
  // Static routes
  const routes = [
    '',
    '/about',
    '/products',
    '/contact',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic Product routes
  try {
    await dbConnect();
    const products = await Product.find({ status: 'PUBLISHED' }).select('_id updatedAt').lean();
    
    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/products/${product._id.toString()}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

    return [...routes, ...productRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return routes;
  }
}
