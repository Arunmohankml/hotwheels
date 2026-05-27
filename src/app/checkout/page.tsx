"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, ShieldCheck, MapPin, ChevronLeft, Package, Info } from 'lucide-react';
import Image from 'next/image';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', email: '', address: '', city: '', zip: ''
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Razorpay Order
      const response = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal }),
      });

      const orderData = await response.json();
      if (orderData.error) throw new Error(orderData.error);

      // 2. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SnHp6xjK9pOb5M',
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Hot Wheels Store",
        description: "Collector Series Acquisition",
        order_id: orderData.id,
        handler: async (response: any) => {
          // 3. Payment Success - Record Order
          const user = auth.currentUser;
          const orderPayload: any = {
            user_id: user?.uid || null,
            total_amount: cartTotal,
            status: 'processing',
            shipping_address: formData,
            payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            items: cart
          };

          const { error } = await supabase.from('orders').insert([orderPayload]);
          if (error) throw error;

          // 4. Update Stock
          for (const item of cart) {
            const { data: currentProd } = await supabase
              .from('products')
              .select('stock')
              .eq('id', item.id)
              .single();
            
            if (currentProd) {
              const newStock = Math.max(0, currentProd.stock - item.quantity);
              await supabase.from('products').update({ stock: newStock }).eq('id', item.id);
            }
          }

          clearCart();
          router.push('/order-success');
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
        },
        theme: { color: "#000000" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      alert("Transaction failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-12">
        <div className="w-20 h-20 rounded-full bg-luxury-card border border-luxury-border flex items-center justify-center mb-8 shadow-soft">
          <Package className="text-luxury-muted" size={32} />
        </div>
        <h2 className="text-3xl font-light tracking-tight mb-8">Your cart is empty</h2>
        <button 
          onClick={() => router.push('/shop')} 
          className="luxury-button"
        >
          Explore Store
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-32 px-6 md:px-12 selection:bg-black selection:text-white">
      <div className="max-w-[1400px] mx-auto">
        
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-3 text-luxury-muted hover:text-black transition-colors mb-8 md:mb-12 text-[10px] font-bold uppercase tracking-[0.3em]"
        >
          <ChevronLeft size={16} /> Return to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-24">
          
          {/* Left: Shipping Form */}
          <div className="lg:col-span-7 space-y-12 md:space-y-16">
            <div>
              <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-4">Secure <span className="font-medium">Checkout</span></h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-muted">Enter your shipping details</p>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-10 md:space-y-12">
              <div className="space-y-8 md:space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-muted ml-1">Full Name</label>
                    <input 
                      required 
                      value={formData.fullName} 
                      onChange={e => setFormData({...formData, fullName: e.target.value})} 
                      className="luxury-input" 
                      placeholder="e.g. John Doe" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-muted ml-1">Email Address</label>
                    <input 
                      required 
                      type="email" 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                      className="luxury-input" 
                      placeholder="collector@example.com" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-muted ml-1">Shipping Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-6 text-luxury-muted" size={16} />
                    <textarea 
                      required 
                      value={formData.address} 
                      onChange={e => setFormData({...formData, address: e.target.value})} 
                      className="w-full bg-luxury-card border border-luxury-border p-6 pl-16 rounded-[24px] outline-none focus:border-black h-32 transition-colors font-medium text-sm resize-none shadow-sm" 
                      placeholder="Street address, P.O. box, company name, c/o"
                    ></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-muted ml-1">City</label>
                    <input 
                      required 
                      value={formData.city} 
                      onChange={e => setFormData({...formData, city: e.target.value})} 
                      className="luxury-input" 
                      placeholder="Metropolis" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-muted ml-1">ZIP Code</label>
                    <input 
                      required 
                      value={formData.zip} 
                      onChange={e => setFormData({...formData, zip: e.target.value})} 
                      className="luxury-input" 
                      placeholder="10001" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-luxury-border">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-6 bg-black text-white font-bold text-[10px] uppercase tracking-[0.4em] rounded-[24px] shadow-premium hover:bg-hw-red transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? 'Processing Transaction...' : 'Proceed to Payment'} 
                  <CreditCard size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="mt-8 flex items-center justify-center gap-8 opacity-20 grayscale">
                  <div className="h-6 w-10 bg-black/40 rounded flex items-center justify-center text-[6px] text-white">VISA</div>
                  <div className="h-6 w-10 bg-black/40 rounded flex items-center justify-center text-[6px] text-white">MASTERCARD</div>
                  <div className="h-6 w-10 bg-black/40 rounded flex items-center justify-center text-[6px] text-white">AMEX</div>
                </div>
              </div>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-luxury-border p-8 md:p-12 rounded-[40px] shadow-premium sticky top-32">
              <div className="flex items-center justify-between mb-8 md:mb-12">
                <h3 className="text-2xl font-light tracking-tight">Order <span className="font-medium">Summary</span></h3>
                <span className="px-4 py-2 bg-luxury-bg border border-luxury-border rounded-full text-[9px] font-bold uppercase tracking-[0.3em]">
                  {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 mb-12 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center group">
                    <div className="flex gap-6 items-center">
                      <div className="w-20 h-16 bg-luxury-card rounded-2xl border border-luxury-border flex items-center justify-center p-2 relative overflow-hidden group-hover:border-black transition-colors">
                        <Image 
                          src={item.image_url} 
                          alt={item.name} 
                          fill
                          className="object-contain p-2 group-hover:scale-110 transition-transform duration-500" 
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-medium uppercase tracking-tight text-black">{item.name}</h4>
                        <p className="text-[9px] text-luxury-muted font-bold uppercase tracking-[0.3em] mt-1">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-sm font-light">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-10 border-t border-luxury-border">
                <div className="flex justify-between text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-muted">Subtotal</span>
                  <span className="font-medium text-black">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-muted">Shipping</span>
                  <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Free</span>
                </div>
                <div className="flex justify-between items-end pt-8">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-luxury-muted block mb-2">Total Amount</span>
                    <span className="text-4xl font-light tracking-tighter text-black">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-8 bg-luxury-bg rounded-[32px] border border-luxury-border flex items-start gap-5">
                <ShieldCheck className="text-black shrink-0" size={20} />
                <div className="space-y-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-black">Secure Checkout</p>
                  <p className="text-[10px] text-luxury-muted leading-relaxed">Your payment information is processed securely. We do not store your credit card details.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
