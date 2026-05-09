"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { LayoutDashboard, Package, Users, Shield, Settings, LogOut, Menu, X as CloseIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'arunmohankml@gmail.com') {
        setAuthorized(true);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Close sidebar on navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-bg">
        <div className="w-12 h-12 border border-luxury-border rounded-full flex items-center justify-center animate-pulse">
          <div className="w-2 h-2 bg-black rounded-full" />
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: Package },
    { name: 'Collectors', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-luxury-bg text-black selection:bg-black selection:text-white">
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-luxury-border sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
             <Shield size={14} className="text-white" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Admin Panel</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2.5 bg-luxury-bg border border-luxury-border rounded-xl text-black active:scale-95 transition-all"
        >
          <Menu size={20} />
        </button>
      </header>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] flex flex-col shadow-2xl md:hidden"
            >
              <SidebarContent navItems={navItems} pathname={pathname} handleSignOut={handleSignOut} onClose={() => setIsSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[280px] bg-white border-r border-luxury-border flex-col fixed h-full z-40 shadow-soft">
        <SidebarContent navItems={navItems} pathname={pathname} handleSignOut={handleSignOut} />
      </aside>

      {/* Main Content Area */}
      <main className="md:ml-[280px] min-h-screen p-5 md:p-10 lg:p-16">
        <div className="max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}

const SidebarContent = ({ navItems, pathname, handleSignOut, onClose }: { navItems: any[], pathname: string, handleSignOut: () => void, onClose?: () => void }) => (
  <>
    <div className="p-8 md:p-10 border-b border-luxury-border flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
           <Shield size={14} className="text-white" />
        </div>
        <span className="text-sm font-bold uppercase tracking-[0.2em]">Admin Panel</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="p-2 md:hidden">
          <CloseIcon size={20} className="text-luxury-muted" />
        </button>
      )}
    </div>

    <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.name} 
            href={item.href}
            className={`flex items-center gap-4 px-5 py-4 rounded-[16px] text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
              isActive ? 'bg-black text-white shadow-md' : 'text-luxury-muted hover:bg-luxury-bg hover:text-black'
            }`}
          >
            <item.icon size={16} className={isActive ? 'text-white' : 'text-luxury-muted'} />
            {item.name}
          </Link>
        );
      })}
    </nav>

    <div className="p-6 border-t border-luxury-border">
      <button 
        onClick={handleSignOut}
        className="w-full flex items-center gap-4 px-5 py-4 rounded-[16px] text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-muted hover:bg-[#fff0f0] hover:text-[#d91d2a] transition-all group"
      >
        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
        Sign Out
      </button>
    </div>
  </>
);
