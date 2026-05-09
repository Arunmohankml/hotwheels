"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import CartDrawer from './CartDrawer';
import WishlistDrawer from './WishlistDrawer';

export default function ClientDrawers() {
  const { isCartOpen, setIsCartOpen } = useCart() as any; // Assuming cart context has these
  const { isWishlistOpen, setIsWishlistOpen } = useWishlist();

  return (
    <>
      {isCartOpen !== undefined && <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </>
  );
}
