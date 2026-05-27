"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const ProductCard = ({ product }: { product: any }) => {
  const { addToCart, setIsCartOpen } = useCart();

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (isOutOfStock) return;
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <Link href={`/shop/${product.id}`} className={`group block h-full ${isOutOfStock ? 'cursor-not-allowed pointer-events-none' : ''}`}>
      <div className={`bg-white rounded-[24px] md:rounded-[32px] p-3 md:p-6 border border-luxury-border shadow-soft hover:shadow-premium hover:border-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] relative flex flex-col h-full ${isOutOfStock ? 'grayscale opacity-80' : ''}`}>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 flex flex-col gap-2">
          <span className="px-2 md:px-3 py-1 bg-luxury-bg/80 backdrop-blur-md border border-luxury-border rounded-full text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-luxury-muted">
            {product.category || 'Standard'}
          </span>
        </div>

        {/* Image Container */}
        <div className="relative h-32 md:h-52 w-full flex items-center justify-center mb-2 md:mb-6 pt-2 md:pt-4 overflow-hidden rounded-2xl">
          <Image 
            src={product.image_url} 
            alt={product.name} 
            fill 
            className={`object-contain p-3 md:p-6 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${!isOutOfStock ? 'group-hover:scale-105' : ''}`} 
          />
        </div>

        {/* Product Info */}
        <div className="text-center mb-4 md:mb-6 flex-grow">
          <h3 className="font-medium text-[11px] md:text-sm uppercase tracking-tight text-black mb-1 truncate px-1">{product.name}</h3>
          <p className="text-[9px] md:text-[10px] font-bold text-luxury-muted uppercase tracking-widest">
            {isOutOfStock ? 'Inventory Depleted' : `₹${product.price.toLocaleString('en-IN')}`}
          </p>
        </div>

        {/* Action Button - Always Visible */}
        <div className="mt-auto">
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2.5 md:py-4 rounded-[14px] md:rounded-[20px] text-[8px] md:text-[9px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] flex items-center justify-center gap-2 transition-colors shadow-sm ${
              isOutOfStock 
                ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-hw-red'
            }`}
          >
            {isOutOfStock ? (
              <>
                <X size={12} className="md:w-3.5 md:h-3.5" />
                <span>Out of Stock</span>
              </>
            ) : (
              <>
                <ShoppingBag size={12} className="md:w-3.5 md:h-3.5" /> 
                <span className="hidden xs:inline">Add to Cart</span>
                <span className="xs:hidden">Add</span>
              </>
            )}
          </button>
        </div>

      </div>
    </Link>
  );
};

export default ProductCard;
