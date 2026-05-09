"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistDrawer = ({ isOpen, onClose }: WishlistDrawerProps) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

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
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 h-[100dvh] w-full sm:max-w-[480px] luxury-glass z-[101] flex flex-col shadow-premium"
          >
            {/* Header */}
            <div className="p-8 border-b border-luxury-border flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="font-display font-medium text-2xl uppercase tracking-[0.2em]">
                  WISHLIST
                </h3>
                <p className="text-[10px] opacity-40 uppercase tracking-widest font-light">
                  {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} Saved
                </p>
              </div>
              <button 
                onClick={onClose}
                className="opacity-40 hover:opacity-100 transition-opacity duration-500"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-12">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <Heart size={48} strokeWidth={1} className="opacity-10" />
                  <p className="text-xs uppercase tracking-[0.3em] opacity-40 font-light">Your wishlist is currently empty</p>
                  <button 
                    onClick={onClose} 
                    className="text-[10px] uppercase tracking-[0.2em] font-medium border-b border-luxury-text pb-1 hover:opacity-60 transition-opacity"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                wishlist.map((item) => (
                  <div key={item.id} className="flex gap-8 group">
                    <div className="relative w-24 h-24 aspect-square flex items-center justify-center bg-luxury-secondary rounded-2xl overflow-hidden">
                      <Image 
                        src={item.image_url} 
                        alt={item.name} 
                        fill
                        className="object-contain p-2 transition-transform duration-700 group-hover:scale-110" 
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-display font-medium text-sm tracking-tight truncate max-w-[150px]">{item.name}</h4>
                          <button onClick={() => toggleWishlist(item)} className="opacity-40 hover:opacity-100 text-hw-red transition-opacity">
                            <Heart size={14} strokeWidth={1.5} className="fill-hw-red" />
                          </button>
                        </div>
                        <p className="text-[10px] opacity-40 uppercase tracking-widest font-light">Model Series</p>
                        <p className="text-xs font-light tracking-widest pt-2">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          addToCart(item);
                          toggleWishlist(item);
                        }}
                        className="mt-4 w-full py-3 bg-black text-white text-[9px] uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-2 hover:bg-hw-red transition-colors rounded-full"
                      >
                        <ShoppingBag size={12} strokeWidth={2} /> Move to Cart
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistDrawer;
