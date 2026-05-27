"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Package, Search, ChevronDown, Filter, MoreHorizontal, X, MapPin, Mail, Phone, User, ShoppingBag, ArrowRight, CheckCircle2, Clock, Truck, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

const OrderSheet = ({ order, isOpen, onClose, onStatusChange }: any) => {
  const [stocks, setStocks] = useState<Record<string, number>>({});
  const [loadingStocks, setLoadingStocks] = useState(false);

  useEffect(() => {
    if (isOpen && order?.items) {
      fetchStocks();
    }
  }, [isOpen, order]);

  async function fetchStocks() {
    setLoadingStocks(true);
    try {
      const productIds = order.items.map((item: any) => item.id);
      const { data } = await supabase
        .from('products')
        .select('id, stock')
        .in('id', productIds);
      
      const stockMap: Record<string, number> = {};
      data?.forEach((p: any) => {
        stockMap[p.id] = p.stock;
      });
      setStocks(stockMap);
    } catch (err) {
      console.error('Error fetching stocks:', err);
    } finally {
      setLoadingStocks(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && order && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 lg:p-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-0"
          />
          <motion.div 
            initial={{ y: "100%", scale: 1 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: "100%", scale: 0.95 }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="relative w-full max-w-7xl bg-white md:rounded-[48px] rounded-t-[40px] z-10 max-h-[95vh] md:max-h-[85vh] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.3)] flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-xl px-8 md:px-12 py-6 md:py-8 border-b border-luxury-border flex justify-between items-center z-20">
              <div>
                <div className="flex items-center gap-3 mb-1">
                   <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-muted">Logistics Intelligence</p>
                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
                <h3 className="text-2xl md:text-3xl font-light tracking-tighter">Manifest <span className="font-medium">#{order.id.slice(0, 8)}</span></h3>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 md:p-4 border border-luxury-border rounded-full hover:bg-black hover:text-white transition-all group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
              <div className="max-w-[1200px] mx-auto space-y-16">
                
                {/* Top Section: Info & Status */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  
                  {/* Recipient Details */}
                  <div className="lg:col-span-7 space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                           <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-muted flex items-center gap-2">
                             <User size={14} /> Collector Profile
                           </h4>
                           <div className="bg-luxury-bg/50 p-6 rounded-[32px] border border-luxury-border space-y-5">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white border border-luxury-border rounded-2xl flex items-center justify-center shadow-sm">
                                  <User size={18} className="text-luxury-muted" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[8px] font-bold uppercase tracking-widest text-luxury-muted mb-0.5">Identity</p>
                                  <p className="text-sm font-medium truncate">{order.shipping_address?.fullName || 'N/A'}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white border border-luxury-border rounded-2xl flex items-center justify-center shadow-sm">
                                  <Mail size={18} className="text-luxury-muted" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[8px] font-bold uppercase tracking-widest text-luxury-muted mb-0.5">Registry Email</p>
                                  <p className="text-sm font-medium truncate">{order.shipping_address?.email || 'N/A'}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white border border-luxury-border rounded-2xl flex items-center justify-center shadow-sm">
                                  <Phone size={18} className="text-luxury-muted" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[8px] font-bold uppercase tracking-widest text-luxury-muted mb-0.5">Contact Vector</p>
                                  <p className="text-sm font-medium">{order.shipping_address?.phone || 'N/A'}</p>
                                </div>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-muted flex items-center gap-2">
                             <MapPin size={14} /> Destination
                           </h4>
                           <div className="bg-luxury-bg/50 p-6 rounded-[32px] border border-luxury-border flex gap-4 h-full relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                <MapPin size={120} />
                              </div>
                              <div className="w-10 h-10 bg-white border border-luxury-border rounded-2xl flex items-center justify-center shadow-sm shrink-0 relative z-10">
                                <MapPin size={18} className="text-luxury-muted" />
                              </div>
                              <div className="relative z-10">
                                <p className="text-[8px] font-bold uppercase tracking-widest text-luxury-muted mb-1">Shipping Matrix</p>
                                <p className="text-sm font-medium leading-relaxed">
                                  {order.shipping_address?.address}<br />
                                  {order.shipping_address?.city}, {order.shipping_address?.zip}<br />
                                  <span className="text-[10px] font-bold text-luxury-muted mt-2 block italic">Standard Delivery Logistics</span>
                                </p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Status & Payment Summary */}
                  <div className="lg:col-span-5 space-y-8">
                     <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-muted flex items-center gap-2">
                        <Activity size={14} /> Operation Status
                     </h4>
                     <div className="bg-black text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                           <Clock size={160} />
                        </div>
                        <div className="relative z-10">
                           <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-6">Current Flow</p>
                           <div className="flex items-center gap-4 mb-8">
                              <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center shadow-inner">
                                 {order.status === 'processing' ? <Clock size={24} /> : order.status === 'shipped' ? <Truck size={24} /> : <CheckCircle2 size={24} />}
                              </div>
                              <div>
                                 <p className="text-2xl font-light uppercase tracking-tighter">{order.status}</p>
                                 <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Updated {new Date(order.created_at).toLocaleDateString()}</p>
                              </div>
                           </div>
                        </div>

                        <div className="relative z-10 pt-8 border-t border-zinc-800">
                           <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-2">Total Valuation</p>
                           <div className="flex items-baseline gap-2">
                              <span className="text-4xl md:text-5xl font-medium tracking-tighter">₹{order.total_amount?.toLocaleString('en-IN')}</span>
                              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">INR Total</span>
                           </div>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="space-y-8 mt-6 md:mt-0">
                  <div className="flex justify-between items-end border-b border-luxury-border pb-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-muted flex items-center gap-2">
                      <ShoppingBag size={14} /> Ordered Inventory
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-4 py-1 bg-luxury-bg border border-luxury-border rounded-full">
                      {order.items?.length || 0} Products
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="bg-white border border-luxury-border p-6 rounded-[32px] flex gap-6 group hover:border-black hover:shadow-premium transition-all duration-500 relative">
                        <div className="w-24 h-24 bg-luxury-bg border border-luxury-border rounded-2xl p-2 relative shrink-0 overflow-hidden group-hover:bg-white transition-colors">
                          <Image src={item.image_url} alt={item.name} fill className="object-contain p-2 rounded-xl group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                        </div>
                        <div className="min-w-0 flex-1 flex flex-col justify-center">
                          <p className="text-xs font-bold text-black uppercase tracking-tight mb-1 group-hover:text-hw-red transition-colors">{item.name}</p>
                          <div className="flex items-center gap-3 mb-4">
                             <span className="px-2.5 py-1 bg-black text-white text-[8px] font-bold uppercase tracking-widest rounded-lg shadow-sm">
                               {item.boxType || 'BOX'}
                             </span>
                             <div className="h-3 w-[1px] bg-luxury-border" />
                             <span className="text-[10px] font-bold text-luxury-muted tracking-widest">UNIT QTY: {item.quantity}</span>
                          </div>
                          
                          <div className="space-y-2 mt-auto">
                            <div className="flex justify-between items-center text-[9px]">
                              <span className="font-bold uppercase tracking-widest text-luxury-muted">Warehouse Stock</span>
                              <span className={`font-bold tabular-nums ${stocks[item.id] < 5 ? 'text-red-500' : 'text-green-600'}`}>
                                {loadingStocks ? '...' : (stocks[item.id] || 0)} Units
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-luxury-bg rounded-full overflow-hidden border border-luxury-border/50">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (stocks[item.id] || 0) * 10)}%` }}
                                className={`h-full transition-colors duration-500 ${stocks[item.id] < 5 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-black'}`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="sticky bottom-0 bg-white/80 backdrop-blur-xl px-8 md:px-12 py-8 border-t border-luxury-border flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="hidden md:block">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-muted mb-1">Administrative Actions</p>
                  <p className="text-xs font-medium text-black/60">Finalize order lifecycle management.</p>
               </div>
               <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="flex-1 md:w-80 relative">
                     <select 
                       value={order.status}
                       onChange={(e) => onStatusChange(order.id, e.target.value)}
                       className={`w-full appearance-none outline-none cursor-pointer pl-8 pr-14 py-5 rounded-[24px] text-[10px] font-bold uppercase tracking-[0.4em] border transition-all ${
                         order.status === 'processing' ? 'bg-black text-white border-black shadow-premium' : 
                         'bg-white text-black border-luxury-border hover:border-black'
                       }`}
                     >
                       <option value="processing">Move to Processing</option>
                       <option value="shipped">Mark as Shipped</option>
                       <option value="delivered">Confirm Delivery</option>
                     </select>
                     <ChevronDown size={18} className={`absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none ${order.status === 'processing' ? 'text-white' : 'text-black'}`} />
                  </div>
                  <button className="p-5 md:p-6 bg-luxury-bg border border-luxury-border rounded-[24px] hover:border-black hover:bg-white transition-all shadow-sm">
                     <MoreHorizontal size={24} />
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const AdminOrdersPage = () => {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get('orderId');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrderForSheet, setSelectedOrderForSheet] = useState<any>(null);
  
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchOrders();
  }, [currentPage, search]);

  useEffect(() => {
    if (orderIdFromUrl) {
      fetchSingleOrder(orderIdFromUrl);
    }
  }, [orderIdFromUrl]);

  async function fetchSingleOrder(id: string) {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setSelectedOrderForSheet(data);
      }
    } catch (err) {
      console.error('Error fetching single order:', err);
    }
  }

  async function fetchOrders() {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select('*', { count: 'exact' });

      if (search) {
        query = query.or(`id.ilike.%${search}%,shipping_address->>fullName.ilike.%${search}%`);
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!error && data) {
        setOrders(data);
        setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (selectedOrderForSheet?.id === orderId) {
      setSelectedOrderForSheet({ ...selectedOrderForSheet, status: newStatus });
    }
    fetchOrders(); // Refresh
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    if (!newStatus) return;
    if (!confirm(`Are you sure you want to update ${selectedOrders.length} orders to ${newStatus}?`)) return;
    
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).in('id', selectedOrders);
      if (error) throw error;
      setSelectedOrders([]);
      fetchOrders();
    } catch (error) {
      alert('Error updating orders');
    }
  };

  const isAllPageSelected = orders.length > 0 && orders.every(o => selectedOrders.includes(o.id));

  const toggleSelectAll = () => {
    if (isAllPageSelected) {
      const currentPageIds = orders.map(o => o.id);
      setSelectedOrders(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      const currentPageIds = orders.map(o => o.id);
      setSelectedOrders(prev => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]);
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border border-luxury-border rounded-full flex items-center justify-center animate-pulse">
          <div className="w-2 h-2 bg-black rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 pb-20">
      
      <OrderSheet 
        order={selectedOrderForSheet}
        isOpen={!!selectedOrderForSheet}
        onClose={() => setSelectedOrderForSheet(null)}
        onStatusChange={handleStatusChange}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 pb-6 md:pb-8 border-b border-luxury-border">
        <div>
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-muted mb-2 md:mb-3">Logistics Operations</p>
          <h1 className="text-3xl md:text-4xl font-light tracking-tighter">Order <span className="font-medium">Management.</span></h1>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {selectedOrders.length > 0 && (
            <div className="flex items-center justify-between w-full md:w-auto gap-3 bg-luxury-bg border border-luxury-border px-4 py-3 md:py-2 rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-muted">{selectedOrders.length} Selected</span>
              <div className="h-4 w-[1px] bg-luxury-border" />
              <select 
                onChange={(e) => handleBulkStatusChange(e.target.value)}
                className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer"
                value=""
              >
                <option value="" disabled>Bulk Status</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          )}
          <div className="relative group w-full md:min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-muted group-focus-within:text-black transition-colors" size={14} />
            <input
              type="text"
              placeholder="Search ID or Name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white border border-luxury-border py-3 pl-10 pr-4 rounded-xl text-[11px] font-medium tracking-wide outline-none focus:border-black transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-luxury-border rounded-[24px] md:rounded-[32px] overflow-hidden shadow-soft">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-luxury-border bg-luxury-bg/50">
                <th className="p-6 w-10">
                  <input 
                    type="checkbox" 
                    checked={isAllPageSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-luxury-border accent-black"
                  />
                </th>
                <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-muted">Order ID</th>
                <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-muted">Collector</th>
                <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.map((order) => (
                <tr 
                  key={order.id} 
                  onClick={() => setSelectedOrderForSheet(order)}
                  className="border-b border-luxury-border/50 hover:bg-luxury-bg/50 transition-colors group cursor-pointer"
                >
                  <td className="p-6 w-10" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleSelect(order.id)}
                      className="w-4 h-4 rounded border-luxury-border accent-black"
                    />
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold tracking-widest text-black bg-white px-3 py-1.5 rounded-lg border border-luxury-border shadow-sm">
                        {order.id.slice(0, 8)}
                      </span>
                      <div>
                         <p className="text-[10px] text-luxury-muted font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-luxury-bg rounded-lg flex items-center justify-center">
                        <User size={14} className="text-luxury-muted" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">{order.shipping_address?.fullName || 'N/A'}</p>
                        <p className="text-[10px] text-luxury-muted">{order.shipping_address?.email || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                     <div className="flex items-center justify-end gap-3">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border ${
                          order.status === 'processing' ? 'bg-black text-white border-black' : 
                          'bg-[#f0f9ff] text-[#0284c7] border-[#bae6fd]'
                        }`}>
                          {order.status}
                        </span>
                        <ArrowRight size={14} className="text-luxury-muted group-hover:text-black transition-colors" />
                     </div>
                  </td>
                </tr>
              )) : null}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-luxury-border">
          {orders.length > 0 && (
            <div className="p-4 bg-luxury-bg/50 border-b border-luxury-border flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={isAllPageSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-luxury-border accent-black"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-muted">Select All Orders</span>
              </div>
              <span className="text-[9px] font-bold bg-white px-2 py-1 border border-luxury-border rounded-lg text-black">
                {selectedOrders.length} Selected
              </span>
            </div>
          )}
          {orders.length > 0 ? orders.map((order) => {
            return (
              <div 
                key={order.id} 
                onClick={() => setSelectedOrderForSheet(order)}
                className="p-4 flex flex-col gap-4 cursor-pointer active:bg-luxury-bg transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div onClick={(e) => e.stopPropagation()} className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        className="w-4 h-4 rounded border-luxury-border accent-black"
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold tracking-widest text-black">#{order.id.slice(0, 8)}</p>
                      <p className="text-[10px] text-luxury-muted">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border ${
                      order.status === 'processing' ? 'bg-black text-white border-black' : 
                      'bg-[#f0f9ff] text-[#0284c7] border-[#bae6fd]'
                    }`}>
                      {order.status}
                    </span>
                    <ArrowRight size={14} className="text-luxury-muted" />
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="p-12 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-muted">
              No logistical records found.
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="p-6 md:p-8 bg-luxury-bg/30 border-t border-luxury-border flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <p className="text-[9px] font-bold uppercase tracking-widest text-luxury-muted order-2 md:order-1">
            Total Records: {totalPages * ITEMS_PER_PAGE}
          </p>
          <div className="flex items-center gap-4 order-1 md:order-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 border border-luxury-border rounded-full hover:bg-black hover:text-white transition-all disabled:opacity-20"
            >
              <ChevronDown size={16} className="rotate-90" />
            </button>
            <span className="text-[10px] font-bold">Page {currentPage} / {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 border border-luxury-border rounded-full hover:bg-black hover:text-white transition-all disabled:opacity-20"
            >
              <ChevronDown size={16} className="-rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
