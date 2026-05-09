"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, User, Mail, Calendar, Shield, 
  Package, Heart, Clock, AlertCircle, Trash2, 
  Ban, ShieldAlert, ChevronRight, MapPin, 
  DollarSign, Activity, ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

const UserDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'activity'>('orders');

  useEffect(() => {
    fetchUserData();
  }, [id]);

  async function fetchUserData() {
    setLoading(true);
    try {
      // Fetch Profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (profileError) throw profileError;
      setUser(profile);

      // Fetch Orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });
      
      setOrders(ordersData || []);

      // Fetch Wishlist
      const { data: wishlistData } = await supabase
        .from('wishlist')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', id);
      
      setWishlist(wishlistData || []);

    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleAdmin = async () => {
    const nextAdminStatus = !user.is_admin;
    setConfirmData({
      isOpen: true,
      title: nextAdminStatus ? 'Promote to Admin?' : 'Revoke Admin Privileges?',
      message: nextAdminStatus 
        ? 'This user will gain full access to the administrative control panel and database management tools.'
        : 'This user will lose all administrative privileges and access to restricted dashboard areas.',
      variant: nextAdminStatus ? 'primary' : 'danger',
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('profiles').update({ is_admin: nextAdminStatus }).eq('id', id);
          if (error) throw error;
          setUser({ ...user, is_admin: nextAdminStatus });
        } catch (error) {
          alert('Failed to update administrative status.');
        } finally {
          setConfirmData(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleBanToggle = async () => {
    const nextBanStatus = !user.is_banned;
    setConfirmData({
      isOpen: true,
      title: nextBanStatus ? 'Ban Collector?' : 'Lift Suspension?',
      message: nextBanStatus 
        ? 'This will block the account, IP, and device signature from accessing the platform immediately.'
        : 'This will restore the collector\'s access to the platform and their historical data.',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('profiles').update({ is_banned: nextBanStatus }).eq('id', id);
          if (error) throw error;
          setUser({ ...user, is_banned: nextBanStatus });
        } catch (error) {
          alert('Failed to update ban status.');
        } finally {
          setConfirmData(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleDeleteAccount = async () => {
    setConfirmData({
      isOpen: true,
      title: 'Delete Account?',
      message: 'This action is irreversible. All collector metadata, registry records, and associated data will be permanently erased.',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('profiles').delete().eq('id', id);
          if (error) throw error;
          router.push('/admin/users');
        } catch (error) {
          alert('Failed to purge identity record.');
        } finally {
          setConfirmData(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const [confirmData, setConfirmData] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'danger' | 'primary';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'danger'
  });

  const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, variant = 'danger' }: any) => (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl p-8 text-center"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
              variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-black text-white'
            }`}>
              <ShieldAlert size={32} />
            </div>
            <h3 className="text-xl font-medium tracking-tight mb-2">{title}</h3>
            <p className="text-sm text-luxury-muted mb-8 leading-relaxed">{message}</p>
            <div className="flex gap-3">
              <button 
                onClick={onCancel}
                className="flex-1 py-4 border border-luxury-border rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:border-black transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                className={`flex-1 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white transition-all shadow-lg ${
                  variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-zinc-800'
                }`}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border border-luxury-border rounded-full flex items-center justify-center animate-pulse">
          <div className="w-2 h-2 bg-black rounded-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-luxury-muted font-medium uppercase tracking-widest text-[10px]">User record not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-xs font-bold underline">Go Back</button>
      </div>
    );
  }

  const stats = [
    { label: 'Total Spent', value: `₹${orders.reduce((acc, o) => acc + (o.total_amount || 0), 0).toLocaleString('en-IN')}`, icon: DollarSign },
    { label: 'Orders', value: orders.length.toString(), icon: Package },
    { label: 'Wishlist', value: wishlist.length.toString(), icon: Heart },
    { label: 'Activity', value: 'High', icon: Activity }
  ];

  return (
    <div className="space-y-8 md:space-y-12 pb-20">
      
      <ConfirmModal 
        isOpen={confirmData.isOpen}
        title={confirmData.title}
        message={confirmData.message}
        variant={confirmData.variant}
        onConfirm={confirmData.onConfirm}
        onCancel={() => setConfirmData(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-luxury-border">
        <div className="space-y-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-luxury-muted hover:text-black transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Back to Registry</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-luxury-bg border border-luxury-border rounded-[24px] flex items-center justify-center">
              <User size={32} className="text-luxury-muted" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl md:text-4xl font-light tracking-tighter">{user.full_name || 'Anonymous'}</h1>
                {user.is_admin && (
                  <span className="px-3 py-1 bg-black text-white rounded-full text-[8px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Shield size={10} /> Admin
                  </span>
                )}
                {user.is_banned && (
                  <span className="px-3 py-1 bg-red-600 text-white rounded-full text-[8px] font-bold uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                    <Ban size={10} /> Banned
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium text-luxury-muted tracking-wide flex items-center gap-2">
                <Mail size={12} /> {user.email}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
           <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-luxury-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-black transition-all">
             Send Message
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={stat.label}
            className="bg-white border border-luxury-border p-5 rounded-[24px] shadow-soft relative overflow-hidden group"
          >
            <stat.icon className="absolute top-4 right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" size={48} />
            <p className="text-[9px] font-bold uppercase tracking-widest text-luxury-muted mb-2">{stat.label}</p>
            <p className="text-xl md:text-2xl font-medium tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Tabs */}
          <div className="flex items-center gap-8 border-b border-luxury-border">
            {(['orders', 'wishlist', 'activity'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[10px] font-bold uppercase tracking-[0.2em] relative transition-colors ${
                  activeTab === tab ? 'text-black' : 'text-luxury-muted hover:text-black'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
             {activeTab === 'orders' && (
               <div className="space-y-4">
                 {orders.length > 0 ? orders.map((order) => (
                   <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={order.id} 
                    className="bg-white border border-luxury-border p-5 rounded-[24px] hover:shadow-soft transition-all group"
                   >
                     <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-luxury-bg border border-luxury-border rounded-xl flex items-center justify-center">
                            <ShoppingBag size={18} className="text-luxury-muted" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-black uppercase tracking-widest">Order #{order.id.slice(0,8)}</p>
                            <p className="text-[10px] text-luxury-muted font-medium">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border ${
                          order.status === 'processing' ? 'bg-black text-white border-black' : 
                          order.status === 'shipped' ? 'bg-[#f0f9ff] text-[#0284c7] border-[#bae6fd]' : 
                          'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]'
                        }`}>
                          {order.status}
                        </span>
                     </div>
                     <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-luxury-muted">Items Detail</p>
                          <p className="text-[11px] font-medium text-black">Total Amount: ₹{order.total_amount?.toLocaleString('en-IN')}</p>
                        </div>
                        <Link 
                          href={`/admin/orders?orderId=${order.id}`}
                          className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-muted hover:text-black transition-colors"
                        >
                          View Logistics <ChevronRight size={12} />
                        </Link>
                     </div>
                   </motion.div>
                 )) : (
                   <div className="text-center py-20 bg-luxury-bg/30 rounded-[32px] border border-dashed border-luxury-border">
                     <ShoppingBag size={32} className="mx-auto text-luxury-muted opacity-20 mb-4" />
                     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-muted">No orders found in registry.</p>
                   </div>
                 )}
               </div>
             )}

             {activeTab === 'wishlist' && (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {wishlist.length > 0 ? wishlist.map((item) => (
                   <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={item.id} 
                    className="bg-white border border-luxury-border p-4 rounded-[24px] flex items-center gap-4 hover:shadow-soft transition-all"
                   >
                     <div className="w-16 h-16 bg-luxury-bg border border-luxury-border rounded-xl relative overflow-hidden p-2">
                        {item.products?.image_url && (
                          <img src={item.products.image_url} alt="" className="w-full h-full object-contain" />
                        )}
                     </div>
                     <div className="min-w-0">
                        <p className="text-[11px] font-bold text-black truncate">{item.products?.name}</p>
                        <p className="text-[9px] font-medium text-luxury-muted uppercase tracking-widest mb-1">{item.products?.category}</p>
                        <p className="text-[10px] font-bold text-black">₹{item.products?.price?.toLocaleString('en-IN')}</p>
                     </div>
                   </motion.div>
                 )) : (
                   <div className="col-span-full text-center py-20 bg-luxury-bg/30 rounded-[32px] border border-dashed border-luxury-border">
                     <Heart size={32} className="mx-auto text-luxury-muted opacity-20 mb-4" />
                     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-muted">Wishlist is currently empty.</p>
                   </div>
                 )}
               </div>
             )}

             {activeTab === 'activity' && (
               <div className="space-y-6">
                 <div className="flex gap-4 items-start relative pb-6 border-l border-luxury-border ml-2 pl-6">
                    <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] bg-black rounded-full ring-4 ring-white" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-black mb-1">Account Created</p>
                      <p className="text-[11px] font-medium text-luxury-muted mb-2">Initial profile registration completed.</p>
                      <span className="text-[9px] font-bold text-luxury-muted/60 uppercase">{new Date(user.joined_at).toLocaleString()}</span>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start relative ml-2 pl-6">
                    <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] bg-luxury-muted/30 rounded-full ring-4 ring-white" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-muted mb-1">Session Data</p>
                      <p className="text-[11px] font-medium text-luxury-muted">Last detected entry point: {user.mock_ip || '192.168.1.1'}</p>
                    </div>
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-luxury-bg border border-luxury-border p-6 rounded-[32px] space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-muted mb-6">User Properties</h3>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-center py-3 border-b border-luxury-border/30">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-luxury-muted">ID Signature</span>
                    <span className="text-[10px] font-bold font-mono">{user.id.slice(0, 12)}...</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-luxury-border/30">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-luxury-muted">Registration</span>
                    <span className="text-[10px] font-bold">{new Date(user.joined_at).toLocaleDateString()}</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-luxury-border/30">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-luxury-muted">Status</span>
                    <span className={`text-[10px] font-bold uppercase ${user.is_banned ? 'text-red-600' : 'text-green-600'}`}>
                      {user.is_banned ? 'Suspended' : 'Verified'}
                    </span>
                 </div>
              </div>

              <div className="pt-4 space-y-3">
                 <button 
                  onClick={handleToggleAdmin}
                  className={`w-full py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 border ${
                    user.is_admin 
                      ? 'bg-black text-white border-black hover:bg-zinc-800' 
                      : 'bg-white text-black border-luxury-border hover:border-black'
                  }`}
                 >
                    {user.is_admin ? <Shield size={14} className="fill-white" /> : <Shield size={14} />}
                    {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                 </button>
                 <button 
                  onClick={handleBanToggle}
                  className={`w-full py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 border ${
                    user.is_banned 
                      ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-600 hover:text-white hover:border-green-600' 
                      : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600'
                  }`}
                 >
                    <Ban size={14} /> {user.is_banned ? 'Lift Ban' : 'Ban Account'}
                 </button>
                 <button 
                  onClick={handleDeleteAccount}
                  className="w-full py-4 bg-white text-luxury-muted border border-luxury-border rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all flex items-center justify-center gap-3"
                 >
                    <Trash2 size={14} /> Delete Account
                 </button>
              </div>
           </div>

           <div className="p-6 bg-white border border-luxury-border rounded-[32px]">
              <div className="flex items-center gap-2 mb-4 text-orange-600">
                <AlertCircle size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Admin Note</span>
              </div>
              <p className="text-[11px] font-medium leading-relaxed text-luxury-muted">
                This collector has shown high engagement in recent limited drops. Monitor for VIP eligibility in the next quarter.
              </p>
           </div>
        </div>

      </div>

    </div>
  );
};

export default UserDetailPage;
