"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Award, Users } from 'lucide-react';
import Image from 'next/image';

import { useSiteSettings } from '@/hooks/useSiteSettings';

const AboutPage = () => {
  const settings = useSiteSettings();
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 selection:bg-black selection:text-white">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Hero Section */}
        <div className="mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold uppercase tracking-[0.5em] text-luxury-muted mb-6"
          >
            The Heritage
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-light tracking-tighter leading-[0.9] text-black mb-12"
          >
            Crafting Miniature <br />
            <span className="font-medium">Masterpieces.</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-full h-[400px] md:h-[600px] rounded-[48px] overflow-hidden shadow-2xl"
          >
            <Image 
              src="https://images.unsplash.com/photo-1594731826583-f80742639df9?q=80&w=2070&auto=format&fit=crop" 
              alt="Premium Car Collection" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
               <p className="text-white/80 max-w-xl text-lg font-light leading-relaxed">
                  Founded on a passion for precision and speed, our store is the ultimate destination for serious collectors of high-end die-cast models.
               </p>
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {[
            { icon: Shield, title: 'Authenticity', desc: 'Every model is a verified original from the most prestigious series.' },
            { icon: Target, title: 'Precision', desc: 'Crafted with absolute attention to detail and historical accuracy.' },
            { icon: Award, title: 'Curation', desc: 'Only the rarest and most sought-after models make it to our store.' },
            { icon: Users, title: 'Community', desc: 'Built by collectors, for collectors, sharing the love for automotive art.' }
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="p-10 bg-white border border-luxury-border rounded-[32px] hover:shadow-premium transition-all group"
            >
              <div className="w-12 h-12 bg-luxury-bg rounded-2xl flex items-center justify-center mb-8 border border-luxury-border group-hover:bg-black group-hover:text-white transition-colors">
                <item.icon size={20} />
              </div>
              <h3 className="text-xl font-medium mb-4">{item.title}</h3>
              <p className="text-xs text-luxury-muted leading-relaxed uppercase tracking-widest font-bold">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Vision Statement */}
        <div className="bg-black text-white rounded-[56px] p-12 md:p-24 overflow-hidden relative">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-12 leading-tight">
              Driven by the <br />
              <span className="italic font-serif">Spirit of Speed.</span>
            </h2>
            <div className="space-y-6 text-white/60 text-lg font-light leading-relaxed">
              <p>
                We believe that die-cast models are more than just toys—they are historical artifacts that capture the essence of automotive engineering and cultural evolution.
              </p>
              <p>
                Our mission is to provide collectors with a seamless experience to acquire, trade, and showcase the finest miniatures in the world.
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block opacity-20">
             <Image 
               src="https://images.unsplash.com/photo-1581235720704-06d3acfc136f?q=80&w=1780&auto=format&fit=crop" 
               alt="Vision" 
               fill 
               className="object-cover"
             />
          </div>
        </div>

        {/* Contact Node */}
        <div className="mt-32 text-center space-y-12">
          <div className="space-y-4">
             <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-luxury-muted">Get in Touch</p>
             <h2 className="text-4xl md:text-5xl font-light tracking-tighter">Connect with the <span className="font-medium">Archive.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
             <div className="p-8 bg-white border border-luxury-border rounded-[32px] space-y-2">
                <p className="text-[8px] font-bold uppercase tracking-widest text-luxury-muted">Direct Inquiry</p>
                <p className="text-sm font-medium text-black uppercase tracking-widest underline underline-offset-4">{settings.contactEmail}</p>
             </div>
             <div className="p-8 bg-white border border-luxury-border rounded-[32px] space-y-2">
                <p className="text-[8px] font-bold uppercase tracking-widest text-luxury-muted">Voice Protocol</p>
                <p className="text-sm font-medium text-black uppercase tracking-widest underline underline-offset-4">{settings.contactPhone}</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
