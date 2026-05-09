"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  toggleWishlist: (product: any) => void;
  isInWishlist: (id: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (isOpen: boolean) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hw_wishlist');
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('hw_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product: any) => {
    setWishlist(prev => {
      const isPresent = prev.find(item => item.id === product.id);
      if (isPresent) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image_url: product.image_url }];
    });
  };

  const isInWishlist = (id: string) => wishlist.some(item => item.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, isWishlistOpen, setIsWishlistOpen }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
