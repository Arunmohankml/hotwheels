"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { CheckCircle, Zap } from 'lucide-react';

const NotificationToast = () => {
  const { notification } = useCart();

  return (
    <AnimatePresence>
      {notification && (
        <motion.div 
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-24 md:bottom-10 left-1/2 z-[200] bg-hw-dark border border-hw-red/30 px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(255,42,42,0.2)] backdrop-blur-xl flex items-center gap-4 min-w-[300px]"
        >
          <div className="w-10 h-10 rounded-full bg-hw-red/10 flex items-center justify-center text-hw-red">
            <Zap size={20} className="animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-hw-red">System Alert</p>
            <p className="text-sm font-bold text-white">{notification}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;
