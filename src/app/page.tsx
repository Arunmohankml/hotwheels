"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import FeaturedProducts from '@/components/FeaturedProducts';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax effects for the car and rings
  const carX = useTransform(scrollY, [0, 800], [0, 500]);
  const carRotate = useTransform(scrollY, [0, 800], [0, 15]);
  const carOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  
  const ringScale = useTransform(scrollY, [0, 800], [1, 1.5]);
  const ringOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="relative overflow-hidden bg-hw-dark" ref={containerRef}>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_right_center,#1a0505_0%,#050505_70%)]" />
          <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:50px_50px] [transform:perspective(500px)_rotateX(60deg)_translateY(-100px)_translateZ(-200px)] animate-[gridMove_20s_linear_infinite]" />
        </div>

        {/* Glow Rings */}
        <motion.div 
          style={{ scale: ringScale, opacity: ringOpacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-2 border-hw-red/30 shadow-[0_0_40px_rgba(255,42,42,0.2),inset_0_0_40px_rgba(255,42,42,0.2)] [transform:translate(-50%,-50%)_rotateX(70deg)] animate-[pulseRing_4s_infinite_alternate]" 
        />
        <motion.div 
          style={{ scale: ringScale, opacity: ringOpacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-2 border-hw-blue/20 shadow-[0_0_40px_rgba(0,229,255,0.1),inset_0_0_40px_rgba(0,229,255,0.1)] [transform:translate(-50%,-50%)_rotateX(70deg)] animate-[pulseRing_5s_infinite_alternate-reverse]" 
        />

        <div className="max-w-[1400px] mx-auto px-8 w-full flex flex-col md:flex-row items-center justify-between relative z-10">
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-left"
          >
            <h1 className="font-display font-black text-6xl md:text-8xl leading-[0.9] tracking-tighter uppercase italic mb-6">
              IGNITE YOUR <br />
              <span className="gradient-text">PASSION</span>
            </h1>
            <p className="text-lg text-white/60 mb-10 max-w-lg">
              Experience the ultimate collection of premium diecast models. 
              Precision engineered, cinematic design, and exclusive drops 
              for the modern collector.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="px-8 py-4 bg-hw-gradient text-white font-display font-bold uppercase tracking-widest rounded-sm shadow-[0_4px_15px_rgba(255,42,42,0.3)] hover:scale-105 hover:shadow-[0_6px_20px_rgba(255,42,42,0.5)] transition-all flex items-center gap-2">
                Explore Vault <ArrowRight size={20} />
              </Link>
              <Link href="/drops" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-display font-bold uppercase tracking-widest rounded-sm backdrop-blur-sm hover:bg-white/10 transition-all flex items-center gap-2">
                Next Drop <ChevronRight size={20} />
              </Link>
            </div>
          </motion.div>

          {/* Hero Car */}
          <motion.div 
            style={{ x: carX, rotate: carRotate, opacity: carOpacity }}
            className="flex-1 relative h-[400px] md:h-[600px] w-full flex items-center justify-center"
          >
            <Image 
              src="/images/Hot-Wheels-Car-PNG-Photos.png" 
              alt="Elite Concept Mustang" 
              width={1000} 
              height={600} 
              className="w-[140%] max-w-[1000px] drop-shadow-[0_30px_50px_rgba(0,0,0,0.8)] object-contain"
              priority
            />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-[10px] tracking-[4px] uppercase">
          <span>Scroll</span>
          <div className="w-[24px] h-[36px] border-2 border-white/20 rounded-xl relative">
            <div className="w-[4px] h-[6px] bg-hw-red rounded-full absolute top-2 left-1/2 -translate-x-1/2 animate-[scrollWheel_1.5s_infinite]" />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-hw-red py-4 overflow-hidden relative flex">
        <div className="flex whitespace-nowrap animate-[marqueeScroll_30s_linear_infinite] font-display font-black text-xl tracking-widest text-black uppercase">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-8">
              Limited Edition Drops &bull; Elite Series &bull; Custom Tuners &bull; Racing Heritage &bull;
            </span>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <FeaturedProducts />
    </div>
  );
}
