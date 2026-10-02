/* eslint-disable @typescript-eslint/no-explicit-any */
import { getVariants, deleteVariant } from '@/actions/variant';
import VariantForm from '@/components/admin/VariantForm';
import Link from 'next/link';

export default async function AdminVariantsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  
  const result = await getVariants(productId);
  const variants = result.success ? result.variants : [];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Variants CMS</h1>
        <Link href="/admin/products" className="text-blue-600 hover:underline">
          &larr; Back to Products
        </Link>
      </div>
      
      <VariantForm productId={productId} />

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-4 font-semibold">SKU</th>
              <th className="p-4 font-semibold">Variant Name</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant: any) => (
              <tr key={variant._id} className="border-b hover:bg-slate-50">
                <td className="p-4">{variant.sku}</td>
                <td className="p-4 font-medium">{variant.name}</td>
                <td className="p-4">${variant.price}</td>
                <td className="p-4">
                  <form action={async () => {
                    'use server';
                    await deleteVariant(variant._id, productId);
                  }}>
                    <button type="submit" className="text-red-600 hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {variants.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-500">No variants found for this product.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
