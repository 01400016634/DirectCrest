export default function AdminHomepageEditorPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Homepage Editor</h1>
        <p className="text-gray-400 mt-2">Control the frontend layout, hero banners, and featured products.</p>
      </div>

      <div className="space-y-8">
        
        {/* Hero Section Banner */}
        <div className="bg-[#18181b] p-8 rounded-2xl shadow-lg shadow-black border border-red-950">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="text-red-500 mr-3">🖼️</span> Hero Banner
          </h2>
          
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Main Headline</label>
              <input defaultValue="Next Generation 3D Gadgets" className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Subheadline</label>
              <input defaultValue="Experience shopping in virtual reality." className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" />
            </div>
          </div>
          
          <div className="mb-6 p-6 border-2 border-dashed border-red-900/50 rounded-xl bg-red-950/10">
            <label className="block text-sm font-bold text-red-400 mb-2">Upload Hero Background Image</label>
            <input type="file" accept="image/*" className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-950 file:text-red-400 hover:file:bg-red-900 transition-all cursor-pointer" />
          </div>

          <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-900/50 transition-all font-bold">Save Banner</button>
        </div>

        {/* Trending Products */}
        <div className="bg-[#18181b] p-8 rounded-2xl shadow-lg shadow-black border border-red-950">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="text-red-500 mr-3">🔥</span> Trending Products (Homepage Carousel)
          </h2>
          <p className="text-gray-400 text-sm mb-6">Select which products should be featured on the homepage.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#0a0a0c] border border-red-900 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-lg mb-3"></div>
              <p className="text-sm text-gray-100 font-bold">iPhone 15 Pro</p>
              <button className="mt-3 text-xs text-red-400 border border-red-900 px-3 py-1 rounded-full hover:bg-red-950">Remove</button>
            </div>
            
            <div className="bg-[#0a0a0c] border border-red-900 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-lg mb-3"></div>
              <p className="text-sm text-gray-100 font-bold">MacBook M3</p>
              <button className="mt-3 text-xs text-red-400 border border-red-900 px-3 py-1 rounded-full hover:bg-red-950">Remove</button>
            </div>

            <div className="bg-[#0a0a0c] border border-gray-800 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-red-500 transition-colors">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-gray-500 mb-2">+</div>
              <p className="text-sm text-gray-500">Add Product</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
