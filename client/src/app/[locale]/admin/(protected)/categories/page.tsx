/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCategories, deleteCategory } from '@/actions/category';
import CategoryForm from '@/components/admin/CategoryForm';

export default async function AdminCategoriesPage() {
  const result = await getCategories();
  const categories = result.success ? result.categories : [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Categories CMS</h1>
        <p className="text-gray-400 mt-2">Organize your store hierarchy and product categories.</p>
      </div>
      
      <CategoryForm categories={categories} />

      <div className="bg-[#18181b] rounded-2xl shadow-lg shadow-black overflow-x-auto border border-red-950">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-red-950/20">
              <th className="p-4 font-semibold text-gray-300">Name</th>
              <th className="p-4 font-semibold text-gray-300">Parent Category</th>
              <th className="p-4 font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-400">
            {categories.map((category: any) => (
              <tr key={category._id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                <td className="p-4 font-medium text-gray-100">{category.name}</td>
                <td className="p-4">{category.parentId?.name || '---'}</td>
                <td className="p-4">
                  <form action={async () => {
                    'use server';
                    await deleteCategory(category._id);
                  }}>
                    <button type="submit" className="text-red-500 hover:text-red-400 font-bold transition-colors">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">No categories found. Start by adding one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
