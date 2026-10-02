'use client';

import { useActionState } from 'react';
import { updateSettings } from '@/actions/settings';

export default function SettingsForm({ settings }: { settings: any }) {
  const [state, formAction, isPending] = useActionState(updateSettings, null);

  return (
    <form action={formAction} className="space-y-8">
      {state?.success && (
        <div className="p-4 bg-green-900/30 border border-green-500/50 text-green-400 rounded-xl mb-6">
          {state.message}
        </div>
      )}
      {state?.success === false && (
        <div className="p-4 bg-red-900/30 border border-red-500/50 text-red-400 rounded-xl mb-6">
          {state.error}
        </div>
      )}

      {/* General Settings */}
      <div className="bg-[#18181b] p-8 rounded-2xl shadow-lg shadow-black border border-red-950">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <span className="text-red-500 mr-3">⚙️</span> General Configuration
        </h2>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Store Name</label>
            <input name="storeName" defaultValue={settings?.storeName || "DirectCrest"} className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Support Email</label>
            <input name="supportEmail" defaultValue={settings?.supportEmail || "support@directcrest.com"} className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" />
          </div>
        </div>
      </div>

      {/* Site Content CMS */}
      <div className="bg-[#18181b] p-8 rounded-2xl shadow-lg shadow-black border border-red-950">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <span className="text-red-500 mr-3">📄</span> Content Management
        </h2>
        
        <div className="space-y-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">About Us Text</label>
            <textarea name="aboutUsText" rows={4} defaultValue={settings?.aboutUsText || "DirectCrest is a leading B2B platform..."} className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" />
            <p className="text-xs text-gray-500 mt-1">This text appears on the About Us page and footer.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Navbar Links (Comma separated)</label>
            <input name="navbarLinks" defaultValue={settings?.navbarLinks || "Products,About,Contact"} className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" />
            <p className="text-xs text-gray-500 mt-1">Example: Products,About Us,Contact,Support</p>
          </div>
        </div>
      </div>

      {/* Shipping Settings */}
      <div className="bg-[#18181b] p-8 rounded-2xl shadow-lg shadow-black border border-red-950">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <span className="text-red-500 mr-3">✈️</span> Shipping & Logistics
        </h2>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Standard Shipping Cost ($)</label>
            <input name="standardShippingCost" type="number" step="0.01" defaultValue={settings?.standardShippingCost || 15.00} className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Air Courier / Urgent Delivery ($)</label>
            <input name="urgentShippingCost" type="number" step="0.01" defaultValue={settings?.urgentShippingCost || 45.00} className="w-full bg-[#0a0a0c] border border-gray-800 text-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all" />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input name="enableInternational" type="checkbox" defaultChecked={settings?.enableInternational ?? true} className="w-5 h-5 accent-red-600 rounded bg-[#0a0a0c] border-gray-800" />
            <span className="text-gray-300 font-semibold">Enable International Shipping</span>
          </label>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-[#18181b] p-8 rounded-2xl shadow-lg shadow-black border border-red-950">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <span className="text-red-500 mr-3">💳</span> Payment & Wholesale
        </h2>
        
        <div className="mb-6 p-6 border border-gray-800 rounded-xl bg-[#0a0a0c]">
          <h3 className="font-bold text-gray-100 mb-2">Partial Payment Settings</h3>
          <p className="text-sm text-gray-400 mb-4">Allow customers to pay a partial amount upfront and the rest on delivery.</p>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-semibold text-gray-300">Minimum Upfront % :</label>
            <input name="minimumUpfrontPercent" type="number" defaultValue={settings?.minimumUpfrontPercent || 25} className="w-24 bg-[#18181b] border border-gray-800 text-gray-100 p-2 rounded-lg focus:ring-2 focus:ring-red-600 outline-none" />
          </div>
        </div>

        <button disabled={isPending} type="submit" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-900/50 transition-all font-bold disabled:opacity-50">
          {isPending ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </form>
  );
}
