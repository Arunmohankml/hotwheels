"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { TrendingUp, Package, Users, DollarSign, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    recentOrders: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        // Fetch Orders
        const { data: orders, error: ordersError } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        
        // Fetch All Users who are not the admin
        const { data: allUsers, error: usersError } = await supabase.from('profiles').select('*').neq('email', 'arunmohankml@gmail.com');

        const revenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
        
        setStats({
          totalRevenue: revenue,
          totalOrders: orders?.length || 0,
          totalCustomers: allUsers?.length || 0,
          recentOrders: orders?.slice(0, 5) || []
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border border-luxury-border rounded-full flex items-center justify-center animate-pulse">
          <div className="w-2 h-2 bg-black rounded-full" />
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, trend: '+12.5%' },
    { title: 'Total Orders', value: stats.totalOrders.toString(), icon: Package, trend: '+4.2%' },
    { title: 'Total Customers', value: stats.totalCustomers.toString(), icon: Users, trend: '+18.1%' },
    { title: 'Site Status', value: 'Live', icon: Activity, trend: '99.9%' }
  ];

  return (
    <div className="space-y-8 md:space-y-12">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 pb-4 md:pb-8 border-b border-luxury-border">
        <div>
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-muted mb-2 md:mb-3">Admin Panel</p>
          <h1 className="text-3xl md:text-4xl font-light tracking-tighter">Site <span className="font-medium">Overview.</span></h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-luxury-border rounded-full shadow-sm">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
           <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Live & Secure</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.title} 
            className="bg-white border border-luxury-border rounded-[24px] p-5 md:p-6 shadow-soft hover:shadow-premium transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={64} />
            </div>
            <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-luxury-bg border border-luxury-border rounded-xl flex items-center justify-center">
                <stat.icon size={14} className="text-black md:w-[16px] md:h-[16px]" />
              </div>
              <span className="flex items-center gap-1 text-[8px] md:text-[9px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                <TrendingUp size={10} /> {stat.trend}
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-muted mb-1">{stat.title}</p>
              <p className="text-xl md:text-2xl font-medium tracking-tight text-black">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-luxury-border rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-soft">
          <div className="flex justify-between items-center mb-6 md:mb-8 pb-4 border-b border-luxury-border">
            <h3 className="text-base md:text-lg font-medium tracking-tight text-black">Recent Activity</h3>
            <Link href="/admin/orders" className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-muted hover:text-black transition-colors flex items-center gap-2">
              View All <ArrowRight size={10} className="md:w-[12px] md:h-[12px]" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {stats.recentOrders.length > 0 ? stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-[16px] hover:bg-luxury-bg border border-transparent hover:border-luxury-border transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-md">
                    <Package size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-black mb-1">{order.shipping_address?.fullName || 'Collector'}</p>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-muted">ID: {order.id.slice(0,8)}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-6">
                  <div>
                    <p className="text-sm font-medium mb-1">₹{order.total_amount?.toLocaleString('en-IN')}</p>
                    <span className={`inline-block px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest ${
                      order.status === 'processing' ? 'bg-black text-white' : 
                      order.status === 'shipped' ? 'bg-[#f0f9ff] text-[#0284c7]' : 
                      'bg-[#f0fdf4] text-[#16a34a]'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-muted text-center py-8">No recent activity detected.</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-luxury-bg border border-luxury-border rounded-[24px] md:rounded-[32px] p-6 md:p-8">
          <h3 className="text-lg font-medium tracking-tight mb-8">Quick Actions</h3>
          <div className="space-y-4">
            <Link href="/admin/products" className="w-full flex items-center justify-between p-4 bg-white border border-luxury-border rounded-[16px] hover:border-black transition-colors group shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">Manage Products</span>
              <ArrowRight size={14} className="text-luxury-muted group-hover:text-black group-hover:translate-x-1 transition-all" />
            </Link>
            <Link href="/admin/orders" className="w-full flex items-center justify-between p-4 bg-white border border-luxury-border rounded-[16px] hover:border-black transition-colors group shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">View All Orders</span>
              <ArrowRight size={14} className="text-luxury-muted group-hover:text-black group-hover:translate-x-1 transition-all" />
            </Link>
            <button onClick={() => window.location.reload()} className="w-full flex items-center justify-between p-4 bg-white border border-luxury-border rounded-[16px] hover:border-black transition-colors group shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">Refresh Data</span>
              <ArrowRight size={14} className="text-luxury-muted group-hover:text-black group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
