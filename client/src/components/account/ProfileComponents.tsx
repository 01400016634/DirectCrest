'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, updateProfile, signOut, User } from 'firebase/auth';
import { User as UserIcon, LogOut, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function WelcomeHeader() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  return <p className="text-gray-400 mt-2 text-lg">Welcome back, {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Guest'}! Ready to streamline your wholesale procurement today?</p>;
}

export function SidebarProfile() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  return (
    <div className="text-center mb-6 pb-6 border-b border-white/10">
      <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden border border-white/20">
        {user?.photoURL ? (
          <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <UserIcon className="w-10 h-10 text-white" />
        )}
      </div>
      <h2 className="text-lg font-bold text-white">{user?.displayName || 'User'}</h2>
      <p className="text-gray-400 text-sm truncate px-2">{user?.email || user?.phoneNumber}</p>
    </div>
  );
}

export function SignOutButton() {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };
  return (
    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/20 font-semibold transition-colors mt-4">
      <LogOut className="w-5 h-5" />
      Sign Out
    </button>
  );
}

export function ProfileEditor({ user: propUser }: { user?: any }) {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        setDisplayName(u.displayName || '');
        setPhoneNumber(u.phoneNumber || '');
      }
    });
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await updateProfile(user, { displayName });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="profile" className="scroll-mt-24 pt-8 border-t border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <UserIcon className="w-6 h-6" /> Profile Details
        </h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="text-sm font-semibold text-red-500 hover:underline">
            Edit Profile
          </button>
        )}
      </div>
      <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</p>
            {isEditing ? (
              <div className="flex items-center gap-4">
                <input 
                  type="text" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="px-4 py-2 bg-black/20 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full max-w-sm"
                  placeholder="Enter your full name"
                />
              </div>
            ) : (
              <p className="text-lg text-white font-medium">{displayName || user?.displayName || 'No name provided'}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Phone Number</p>
            {isEditing ? (
              <input 
                type="tel" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="px-4 py-2 bg-black/20 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full max-w-sm mb-4 block"
                placeholder="Enter your phone number"
              />
            ) : null}
            
            {!isEditing && (
              <p className="text-lg text-white font-medium">{phoneNumber || user?.phoneNumber || 'No phone number provided'}</p>
            )}
          </div>
          <div className="md:col-span-2">
            {isEditing ? (
              <div className="flex items-center gap-4 mt-2">
                <button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-500 transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save
                </button>
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setDisplayName(user?.displayName || '');
                    setPhoneNumber(user?.phoneNumber || '');
                  }} 
                  className="text-gray-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
              </div>
            ) : null}
          </div>
          {!isEditing && (
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</p>
              <p className="text-lg text-white font-medium">{user?.email || 'No email info'}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
