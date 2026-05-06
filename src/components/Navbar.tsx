"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, User, Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-100% z-50 transition-all duration-400 ${
        scrolled ? 'py-4 bg-black/70 backdrop-blur-xl border-b border-white/10' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="group">
          <span className="font-display font-black text-3xl tracking-tighter uppercase italic">
            HOT <span className="text-hw-red group-hover:text-hw-orange transition-colors">WHEELS</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-10 items-center">
          {['Intro', 'Shop', 'Drops'].map((item) => (
            <Link 
              key={item} 
              href={item === 'Intro' ? '/' : `/${item.toLowerCase()}`}
              className="text-sm font-semibold uppercase tracking-widest text-white/80 hover:text-hw-red transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-hw-red transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-white hover:text-hw-red hover:scale-110 transition-all">
            <Search size={22} />
          </button>
          <button className="p-2 text-white hover:text-hw-red hover:scale-110 transition-all">
            <Heart size={22} />
          </button>
          <button className="p-2 text-white hover:text-hw-red hover:scale-110 transition-all relative">
            <ShoppingCart size={22} />
            <span className="absolute top-0 right-0 w-4 h-4 bg-hw-red text-[10px] flex items-center justify-center rounded-full font-bold">3</span>
          </button>
          <Link href="/login" className="p-2 text-white hover:text-hw-red hover:scale-110 transition-all">
            <User size={22} />
          </Link>
          
          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 p-8 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {['Intro', 'Shop', 'Drops'].map((item) => (
                <Link 
                  key={item} 
                  href={item === 'Intro' ? '/' : `/${item.toLowerCase()}`}
                  className="text-xl font-bold uppercase tracking-widest text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
