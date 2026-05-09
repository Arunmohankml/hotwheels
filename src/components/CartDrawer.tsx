"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, itemCount } = useCart();
  const router = useRouter();

  const hasOutOfStockItems = cart.some(item => item.quantity > item.stock || item.stock <= 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="fixed right-0 top-0 h-[100dvh] w-full sm:max-w-[480px] bg-white text-black z-[101] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.1)] border-l border-black"
          >
            {/* Header */}
            <div className="p-8 border-b border-black flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tighter">
                  Shopping Cart
                </h3>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/40 mt-1">
                  {itemCount} {itemCount === 1 ? 'Item' : 'Items'} in Selection
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag size={32} strokeWidth={1.5} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">The cart is empty</p>
                  <button
                    onClick={onClose}
                    className="text-[10px] font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:opacity-50 transition-opacity"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-black/5">
                  {cart.map((item) => (
                    <div key={item.id} className="py-8 flex gap-6 group">
                      <div className="relative w-24 h-24 bg-white border border-black/5 shrink-0 flex items-center justify-center overflow-hidden">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className={`object-contain p-2 transition-all duration-500 rounded-xl ${item.stock <= 0 ? 'grayscale' : 'grayscale-0'}`}
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start gap-4">
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs uppercase tracking-tight truncate leading-tight">{item.name}</h4>
                              {item.stock <= 0 ? (
                                <div className="flex items-center gap-1.5 mt-1.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-hw-red animate-pulse" />
                                  <p className="text-[9px] font-black text-hw-red uppercase tracking-widest">OUT OF STOCK</p>
                                </div>
                              ) : item.quantity > item.stock ? (
                                <p className="text-[8px] font-bold text-hw-red uppercase tracking-widest mt-1">STOCK EXCEEDED (MAX {item.stock})</p>
                              ) : (
                                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-black/40">Collector Series</p>
                              )}
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-black/20 hover:text-black transition-colors shrink-0">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)} 
                              className="w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-90"
                            >
                              <Minus size={10} strokeWidth={3} />
                            </button>
                            <span className={`text-[11px] font-black w-4 text-center ${item.quantity > item.stock ? 'text-hw-red' : ''}`}>{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)} 
                              className="w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-90"
                            >
                              <Plus size={10} strokeWidth={3} />
                            </button>
                          </div>
                          <p className="text-xs font-black tracking-tighter">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-black bg-white">
                <div className="flex justify-between items-end mb-6">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/40">Subtotal Valuation</p>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                      <Shield size={10} strokeWidth={3} />
                      Secured Transaction
                    </div>
                  </div>
                  <p className="text-3xl font-black tracking-tighter">₹{cartTotal.toLocaleString('en-IN')}</p>
                </div>

                {hasOutOfStockItems && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="text-hw-red shrink-0" size={16} />
                    <p className="text-[10px] font-bold text-hw-red leading-relaxed uppercase tracking-tight">
                      Attention: Your cart contains items that are currently unavailable. Please remove out-of-stock items to proceed with the acquisition.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (hasOutOfStockItems) return;
                    onClose();
                    router.push('/checkout');
                  }}
                  disabled={hasOutOfStockItems}
                  className={`w-full py-6 text-white text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all group rounded-2xl ${
                    hasOutOfStockItems ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-black hover:opacity-90 shadow-xl'
                  }`}
                >
                  {hasOutOfStockItems ? 'Checkout Locked' : 'Proceed to Checkout'}
                  {!hasOutOfStockItems && <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

