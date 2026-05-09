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
        .limit(8);

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchFeatured();
  }, []);

  if (loading) return (
    <div className="py-40 text-center opacity-20 font-display uppercase tracking-[1em] text-[10px]">
      Curating Collection
    </div>
  );

  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;

