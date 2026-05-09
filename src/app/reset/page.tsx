"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ArrowRight, Mail, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const ResetPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Recovery instructions deployed! Please check your inbox and spam folder.');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('Registry identifier not found. Please verify your email.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid digital signature. Please provide a valid email.');
      } else {
        setError('Recovery transmission failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center px-6 selection:bg-black selection:text-white relative">
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-black/[0.015] blur-[80px]" />
      </div>

      <div className="w-full max-w-[480px] relative z-10">
        
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-black rounded-xl mx-auto flex items-center justify-center mb-6 shadow-soft">
            <span className="text-white font-bold text-sm">HW</span>
          </div>
          <h1 className="text-4xl font-light tracking-tighter mb-3">
            Recover <span className="font-medium">Access.</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-muted">
            Restore registry privileges
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-luxury-border rounded-[32px] p-8 sm:p-10 shadow-premium"
        >
          {error && (
            <div className="mb-8 p-4 bg-[#fff0f0] border border-[#ffcccc] rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] text-[#d91d2a] text-center">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-8 p-4 bg-[#f0fff4] border border-[#ccffdd] rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] text-[#15803d] text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-7 top-1/2 -translate-y-1/2 text-luxury-muted group-focus-within:text-black transition-colors" size={18} />
              <input 
                type="email" 
                required
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-luxury-bg border border-luxury-border py-5 pl-16 pr-6 rounded-[24px] outline-none focus:border-black focus:bg-white transition-all font-medium text-sm" 
                placeholder="collector@example.com" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-[0.4em] shadow-lg hover:bg-hw-red transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4 group"
            >
              {loading ? 'Processing...' : 'Send Directives'}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-muted hover:text-black transition-colors border-b border-transparent hover:border-black pb-1"
            >
              <ChevronLeft size={12} /> Return to Authorization
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default ResetPage;
