"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Package, Truck, CheckCircle2, Box } from 'lucide-react';
import Image from 'next/image';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      const { data } = await supabase.from('orders').select('*').eq('id', id).single();
      if (data) setOrder(data);
      setLoading(false);
    }
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-luxury-bg">
        <div className="w-12 h-12 border border-luxury-border rounded-full flex items-center justify-center animate-pulse">
          <div className="w-2 h-2 bg-black rounded-full" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-luxury-bg text-center">
        <h1 className="text-3xl font-light mb-4">Record Not Found</h1>
        <button onClick={() => router.push('/account')} className="text-[10px] uppercase tracking-[0.2em] text-luxury-muted hover:text-black border-b border-black pb-1">Return to Registry</button>
      </div>
    );
  }

  const getStatusStep = () => {
    switch(order.status) {
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 1;
    }
  };

  const currentStep = getStatusStep();

  return (
    <div className="min-h-screen pt-32 pb-32 px-6 md:px-12 selection:bg-black selection:text-white">
      <div className="max-w-[1000px] mx-auto">
        
        <button 
          onClick={() => router.push('/account')} 
          className="flex items-center gap-3 text-luxury-muted hover:text-black transition-colors mb-12 text-[10px] font-bold uppercase tracking-[0.3em]"
        >
          <ChevronLeft size={16} /> Return to Account
        </button>

        <div className="bg-white border border-luxury-border rounded-[40px] p-8 md:p-16 shadow-premium">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 pb-12 border-b border-luxury-border">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-luxury-muted font-bold mb-3">Order Details</p>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight">{order.id.slice(0, 8)}</h1>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[10px] uppercase tracking-[0.4em] text-luxury-muted font-bold mb-3">Date</p>
              <p className="text-lg font-medium text-black">
                {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-12 md:mb-20 relative px-2">
            <div className="absolute top-8 md:top-1/2 left-0 w-full h-[1px] bg-luxury-border md:-translate-y-1/2 z-0" />
            <div 
              className="absolute top-8 md:top-1/2 left-0 h-[2px] bg-black md:-translate-y-1/2 z-0 transition-all duration-1000" 
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }} 
            />

            <div className="grid grid-cols-3 gap-0 relative z-10">
              
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-colors duration-500 shadow-soft ${currentStep >= 1 ? 'bg-black text-white' : 'bg-luxury-bg border border-luxury-border text-luxury-muted'}`}>
                  <Box size={18} className="md:w-6 md:h-6" strokeWidth={1.5} />
                </div>
                <h4 className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] ${currentStep >= 1 ? 'text-black' : 'text-luxury-muted'}`}>Processing</h4>
                <p className="text-[10px] text-luxury-muted mt-2 hidden md:block">Preparing order</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-colors duration-500 shadow-soft ${currentStep >= 2 ? 'bg-black text-white' : 'bg-luxury-bg border border-luxury-border text-luxury-muted'}`}>
                  <Truck size={18} className="md:w-6 md:h-6" strokeWidth={1.5} />
                </div>
                <h4 className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] ${currentStep >= 2 ? 'text-black' : 'text-luxury-muted'}`}>In Transit</h4>
                <p className="text-[10px] text-luxury-muted mt-2 hidden md:block">Order shipped</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-colors duration-500 shadow-soft ${currentStep >= 3 ? 'bg-black text-white' : 'bg-luxury-bg border border-luxury-border text-luxury-muted'}`}>
                  <CheckCircle2 size={18} className="md:w-6 md:h-6" strokeWidth={1.5} />
                </div>
                <h4 className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] ${currentStep >= 3 ? 'text-black' : 'text-luxury-muted'}`}>Delivered</h4>
                <p className="text-[10px] text-luxury-muted mt-2 hidden md:block">Order delivered</p>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-luxury-border pt-16">
            
            <div className="space-y-10">
              <h3 className="text-lg font-medium tracking-tight">Items</h3>
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-6 items-center p-4 rounded-[24px] bg-luxury-bg border border-luxury-border">
                    <div className="w-20 h-20 bg-white rounded-2xl border border-luxury-border flex items-center justify-center p-2 relative overflow-hidden">
                      <Image src={item.image_url} alt={item.name} fill className="object-contain p-2" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium uppercase tracking-tight text-black mb-1">{item.name}</h4>
                      <p className="text-[9px] text-luxury-muted font-bold uppercase tracking-[0.3em] mb-2">Qty: {item.quantity}</p>
                      <p className="text-sm font-light text-black">₹{item.price?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              <h3 className="text-lg font-medium tracking-tight">Shipping Details</h3>
              
              <div className="p-8 bg-luxury-bg border border-luxury-border rounded-[24px] space-y-6">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-muted mb-2">Shipping Address</p>
                  <p className="text-sm font-medium leading-relaxed">{order.shipping_address?.fullName}</p>
                  <p className="text-sm text-luxury-muted mt-1">
                    {order.shipping_address?.address}<br/>
                    {order.shipping_address?.city}, {order.shipping_address?.zip}
                  </p>
                </div>
                <div className="pt-6 border-t border-luxury-border">
                  <div className="flex justify-between items-end">
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-muted">Total Amount</p>
                    <p className="text-3xl font-light tracking-tighter">₹{order.total_amount?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
