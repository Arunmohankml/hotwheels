"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Package, ArrowRight } from 'lucide-react';


const OrderSuccessPage = () => {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center p-6 bg-luxury-bg relative overflow-hidden">


      <div className="max-w-[600px] w-full bg-white border border-luxury-border p-12 md:p-20 rounded-[48px] shadow-premium text-center relative z-10">
        
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          className="w-32 h-32 mx-auto bg-black rounded-full flex items-center justify-center mb-12 shadow-lg"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Check size={48} className="text-white" strokeWidth={2.5} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="space-y-6"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-muted block">Order Confirmed</span>
          <h1 className="text-5xl font-light tracking-tighter text-black">Thank <br/> <span className="font-medium">You.</span></h1>
          <p className="text-luxury-muted text-sm leading-relaxed max-w-sm mx-auto">
            We've received your order. We will notify you when it ships.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 pt-12 border-t border-luxury-border flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link 
            href="/account" 
            className="w-full sm:w-auto px-8 py-5 border border-luxury-border rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-black hover:border-black transition-all"
          >
            Track Order
          </Link>
          <Link 
            href="/shop" 
            className="w-full sm:w-auto px-8 py-5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-hw-red transition-all group shadow-md"
          >
            Continue Shopping <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;
