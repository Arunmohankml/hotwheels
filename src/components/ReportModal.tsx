"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, AlertCircle, CheckCircle, Camera, Video, Send, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  userEmail?: string;
  userName?: string;
  userId?: string;
}

const CATEGORIES = [
  'Item Integrity Issue',
  'Incorrect Model Received',
  'Incomplete Acquisition',
  'Delivery Delay / Not Received',
  'Acquisition Return Request',
  'Payment Reconciliation',
  'Logistical Tracking Error',
  'Packaging Preservation Issue',
  'General Inquiry'
];

const ReportModal: React.FC<ReportModalProps> = ({ 
  isOpen, 
  onClose, 
  orderId, 
  userEmail, 
  userName, 
  userId 
}) => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(file => {
        const isSizeValid = file.size <= 5 * 1024 * 1024; // 5MB limit
        const isTypeValid = file.type.startsWith('image/') || file.type.startsWith('video/');
        return isSizeValid && isTypeValid;
      });

      if (validFiles.length < selectedFiles.length) {
        setError('Maximum file size is 5MB. Images and videos only.');
      } else {
        setError('');
      }

      setFiles(prev => [...prev, ...validFiles].slice(0, 3)); // Max 3 files
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !description) {
      setError('Please provide both a category and detailed documentation.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const media_urls: string[] = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `reports/${userId || 'guest'}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('reports')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('reports')
          .getPublicUrl(filePath);
        
        media_urls.push(publicUrl);
      }

      const { error: dbError } = await supabase.from('reports').insert([{
        order_id: orderId || null,
        user_id: userId || 'guest',
        full_name: userName || 'Anonymous',
        email: userEmail || '',
        category,
        description,
        media_urls,
        status: 'pending'
      }]);

      if (dbError) throw dbError;

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please contact support.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setCategory('');
    setDescription('');
    setFiles([]);
    setSubmitted(false);
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 selection:bg-black selection:text-white">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/60 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="relative w-full max-w-xl bg-white border border-luxury-border rounded-[48px] p-10 md:p-12 overflow-hidden shadow-premium"
          >
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-3xl font-light tracking-tight mb-1">Support <span className="font-medium">Concierge</span></h3>
                <p className="text-luxury-muted text-[10px] font-bold uppercase tracking-[0.3em]">Logistical Inquiry Manifest</p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-full hover:bg-luxury-card transition-all"
              >
                <X size={20} className="text-luxury-muted" />
              </button>
            </div>

            {submitted ? (
              <div className="py-20 text-center space-y-8">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={40} className="text-green-600" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-light tracking-tight">Inquiry Received</h4>
                  <p className="text-luxury-muted text-xs px-8 leading-relaxed">Your documentation has been safely stored. A concierge representative will review your request within 24 business hours.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {orderId && (
                  <div className="p-4 bg-luxury-card border border-luxury-border rounded-2xl flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-muted">Target Acquisition</span>
                    <span className="text-[10px] font-bold text-black uppercase tracking-tight">#{orderId.slice(-12).toUpperCase()}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-muted ml-1">Inquiry Category</label>
                  <div className="relative">
                    <select 
                      required
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-white border border-luxury-border p-5 rounded-2xl outline-none focus:border-black transition-all text-xs font-medium appearance-none cursor-pointer"
                    >
                      <option value="">Select category...</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                      <Send size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-muted ml-1">Incident Documentation</label>
                  <textarea 
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Provide a detailed log of your inquiry..."
                    className="w-full bg-white border border-luxury-border p-6 rounded-2xl outline-none focus:border-black h-32 transition-all text-xs leading-relaxed resize-none font-medium"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-muted ml-1">Visual Evidence (Maximum 3)</label>
                  <div className="flex gap-4">
                    {files.map((file, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-2xl bg-luxury-card border border-luxury-border flex items-center justify-center group overflow-hidden">
                        {file.type.startsWith('image/') ? <Camera size={20} className="text-luxury-muted" /> : <Video size={20} className="text-luxury-muted" />}
                        <button 
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="absolute inset-0 bg-black/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {files.length < 3 && (
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 rounded-2xl border-2 border-dashed border-luxury-border flex flex-col items-center justify-center text-luxury-muted hover:border-black hover:text-black transition-all gap-2"
                      >
                        <Upload size={20} />
                        <span className="text-[8px] font-bold uppercase tracking-widest">Upload</span>
                      </button>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-bold uppercase tracking-tight">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={uploading}
                  className="w-full py-6 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full shadow-lg hover:bg-hw-red disabled:opacity-50 transition-all flex items-center justify-center gap-4"
                >
                  {uploading ? 'Transmitting Documentation...' : 'Submit Inquiry'}
                  <Send size={14} className={uploading ? 'animate-pulse' : ''} />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReportModal;
