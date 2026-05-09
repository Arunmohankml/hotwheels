"use client";

import React from 'react';
import { Shield } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function PrivacyPage() {
  const settings = useSiteSettings();

  return (
    <div className="min-h-screen pt-40 pb-32 px-6 md:px-12 selection:bg-black selection:text-white bg-luxury-bg">
      <div className="max-w-[800px] mx-auto">
        
        <div className="mb-20 pb-12 border-b border-luxury-border flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-luxury-muted font-bold mb-4 flex items-center gap-2">
              <Shield size={12} /> Legal Framework
            </p>
            <h1 className="font-light text-5xl md:text-6xl uppercase tracking-tighter text-black">
              Data <span className="font-medium">Sovereignty.</span>
            </h1>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-muted">
            Last Updated: {new Date().getFullYear()}
          </p>
        </div>

        <article className="prose prose-neutral max-w-none text-black leading-[2] tracking-wide text-sm whitespace-pre-wrap">
          {settings.privacyPolicy || (
            <>
              <p className="text-base text-luxury-muted mb-12">
                At Scale Artistry, we treat your digital identity with the same reverence we afford our physical collections. This document outlines the cryptographic protocols and data handling procedures employed to secure your presence within our network.
              </p>

              <h2 className="text-xl font-medium tracking-tight mt-16 mb-6">1. Zero-Knowledge Information Collection</h2>
              <p>
                We adhere to a principle of absolute minimalism regarding data acquisition. Information collected is strictly limited to variables necessary for executing physical logistics and maintaining your registry identity. Financial transmission vectors are handled entirely off-site by our encrypted payment gateways; we never touch your raw financial keys.
              </p>
            </>
          )}

          <div className="mt-20 p-8 bg-white border border-luxury-border rounded-[24px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-muted mb-2">Direct Inquiry</p>
            <p className="font-medium text-sm">
              For security audits or data purge requests, contact our compliance node at 
              <a href={`mailto:${settings.contactEmail}`} className="ml-2 border-b border-black hover:text-hw-red hover:border-hw-red transition-colors">
                {settings.contactEmail}
              </a>.
            </p>
          </div>

        </article>

      </div>
    </div>
  );
}
