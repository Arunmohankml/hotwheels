"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Globe } from 'lucide-react';

import { useSiteSettings } from '@/hooks/useSiteSettings';

const Footer = () => {
  const pathname = usePathname();
  const settings = useSiteSettings();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) return null;

  return (
    <footer className="bg-luxury-bg border-t border-luxury-border py-24 px-6 md:px-12 mt-auto">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
        
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">HW</span>
            </div>
            <span className="text-lg font-medium tracking-tighter uppercase text-black">Hot Wheels Store</span>
          </Link>
          <div className="space-y-4">
            <p className="max-w-xs text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-muted leading-relaxed">
              Preserving the heritage of automotive scale design through a curated archive of high-fidelity masterpieces.
            </p>
            <div className="space-y-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-black">{settings.contactEmail}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-luxury-muted">{settings.contactPhone}</p>
            </div>
          </div>
        </div>

        {/* Links Columns */}
        <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-[10px] font-bold uppercase tracking-widest text-black">
          
          <div className="space-y-6">
            <h4 className="text-luxury-muted opacity-50 tracking-[0.4em]">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/shop" className="hover:text-hw-red transition-colors">Shop</Link></li>
              <li><Link href="/account" className="hover:text-hw-red transition-colors">My Account</Link></li>
              <li><Link href="/checkout" className="hover:text-hw-red transition-colors">Checkout</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-luxury-muted opacity-50 tracking-[0.4em]">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="hover:text-hw-red transition-colors">Privacy Policy</Link></li>
              <li><Link href="/returns" className="hover:text-hw-red transition-colors">Returns & Logistics</Link></li>
              <li><Link href="/terms" className="hover:text-hw-red transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-luxury-muted opacity-50 tracking-[0.4em]">Connect</h4>
            <ul className="space-y-4">
              <li><a href={`https://wa.me/${(settings.contactWhatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-hw-red transition-colors">WhatsApp</a></li>
              <li><a href={`mailto:${settings.contactEmail}`} className="hover:text-hw-red transition-colors">Support Email</a></li>
              <li><a href="#" className="hover:text-hw-red transition-colors">Instagram</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-luxury-muted opacity-50 tracking-[0.4em]">Security</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-luxury-muted">
                <Shield size={14} /> <span>Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-luxury-muted">
                <Globe size={14} /> <span>International</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-[1600px] mx-auto mt-24 pt-8 border-t border-luxury-border flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-muted">
        <p>© {new Date().getFullYear()} Hot Wheels Store. All rights reserved.</p>
        <p>A Premium Die-Cast Experience</p>
      </div>
    </footer>
  );
};

export default Footer;
