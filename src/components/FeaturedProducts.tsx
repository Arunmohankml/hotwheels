"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(4);

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchFeatured();
  }, []);

  if (loading) return (
    <div className="py-20 text-center text-white/20 font-display animate-pulse uppercase tracking-[10px]">
      Loading Vault...
    </div>
  );

  return (
    <section className="py-20 bg-hw-dark">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="font-display font-black text-4xl md:text-5xl uppercase italic tracking-tighter mb-4">
              Featured <span className="text-hw-red">Drops</span>
            </h2>
            <p className="text-white/50 max-w-md">
              Hand-picked models for the ultimate collection. Limited availability.
            </p>
          </div>
          <motion.button 
            whileHover={{ x: 10 }}
            className="text-hw-red font-bold uppercase tracking-widest text-sm flex items-center gap-2 group"
          >
            View Full Collection <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
