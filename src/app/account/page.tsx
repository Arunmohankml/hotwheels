"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Package, Shield, ArrowRight, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

const AccountPage = () => {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchOrders(currentUser.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router, currentPage]);

  const fetchOrders = async (userId: string) => {
    setLoading(true);
    try {
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (!error && data) {
        setOrders(data);
        setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error('Error fetching account orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-luxury-bg">
        <div className="w-12 h-12 border border-luxury-border rounded-full flex items-center justify-center animate-pulse">
          <div className="w-2 h-2 bg-black rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12 px-6 md:px-12 selection:bg-black selection:text-white">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-12 mb-8 md:mb-20 pb-8 md:pb-12 border-b border-luxury-border">
          <div className="space-y-2">
            <h1 className="font-light text-3xl md:text-7xl uppercase tracking-tighter text-black">
              My <span className="font-medium">Account.</span>
            </h1>
            <p className="text-[9px] uppercase tracking-[0.4em] text-luxury-muted font-bold flex items-center gap-2">
              <Shield size={10} /> Authorized Access
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-24">
          
          {/* Left Column: Identity & Actions */}
          <div className="lg:col-span-4 space-y-12">
            
            <div className="bg-white border border-luxury-border rounded-[32px] p-6 md:p-10 shadow-soft">
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-luxury-bg rounded-2xl flex items-center justify-center border border-luxury-border">
                  <UserIcon size={24} className="text-luxury-muted" />
                </div>
                <button 
                  onClick={handleSignOut}
                  className="p-3 bg-white border border-luxury-border rounded-xl text-[9px] uppercase tracking-widest font-bold hover:border-black hover:text-hw-red transition-all flex items-center gap-2"
                >
                  <LogOut size={12} /> Sign Out
                </button>
              </div>
              
              <h2 className="text-xl md:text-2xl font-light tracking-tight mb-1 truncate">{user.email}</h2>
              <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-luxury-muted font-bold">User ID: {user.uid.slice(0, 8)}</p>
              
              <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-luxury-border">
                {user.email === 'arunmohankml@gmail.com' && (
                  <Link 
                    href="/admin" 
                    className="w-full flex items-center justify-between p-4 md:p-5 bg-black text-white rounded-[16px] md:rounded-[20px] text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-hw-red transition-colors group mb-4 shadow-md"
                  >
                    <span>Admin Panel</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                <Link 
                  href="/shop" 
                  className="w-full flex items-center justify-between p-4 md:p-5 bg-luxury-bg text-black border border-luxury-border rounded-[16px] md:rounded-[20px] text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold hover:border-black transition-colors group"
                >
                  <span>Return to Shop</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>



          </div>

          {/* Right Column: Acquisitions */}
          <div className="lg:col-span-8">
            <h3 className="text-2xl font-light tracking-tight mb-10">Order <span className="font-medium">History</span></h3>
            
            {orders.length === 0 ? (
              <div className="py-32 flex flex-col items-center justify-center text-center border border-dashed border-luxury-border rounded-[40px]">
                <Package className="text-luxury-muted mb-6" size={32} />
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-black mb-4">No orders yet</p>
                <Link href="/shop" className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-muted hover:text-black border-b border-transparent hover:border-black transition-all pb-1">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <Link 
                    href={`/account/orders/${order.id}`} 
                    key={order.id}
                    className="block bg-white border border-luxury-border rounded-[24px] p-6 md:p-8 shadow-soft hover:shadow-premium hover:border-black transition-all group"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-luxury-muted mb-2">Order {order.id.slice(0, 8)}</p>
                        <p className="text-sm font-medium text-black">
                          {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-8 md:gap-12 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-left md:text-right">
                          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-luxury-muted mb-2">Status</p>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                            order.status === 'processing' ? 'bg-black text-white' : 
                            order.status === 'shipped' ? 'bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd]' : 
                            'bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-luxury-muted mb-2">Total</p>
                          <p className="text-lg font-light">₹{order.total_amount?.toLocaleString('en-IN')}</p>
                        </div>
                        
                        <div className="hidden md:flex w-10 h-10 rounded-full border border-luxury-border items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                          <ArrowRight size={14} />
                        </div>
                      </div>

                    </div>
                  </Link>
                ))}
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-8 mt-12">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="w-10 h-10 rounded-full border border-luxury-border flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-20"
                    >
                      <ArrowRight size={14} className="rotate-180" />
                    </button>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="w-10 h-10 rounded-full border border-luxury-border flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-20"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccountPage;
