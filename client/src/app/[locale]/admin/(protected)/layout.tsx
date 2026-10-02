import React from 'react';
import { logoutAdmin } from '@/lib/actions/admin-auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-100 flex flex-col md:flex-row">
      {/* Sidebar - Client Component */}
      <AdminSidebar 
        locale={locale} 
        logoutAction={async () => {
          'use server';
          await logoutAdmin(locale);
        }} 
      />

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto bg-[#0a0a0c] min-w-0">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="p-4 sm:p-8 relative z-10 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}


