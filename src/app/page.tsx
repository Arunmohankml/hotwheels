"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Trophy } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // High-End Motion System
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const carRotate = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const carScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothCarScale = useSpring(carScale, springConfig);

  // Mock featured products for the showcase
  const featuredProducts = [
    { id: '1', name: 'Porsche 911 GT3 RS', price: 12500, image_url: '/images/car1.png', category: 'Elite' },
    { id: '2', name: 'Ferrari LaFerrari', price: 15000, image_url: '/images/car2.png', category: 'Signature' },
    { id: '3', name: 'Lamborghini Aventador SVJ', price: 13000, image_url: '/images/car3.png', category: 'Elite' },
    { id: '4', name: 'McLaren P1', price: 14500, image_url: '/images/car4.png', category: 'Signature' },
  ];

  return (
    <div className="relative font-sans overflow-hidden" ref={containerRef}>
      
      {/* Cinematic Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-screen flex flex-col items-center justify-center pt-24 md:pt-32 pb-12 md:pb-16 px-6 md:px-12">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-black/[0.01] blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] rounded-full bg-black/[0.015] blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-[1600px] mx-auto flex flex-col items-center">
          
          <motion.div style={{ y: textY, opacity }} className="text-center z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-luxury-border bg-white/50 backdrop-blur-md mb-8"
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-black">Featured Collection</span>
            </motion.div>

            <div className="overflow-hidden mb-10 px-4">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-[9vw] font-light leading-[0.85] tracking-tighter uppercase"
              >
                Engineering <br className="hidden md:block" />
                <span className="font-medium">Perfected.</span>
              </motion.h1>
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.8, duration: 1.5 }}
              className="max-w-md mx-auto text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] leading-[2] text-black"
            >
              Discover the absolute pinnacle of scale automotive design. 
              <br className="hidden md:block" /> Curated for the modern elite collector.
            </motion.p>
          </motion.div>

          {/* Floating Transparent Car */}
          <motion.div 
            style={{ scale: smoothCarScale, rotate: carRotate }}
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative w-full max-w-[1200px] mt-16 md:mt-0 lg:-mt-12 pointer-events-none z-10"
          >
            <Image 
              src="/images/car13.png" 
              alt="Hero Vehicle" 
              width={1600} 
              height={900} 
              className="w-full h-auto object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.15)]"
              priority
            />
          </motion.div>


        </div>
      </section>



    </div>
  );
}
