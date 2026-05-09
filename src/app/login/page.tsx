"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        if (cred.user.email === 'arunmohankml@gmail.com') {
          router.push('/admin');
        } else {
          router.push('/account');
        }
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await supabase.from('profiles').insert([
          { id: cred.user.uid, email, full_name: name, is_admin: false }
        ]);
        router.push('/account');
      }
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user exists in Supabase, if not, create them
      const { data } = await supabase.from('profiles').select('id').eq('id', result.user.uid).single();
      if (!data) {
        await supabase.from('profiles').insert([
          { id: result.user.uid, email: result.user.email, full_name: result.user.displayName, is_admin: false }
        ]);
      }
      
      if (result.user.email === 'arunmohankml@gmail.com') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center px-6 selection:bg-black selection:text-white">
      
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-black/[0.02] blur-[80px]" />
      </div>

      <div className="w-full max-w-[480px] relative z-10">
        
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-black rounded-xl mx-auto flex items-center justify-center mb-6 shadow-soft">
            <span className="text-white font-bold text-sm">HW</span>
          </div>
          <h1 className="text-4xl font-light tracking-tighter mb-3">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-muted">
            {isLogin ? 'Welcome back to the store' : 'Join our community'}
          </p>
        </div>

        <motion.div 
          layout
          className="bg-white border border-luxury-border rounded-[32px] p-8 sm:p-10 shadow-premium"
        >
          {error && (
            <div className="mb-8 p-4 bg-[#fff0f0] border border-[#ffcccc] rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] text-[#d91d2a] text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative group">
                    <User className="absolute left-7 top-1/2 -translate-y-1/2 text-luxury-muted group-focus-within:text-black transition-colors" size={18} />
                    <input 
                      type="text" 
                      required={!isLogin}
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="w-full bg-luxury-bg border border-luxury-border py-5 pl-16 pr-6 rounded-[24px] outline-none focus:border-black focus:bg-white transition-all font-medium text-sm" 
                      placeholder="Full Name" 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <Mail className="absolute left-7 top-1/2 -translate-y-1/2 text-luxury-muted group-focus-within:text-black transition-colors" size={18} />
              <input 
                type="email" 
                required
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-luxury-bg border border-luxury-border py-5 pl-16 pr-6 rounded-[24px] outline-none focus:border-black focus:bg-white transition-all font-medium text-sm" 
                placeholder="Email Address" 
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-7 top-1/2 -translate-y-1/2 text-luxury-muted group-focus-within:text-black transition-colors" size={18} />
              <input 
                type="password" 
                required
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full bg-luxury-bg border border-luxury-border py-5 pl-16 pr-6 rounded-[24px] outline-none focus:border-black focus:bg-white transition-all font-medium text-sm" 
                placeholder="Password" 
              />
            </div>

            {isLogin && (
              <div className="flex justify-end pt-2">
                <Link href="/reset" className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-muted hover:text-black transition-colors">
                  Forgot Password?
                </Link>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-[0.4em] shadow-lg hover:bg-hw-red transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4 group"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-luxury-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-luxury-muted text-[10px] uppercase tracking-widest font-bold">Or continue with</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-4 bg-white border border-luxury-border text-black rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-luxury-bg transition-all flex items-center justify-center gap-3 disabled:opacity-50 group shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Google
          </button>

          <div className="mt-10 text-center">
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-muted hover:text-black transition-colors border-b border-transparent hover:border-black pb-1"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
