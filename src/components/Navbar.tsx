"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Heart, Menu, X, Shield } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlist, setIsWishlistOpen } = useWishlist();
  const pathname = usePathname();

  // Hide global navbar on admin routes to allow for dedicated admin navigation
  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  if (isAdminRoute) return null;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' }
  ];

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-[100] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? 'py-4 bg-white/70 backdrop-blur-2xl shadow-soft' : 'py-8 bg-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-2 md:gap-3 group">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-black rounded-lg flex items-center justify-center overflow-hidden">
              <span className="text-white font-bold text-[10px] md:text-xs group-hover:scale-110 transition-transform duration-500">HW</span>
            </div>
            <span className="text-sm md:text-lg font-medium tracking-tighter uppercase text-black">Store</span>
          </Link>

          {/* Right Side Group (Links + Actions) */}
          <div className="hidden md:flex items-center gap-12">
            {/* Desktop Links */}
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-muted hover:text-black transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-black transition-all duration-500 ease-out group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Separator */}
            <div className="w-[1px] h-4 bg-luxury-border" />

            {/* Desktop Actions */}
            <div className="flex items-center gap-8">
              <button 
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2 text-luxury-muted hover:text-black transition-colors"
              >
                <Heart size={18} strokeWidth={1.5} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-hw-red rounded-full" />
                )}
              </button>
              
              <Link 
                href={currentUser ? "/account" : "/login"}
                className="p-2 text-luxury-muted hover:text-black transition-colors"
              >
                <User size={18} strokeWidth={1.5} />
              </Link>

              <button 
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-3 px-6 py-2.5 border border-luxury-border rounded-full hover:border-black transition-all group"
              >
                <ShoppingBag size={14} strokeWidth={1.5} className="group-hover:-translate-y-0.5 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{itemCount}</span>
              </button>
            </div>
          </div>

          {/* Mobile Actions & Toggle */}
          <div className="flex md:hidden items-center gap-1">
            <button 
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 text-black/40"
            >
              <Heart size={16} strokeWidth={1.5} />
            </button>
            
            <Link 
              href={currentUser ? "/account" : "/login"}
              className="p-2 text-black/40"
            >
              <User size={16} strokeWidth={1.5} />
            </Link>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-black relative"
            >
              <ShoppingBag size={16} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-hw-red rounded-full" />
              )}
            </button>

            <button 
              className="ml-1 w-9 h-9 flex items-center justify-center border border-black/10 rounded-lg text-black transition-all active:scale-95"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-white pt-32 px-8 pb-12 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                >
                  <Link 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-4xl font-light uppercase tracking-tighter text-black"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-6"
            >
              <div className="h-[1px] w-full bg-luxury-border" />
              <div className="flex justify-between items-center">
                <Link 
                  href={currentUser ? "/account" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-luxury-muted"
                >
                  <User size={16} /> {currentUser ? 'Account' : 'Sign In'}
                </Link>
                <div className="flex gap-8">
                  <button onClick={() => { setIsWishlistOpen(true); setMobileMenuOpen(false); }} className="p-3 bg-luxury-card rounded-full border border-luxury-border">
                    <Heart size={16} />
                  </button>
                  <button onClick={() => { setIsCartOpen(true); setMobileMenuOpen(false); }} className="p-3 bg-black text-white rounded-full flex items-center gap-2">
                    <ShoppingBag size={16} />
                    <span className="text-[10px] font-bold">{itemCount}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
