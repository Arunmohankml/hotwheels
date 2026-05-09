"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", type = 'warning' 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#0f0f0f] border border-white/10 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
              type === 'danger' ? 'bg-hw-red/10 text-hw-red' : 'bg-hw-orange/10 text-hw-orange'
            }`}>
              <AlertTriangle size={28} />
            </div>

            <h3 className="font-display font-black text-2xl uppercase italic tracking-tighter mb-2">{title}</h3>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">{message}</p>

            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 py-3 border border-white/5 bg-white/5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-95 ${
                  type === 'danger' ? 'bg-hw-red shadow-[0_0_20px_rgba(255,42,42,0.3)]' : 'bg-hw-orange shadow-[0_0_20px_rgba(255,107,0,0.3)]'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
