'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useRouter } from '@/i18n/routing';
import { getAccountDataByEmail } from '@/actions/account';
import { 
  Package, MapPin, User as UserIcon, Clock, CheckCircle2, Truck, FileText,
  LayoutDashboard, Map as MapIcon, Heart, ShoppingCart, Layers, Search, Bell, Globe, DollarSign, HelpCircle,
  Activity, Download, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { WelcomeHeader, SidebarProfile, SignOutButton, ProfileEditor } from '@/components/account/ProfileComponents';
import { DownloadInvoiceButton, DeleteOrderButton, DeleteAllOrdersButton } from '@/components/account/OrderActions';

export default function AccountDashboardClient() {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setAuthLoaded(true);
      
      if (user && user.email) {
        const result = await getAccountDataByEmail(user.email);
        if (result.success) {
          setData(result.data);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (!authLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (authLoaded && !firebaseUser) {
    router.push('/login');
    return null;
  }

  const { orders = [], addresses = [], requests = [] } = data || {};

  const getStatusIcon = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'DELIVERED': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'SHIPPED': return <Truck className="w-5 h-5 text-blue-500" />;
      default: return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'SHIPPED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o: any) => o.status?.toUpperCase() === 'PENDING').length,
    processing: orders.filter((o: any) => ['PROCESSING', 'PAID'].includes(o.status?.toUpperCase() || '')).length,
    shipped: orders.filter((o: any) => o.status?.toUpperCase() === 'SHIPPED').length,
    delivered: orders.filter((o: any) => o.status?.toUpperCase() === 'DELIVERED').length,
  };

  const sidebarLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '#dashboard' },
    { name: 'Orders', icon: Package, href: '#orders' },
    { name: 'Tracking', icon: MapIcon, href: '#tracking' },
    { name: 'Wishlist', icon: Heart, href: '#wishlist' },
    { name: 'Cart', icon: ShoppingCart, href: '#cart' },
    { name: 'Addresses', icon: MapPin, href: '#addresses' },
    { name: 'Invoices', icon: FileText, href: '#invoices' },
    { name: 'Bulk Orders', icon: Layers, href: '#bulk-orders' },
    { name: 'Product Requests', icon: Search, href: '#sourcing' },
    { name: 'Notifications', icon: Bell, href: '#notifications' },
    { name: 'Profile', icon: UserIcon, href: '#profile' },
    { name: 'Language', icon: Globe, href: '#language' },
    { name: 'Currency', icon: DollarSign, href: '#currency' },
    { name: 'Support', icon: HelpCircle, href: '#support' },
  ];

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">My Account</h1>
          <WelcomeHeader user={firebaseUser} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 p-6 space-y-2 sticky top-24">
              <SidebarProfile user={firebaseUser} />

              <nav className="space-y-1 h-96 overflow-y-auto pr-2 custom-scrollbar">
                {sidebarLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white font-semibold transition-colors"
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                ))}
              </nav>
              
              <SignOutButton />
            </div>
          </div>

          <div className="flex-1 space-y-10">
            <section id="dashboard" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6" /> Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/10 text-center">
                  <div className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-bold text-white">{orderStats.total}</p>
                  <p className="text-xs font-semibold text-gray-400 uppercase mt-1">Total</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/10 text-center">
                  <div className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-bold text-white">{orderStats.pending}</p>
                  <p className="text-xs font-semibold text-gray-400 uppercase mt-1">Pending</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/10 text-center">
                  <div className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-bold text-white">{orderStats.processing}</p>
                  <p className="text-xs font-semibold text-gray-400 uppercase mt-1">Processing</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/10 text-center">
                  <div className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-bold text-white">{orderStats.shipped}</p>
                  <p className="text-xs font-semibold text-gray-400 uppercase mt-1">Shipped</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/10 text-center">
                  <div className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-bold text-white">{orderStats.delivered}</p>
                  <p className="text-xs font-semibold text-gray-400 uppercase mt-1">Delivered</p>
                </div>
              </div>
            </section>

            <section id="orders" className="scroll-mt-24 pt-8 border-t border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Package className="w-6 h-6" /> Order History
                </h2>
                {orders.length > 0 && data?.user?._id && (
                  <DeleteAllOrdersButton userId={data.user._id.toString()} />
                )}
              </div>
              
              {orders.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-white/10 text-center">
                  <div className="w-16 h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">No orders yet</h3>
                  <p className="text-gray-400 mb-6">When you place orders, they will appear here.</p>
                  <Link href="/products" className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order: any) => (
                    <div key={order._id.toString()} className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 overflow-hidden">
                      <div className="p-6 border-b border-white/10 bg-black/20 flex flex-wrap items-center justify-between gap-6">
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Order Number</p>
                          <p className="text-sm text-white font-medium font-mono">#{order._id.toString().slice(-8).toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Date Placed</p>
                          <p className="text-sm text-white font-medium">
                            {new Date(order.createdAt || new Date()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total</p>
                          <p className="text-sm text-white font-bold">${order.total?.toFixed(2) || '0.00'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status || 'PENDING')}`}>
                            {getStatusIcon(order.status || '')}
                            {order.status || 'PENDING'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <DownloadInvoiceButton orderId={order._id.toString()} />
                          <DeleteOrderButton orderId={order._id.toString()} />
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex flex-col gap-4">
                          {order.items?.map((item: any) => (
                            <div key={item._id.toString()} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-black/20">
                              <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                {item.productId?.images?.[0] ? (
                                  <img src={item.productId.images[0]} alt="Product" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                  <Package className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-white">
                                  {item.productId?.name || 'Unknown Product'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-white">${(item.priceSnapshot * item.quantity).toFixed(2)}</p>
                                <p className="text-xs text-gray-400">${item.priceSnapshot.toFixed(2)} each</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <ProfileEditor user={data?.user} />
          </div>
        </div>
      </div>
    </div>
  );
}
