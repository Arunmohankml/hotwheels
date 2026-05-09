"use client";

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, MoreVertical, Edit2, Trash2, 
  Package, ChevronLeft, ChevronRight, ChevronDown, X, 
  Check, AlertCircle, Loader2, Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (error) throw error;
      
      setProducts(data || []);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchProducts();
    } catch (error) {
      alert('Error deleting product');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('products').delete().in('id', selectedProducts);
      if (error) throw error;
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      alert('Error deleting products');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const isAllPageSelected = products.length > 0 && products.every(p => selectedProducts.includes(p.id));

  const toggleSelectAll = () => {
    if (isAllPageSelected) {
      const currentPageIds = products.map(p => p.id);
      setSelectedProducts(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      const currentPageIds = products.map(p => p.id);
      setSelectedProducts(prev => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  const [expandedProducts, setExpandedProducts] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedProducts(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6 md:space-y-10 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-muted mb-2 md:mb-3">Inventory Control</p>
          <h1 className="text-3xl md:text-4xl font-light tracking-tighter">Manage <span className="font-medium">Products.</span></h1>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-hw-red transition-all"
        >
          <Plus size={16} /> Add New Car
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-luxury-border p-4 rounded-[24px] shadow-soft">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-muted group-focus-within:text-black transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-luxury-bg border border-transparent focus:border-black py-3 pl-12 pr-6 rounded-[16px] text-xs font-medium outline-none transition-all"
          />
        </div>

        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          {selectedProducts.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
            >
              <Trash2 size={14} /> Delete ({selectedProducts.length})
            </button>
          )}
          <div className="text-[9px] font-bold uppercase tracking-widest text-luxury-muted px-4">
            Total Pages: {totalPages}
          </div>
        </div>
      </div>

      {/* Product List Container */}
      <div className="bg-white border border-luxury-border rounded-[24px] md:rounded-[32px] overflow-hidden shadow-soft">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-luxury-border bg-luxury-bg/30">
                <th className="p-6 w-10">
                  <input 
                    type="checkbox" 
                    checked={isAllPageSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-luxury-border accent-black"
                  />
                </th>
                <th className="p-6 text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-muted">Product</th>
                <th className="p-6 text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-muted">Category</th>
                <th className="p-6 text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-muted">Price</th>
                <th className="p-6 text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-muted">Inventory</th>
                <th className="p-6 text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-muted">Status</th>
                <th className="p-6 text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="p-12 text-center">
                      <div className="h-4 bg-luxury-bg rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : products.length > 0 ? products.map((product) => (
                <tr key={product.id} className="hover:bg-luxury-bg transition-colors group">
                  <td className="p-6">
                    <input 
                      type="checkbox" 
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="w-4 h-4 rounded border-luxury-border accent-black"
                    />
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 bg-luxury-bg border border-luxury-border rounded-xl overflow-hidden shrink-0">
                        <Image src={product.image_url} alt={product.name} fill className="object-contain p-2" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-black truncate max-w-[200px]">{product.name}</p>
                        <p className="text-[9px] font-medium text-luxury-muted uppercase tracking-widest">{product.series || 'Collector Edition'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-white border border-luxury-border rounded-full text-[8px] font-bold uppercase tracking-widest text-luxury-muted">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-6 text-xs font-medium">₹{product.price.toLocaleString('en-IN')}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-orange-500'}`} />
                      <span className="text-[10px] font-bold">{product.stock || 0} In Stock</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest ${
                      (product.stock || 0) > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {(product.stock || 0) > 0 ? 'Active' : 'Sold Out'}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button 
                        onClick={() => { setCurrentProduct(product); setIsEditModalOpen(true); }}
                        className="p-2 hover:bg-black hover:text-white rounded-lg transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-all text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : null}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-luxury-border">
          {!loading && products.length > 0 && (
            <div className="p-4 bg-luxury-bg/50 border-b border-luxury-border flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={isAllPageSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-luxury-border accent-black"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-muted">Select All Assets</span>
              </div>
              <span className="text-[9px] font-bold bg-white px-2 py-1 border border-luxury-border rounded-lg text-black">
                {selectedProducts.length} Selected
              </span>
            </div>
          )}
          {loading ? (
            <div className="p-20 text-center animate-pulse">
              <div className="w-12 h-12 border border-luxury-border rounded-full mx-auto" />
            </div>
          ) : products.length > 0 ? products.map((product) => {
            const isExpanded = expandedProducts.includes(product.id);
            return (
              <div key={product.id} className="p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center" onClick={() => toggleExpand(product.id)}>
                  <div className="flex items-center gap-4">
                    <div onClick={(e) => e.stopPropagation()} className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="w-4 h-4 rounded border-luxury-border accent-black"
                      />
                    </div>
                    <div className="relative w-12 h-12 bg-luxury-bg border border-luxury-border rounded-xl overflow-hidden shrink-0">
                      <Image src={product.image_url} alt={product.name} fill className="object-contain p-2" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-black truncate max-w-[150px]">{product.name}</p>
                      <p className="text-[9px] font-bold text-luxury-muted uppercase">Stock: {product.stock || 0}</p>
                    </div>
                  </div>
                  <ChevronDown size={16} className={`text-luxury-muted transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>

                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="space-y-4 pt-2 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-4 bg-luxury-bg p-4 rounded-2xl border border-luxury-border">
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-luxury-muted mb-1">Category</p>
                        <span className="px-2 py-0.5 bg-white border border-luxury-border rounded-full text-[8px] font-bold uppercase tracking-widest text-black">
                          {product.category}
                        </span>
                      </div>
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-luxury-muted mb-1">Market Price</p>
                        <p className="text-[11px] font-bold text-black">₹{product.price.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[8px] font-bold uppercase tracking-widest text-luxury-muted mb-1">Series</p>
                        <p className="text-[11px] font-medium text-black truncate">{product.series || 'Collector Edition'}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setCurrentProduct(product); setIsEditModalOpen(true); }}
                        className="flex-1 py-2.5 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <Edit2 size={12} /> Edit Details
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          }) : (
            <div className="p-12 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-muted">
              Inventory is currently empty.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-6 md:p-8 bg-luxury-bg/30 border-t border-luxury-border flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <p className="text-[9px] font-bold uppercase tracking-widest text-luxury-muted order-2 md:order-1">
            Showing {products.length} of {totalPages * ITEMS_PER_PAGE} Results
          </p>
          <div className="flex items-center gap-4 order-1 md:order-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 border border-luxury-border rounded-full hover:bg-black hover:text-white transition-all disabled:opacity-20"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[10px] font-bold">Page {currentPage} / {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 border border-luxury-border rounded-full hover:bg-black hover:text-white transition-all disabled:opacity-20"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Modal (Add/Edit) */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <ProductModal 
            product={isEditModalOpen ? currentProduct : null}
            onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); setCurrentProduct(null); }}
            onRefresh={fetchProducts}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

const ProductModal = ({ product, onClose, onRefresh }: { product: any, onClose: () => void, onRefresh: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    image_url: product?.image_url || '',
    category: product?.category || 'Mainline',
    series: product?.series || '',
    stock: product?.stock || 0,
    description: product?.description || ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { data, error } = await supabase.storage
        .from('hotwheels')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('hotwheels')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error: any) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (product) {
        const { error } = await supabase.from('products').update(formData).eq('id', product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([formData]);
        if (error) throw error;
      }
      onRefresh();
      onClose();
    } catch (error) {
      alert('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center sm:p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="relative w-full h-full sm:h-auto sm:max-w-4xl bg-white sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="px-6 py-5 md:p-8 border-b border-black/10 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">HW</span>
             </div>
             <h2 className="text-lg md:text-xl font-bold tracking-tight text-black">{product ? 'Edit Asset' : 'New Registry Entry'}</h2>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-black hover:text-white rounded-full transition-all text-black border border-black/5"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Left: Image Upload (Compact) */}
              <div className="md:col-span-4 space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black">Product Image</label>
                <div 
                  className="relative aspect-square w-full bg-white border-2 border-dashed border-black/20 rounded-2xl overflow-hidden flex items-center justify-center group cursor-pointer hover:border-black transition-colors" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formData.image_url ? (
                    <>
                      <Image src={formData.image_url} alt="Preview" fill className="object-contain p-2" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-bold uppercase tracking-[0.2em]">
                        Change
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      {uploading ? <Loader2 size={24} className="mx-auto animate-spin text-black" /> : <ImageIcon size={24} className="mx-auto text-black/40" />}
                      <p className="mt-2 text-[9px] font-bold uppercase text-black/40">Upload</p>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>
                <input 
                  className="w-full bg-white border border-black/20 focus:border-black py-2 px-4 rounded-xl text-xs font-medium outline-none transition-all text-black placeholder:text-black/20"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="Paste Image URL..."
                />
              </div>

              {/* Right: Form Details (Grid) */}
              <div className="md:col-span-8 grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black">Name</label>
                  <input 
                    required
                    className="w-full bg-white border border-black/20 focus:border-black py-3 px-4 rounded-xl text-sm font-medium outline-none transition-all text-black"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black">Price (₹)</label>
                  <input 
                    required
                    type="number"
                    className="w-full bg-white border border-black/20 focus:border-black py-3 px-4 rounded-xl text-sm font-medium outline-none transition-all text-black"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black">Category</label>
                  <select 
                    className="w-full bg-white border border-black/20 focus:border-black py-3 px-4 rounded-xl text-sm font-medium outline-none transition-all text-black appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Mainline">Mainline</option>
                    <option value="Elite">Elite</option>
                    <option value="Signature">Signature</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black">Inventory</label>
                  <input 
                    required
                    type="number"
                    className="w-full bg-white border border-black/20 focus:border-black py-3 px-4 rounded-xl text-sm font-medium outline-none transition-all text-black"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black">Series</label>
                  <input 
                    className="w-full bg-white border border-black/20 focus:border-black py-3 px-4 rounded-xl text-sm font-medium outline-none transition-all text-black"
                    value={formData.series}
                    onChange={(e) => setFormData({...formData, series: e.target.value})}
                    placeholder="Collector Series"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black">Description</label>
                  <textarea 
                    className="w-full bg-white border border-black/20 focus:border-black py-3 px-4 rounded-xl text-sm font-medium outline-none transition-all h-20 resize-none text-black"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="p-6 md:p-8 border-t border-black/10 flex justify-end gap-3 bg-white">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-black/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-black transition-all text-black hidden sm:block"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading || uploading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-4 sm:py-3 bg-black text-white rounded-full text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-hw-red transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={16} />}
              {product ? 'Synchronize Data' : 'Commit to Registry'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminProducts;
