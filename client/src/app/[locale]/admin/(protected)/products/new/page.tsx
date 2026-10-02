import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Add New Product</h1>
        <p className="text-gray-400 mt-2">Upload your product details, pricing, and 3D (.glb) models.</p>
      </div>
      <ProductForm />
    </div>
  );
}
