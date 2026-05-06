"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  series: string;
  price: number;
  image_url: string;
  is_limited?: boolean;
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="product-card group relative bg-hw-card border border-white/10 rounded-xl p-6 transition-all hover:border-hw-red/30"
    >
      {/* 3D Glow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
      
      {/* Badges */}
      {product.is_limited && (
        <span className="absolute top-4 left-4 z-10 bg-hw-red text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
          Rare
        </span>
      )}

      {/* Image Wrap */}
      <div className="relative h-48 w-full flex items-center justify-center mb-6 overflow-visible">
        <motion.div
          whileHover={{ rotate: -5, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative w-full h-full"
        >
          <Image 
            src={product.image_url} 
            alt={product.name} 
            fill
            className="object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]"
          />
        </motion.div>
      </div>

      {/* Details */}
      <div className="relative z-10">
        <h4 className="font-display font-bold text-xl mb-1 group-hover:text-hw-red transition-colors">{product.name}</h4>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-4">{product.series}</p>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="font-display font-black text-2xl tracking-tight">₹{product.price.toLocaleString('en-IN')}</span>
          <button className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center hover:bg-hw-red hover:text-white transition-all shadow-lg">
            <Plus size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
