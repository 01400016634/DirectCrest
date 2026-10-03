'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Users, Settings, LogOut, Home, Grid, Menu, X } from 'lucide-react';

export default function AdminSidebar({ locale, logoutAction }: { locale: string, logoutAction: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: `/${locale}/admin/dashboard`, icon: <LayoutDashboard />, label: 'Dashboard' },
    { href: `/${locale}/admin/products`, icon: <Package />, label: 'Products' },
    { href: `/${locale}/admin/categories`, icon: <Grid />, label: 'Categories' },
    { href: `/${locale}/admin/users`, icon: <Users />, label: 'Customers' },
    { href: `/${locale}/admin/orders`, icon: <Package />, label: 'Orders' },
    { href: `/${locale}/admin/homepage`, icon: <Home />, label: 'Home Editor' },
    { href: `/${locale}/admin/settings`, icon: <Settings />, label: 'Settings' },
  ];

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#111113] border-b border-red-900/30 sticky top-0 z-30">
        <div className="flex items-center">
          <ShieldIcon className="w-6 h-6 text-red-500 mr-2" />
          <h2 className="text-lg font-extrabold text-white tracking-wider">DIRECT<span className="text-red-500">CREST</span></h2>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white transition-colors">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#111113] border-r border-red-900/30 flex flex-col shadow-[4px_0_24px_rgba(220,38,38,0.1)]
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-red-900/30 bg-gradient-to-r from-red-950/40 to-transparent">
          <div className="flex items-center">
            <ShieldIcon className="w-6 h-6 text-red-500 mr-3" />
            <h2 className="text-lg font-extrabold text-white tracking-wider hidden md:block">DIRECT<span className="text-red-500">CREST</span></h2>
            <h2 className="text-lg font-extrabold text-white tracking-wider md:hidden">DIRECT<span className="text-red-500">CREST</span></h2>
          </div>
          <button onClick={closeSidebar} className="md:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all border group ${
                  isActive 
                    ? 'bg-red-950/40 text-red-400 border-red-900/50 shadow-inner' 
                    : 'text-gray-300 border-transparent hover:bg-red-950/20 hover:text-red-400 hover:border-red-900/30'
                }`}
              >
                <span className={`mr-3 transition-colors ${isActive ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'}`}>
                  {React.cloneElement(item.icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-red-900/30">
          <form action={logoutAction}>
            <button type="submit" className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 bg-red-950/20 hover:bg-red-900/40 rounded-xl transition-all border border-red-900/50 hover:border-red-500/50 shadow-inner">
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}

function ShieldIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
