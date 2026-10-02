'use client';

import React, { useActionState } from 'react';
import { loginAdmin } from '@/lib/actions/admin-auth';
import { Shield, Lock, User, AlertCircle } from 'lucide-react';

export default function AdminLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const [state, formAction, isPending] = useActionState(loginAdmin, null);
  const locale = React.use(params).locale;

  return (
    <div className="min-h-screen bg-[#0f0f11] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* 3D / Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-red-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5 pointer-events-none" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-900 rounded-2xl flex items-center justify-center shadow-xl shadow-red-900/20 border border-red-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          Admin Control Center
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Enter your credentials to access the secure dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#18181b] py-8 px-4 shadow-2xl shadow-black sm:rounded-2xl sm:px-10 border border-gray-800 backdrop-blur-xl">
          <form className="space-y-6" action={formAction}>
            <input type="hidden" name="locale" value={locale} />
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-700 rounded-xl shadow-sm bg-[#09090b] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all sm:text-sm"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-700 rounded-xl shadow-sm bg-[#09090b] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {state?.error && (
              <div className="p-3 bg-red-950/50 border border-red-900 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{state.error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#18181b] focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Authenticating...' : 'Sign In Securely'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 border-t border-gray-800 pt-6">
             <div className="text-xs text-center text-gray-500">
               DirectCrest Global Enterprise System V2.0
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
