/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProducts } from '@/actions/product';
import Link from 'next/link';
import DeleteProductButton from '@/components/admin/DeleteProductButton';

export default async function AdminProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const result = await getProducts({ limit: 1000 });
  
  if (!result.success) {
    console.error('Failed to fetch products in admin:', result.error);
  }
  
  const products = result.success ? result.products : [];
  const { locale } = await params;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Products CMS</h1>
          <p className="text-gray-400 mt-2">Manage your inventory, pricing, and 3D models.</p>
        </div>
        <Link href={`/${locale}/admin/products/new`} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-900/50 transition-all">
          + Add New Product
        </Link>
      </div>

      <div className="bg-[#18181b] rounded-2xl shadow-lg shadow-black overflow-x-auto border border-red-950">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-red-950/20">
              <th className="p-4 font-semibold text-gray-300">SKU</th>
              <th className="p-4 font-semibold text-gray-300">Name</th>
              <th className="p-4 font-semibold text-gray-300">Brand</th>
              <th className="p-4 font-semibold text-gray-300">Stock</th>
              <th className="p-4 font-semibold text-gray-300">Retail Price</th>
              <th className="p-4 font-semibold text-red-500">Supplier Cost</th>
              <th className="p-4 font-semibold text-gray-300">Status</th>
              <th className="p-4 font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-400">
            {products.map((product: any) => (
              <tr key={product._id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                <td className="p-4">{product.sku}</td>
                <td className="p-4 font-medium text-gray-100">{product.name}</td>
                <td className="p-4">{product.brandId?.name || product.brandId || product.brand?.name || product.brand || 'No Brand'}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">${product.retailPrice}</td>
                <td className="p-4 text-red-500 font-bold">${product.cost || 'N/A'}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.status === 'PUBLISHED' ? 'bg-green-900/30 text-green-400 border border-green-800/50' : 'bg-yellow-900/30 text-yellow-500 border border-yellow-800/50'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-4 flex space-x-4">
                  <Link href={`/${locale}/admin/products/${product._id}/edit`} className="text-gray-400 hover:text-white transition-colors">
                    Edit
                  </Link>
                  <DeleteProductButton productId={product._id.toString()} />
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">No products found. Start by adding one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
