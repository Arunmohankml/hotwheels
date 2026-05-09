"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Check, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const ShopPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const ITEMS_PER_PAGE = 12;

  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search, category, sortBy]);

  async function fetchProducts() {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });

      // Apply Search
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      // Apply Category
      if (category !== 'All') {
        query = query.eq('category', category);
      }

      // Apply Sorting
      switch (sortBy) {
        case 'price-low': query = query.order('price', { ascending: true }); break;
        case 'price-high': query = query.order('price', { ascending: false }); break;
        case 'newest': query = query.order('created_at', { ascending: false }); break;
        case 'name-az': query = query.order('name', { ascending: true }); break;
        default: query = query.order('created_at', { ascending: false });
      }

      // Apply Pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      const { data, count, error } = await query.range(from, to);

      if (!error && data) {
        setProducts(data);
        setTotalCount(count || 0);
        setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  const SORT_OPTIONS = [
    { id: 'newest', label: 'Newest Arrivals' },
    { id: 'price-low', label: 'Value: Low-High' },
    { id: 'price-high', label: 'Value: High-Low' },
    { id: 'name-az', label: 'Alphabetical' },
  ];

  const CATEGORIES = ['All', 'Elite', 'Signature', 'Mainline'];

  const paginatedProducts = products;

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-32 px-6 md:px-12 selection:bg-black selection:text-white">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Premium Grouped Header */}
        <div className="flex justify-center mb-10 md:mb-16">
          <div className="flex items-center gap-2 p-2 bg-luxury-bg border border-luxury-border rounded-[24px] w-full max-w-2xl shadow-soft focus-within:border-black transition-all">
            {/* Search */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-muted group-focus-within:text-black transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search the collection..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-transparent py-3 pl-12 pr-4 text-[11px] font-medium tracking-wide outline-none text-black"
              />
            </div>

            {/* Divider */}
            <div className="w-[1px] h-6 bg-luxury-border" />

            {/* Filter Button */}
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-3 py-3 px-6 bg-black text-white rounded-[18px] text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-hw-red shadow-lg transition-all"
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Drawer Overlay */}
        <AnimatePresence>
          {isFilterOpen && (
            <div className="fixed inset-0 z-[200] flex justify-end">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterOpen(false)}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
              />
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-[400px] h-full bg-white border-l border-luxury-border p-10 overflow-y-auto shadow-premium"
              >
                <div className="flex justify-between items-center mb-12 border-b border-luxury-border pb-6">
                  <h3 className="font-light text-2xl uppercase tracking-tighter">Filter <span className="font-medium">Search</span></h3>
                  <button onClick={() => setIsFilterOpen(false)} className="p-2 border border-luxury-border rounded-full hover:bg-black hover:text-white transition-all"><X size={16} /></button>
                </div>

                <div className="space-y-12">
                  {/* Categories */}
                  <section className="space-y-6">
                    <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-muted">Categories</h4>
                    <div className="flex flex-wrap gap-3">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setCategory(cat);
                            setCurrentPage(1);
                          }}
                          className={`px-6 py-3 rounded-[16px] text-[9px] font-bold uppercase tracking-widest transition-all ${
                            category === cat ? 'bg-black text-white shadow-md' : 'bg-luxury-card border border-luxury-border text-luxury-muted hover:border-black'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Sorting */}
                  <section className="space-y-6">
                    <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-muted">Sort By</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setSortBy(opt.id);
                            setCurrentPage(1);
                          }}
                          className={`flex justify-between items-center p-5 rounded-[20px] border text-[10px] font-bold uppercase tracking-widest transition-all ${
                            sortBy === opt.id ? 'bg-luxury-card border-black text-black shadow-sm' : 'border-luxury-border text-luxury-muted hover:border-black'
                          }`}
                        >
                          {opt.label}
                          {sortBy === opt.id && <Check size={14} className="text-black" />}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="mt-16 pt-8 border-t border-luxury-border">
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full py-5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-[0.4em] shadow-lg hover:bg-hw-red transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 border border-luxury-border rounded-full flex items-center justify-center animate-pulse">
              <div className="w-2 h-2 bg-black rounded-full" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-muted">Accessing Database</p>
          </div>
        ) : paginatedProducts.length > 0 ? (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12"
            >
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-10 mt-16 md:mt-24 border-t border-luxury-border pt-10 md:pt-12">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => prev - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-12 h-12 rounded-full border border-luxury-border flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-black"
                >
                  <ArrowLeft size={16} />
                </button>
                
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black">
                  Page {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => prev + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-12 h-12 rounded-full border border-luxury-border flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-black"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-40 text-center border border-dashed border-luxury-border rounded-[48px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-muted">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;