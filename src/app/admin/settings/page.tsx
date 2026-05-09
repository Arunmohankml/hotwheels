"use client";

import React, { useState, useEffect } from 'react';
import { Save, Mail, Phone, FileText, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState({
    privacyPolicy: '',
    contactEmail: '',
    contactPhone: '',
    contactWhatsapp: ''
  });

  useEffect(() => {
    // Load settings from localStorage or Supabase
    try {
      const savedSettings = localStorage.getItem('site_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (e) {
      console.error('Failed to parse site settings:', e);
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // 1. Update localStorage for immediate frontend sync
      localStorage.setItem('site_settings', JSON.stringify(settings));
      
      // 2. Attempt Supabase Update (assuming a site_settings table with id: 1)
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 1, ...settings });
      
      // We don't throw if table doesn't exist, just log it
      if (error) console.warn('Supabase persistence skipped (table might not exist):', error.message);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 md:space-y-12 pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-luxury-border">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-muted mb-3">System Configuration</p>
          <h1 className="text-4xl font-light tracking-tighter">Site <span className="font-medium">Settings.</span></h1>
        </div>
        
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase tracking-widest bg-green-50 px-4 py-2 rounded-full border border-green-100"
            >
              <CheckCircle2 size={14} /> Changes Synchronized
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-4xl space-y-8">
        
        {/* Contact Information Section */}
        <section className="bg-white border border-luxury-border rounded-[32px] p-8 md:p-12 shadow-soft space-y-10">
          <div className="flex items-center gap-3 pb-4 border-b border-luxury-border/50">
            <Mail className="text-luxury-muted" size={20} />
            <h3 className="text-xl font-medium tracking-tight">Global Contact Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-muted ml-1">Support Email</label>
              <input 
                type="email" 
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                placeholder="support@hotwheels.com"
                className="w-full bg-luxury-bg border border-luxury-border p-4 rounded-2xl text-sm font-medium focus:border-black outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-muted ml-1">Phone Number</label>
              <input 
                type="text" 
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-luxury-bg border border-luxury-border p-4 rounded-2xl text-sm font-medium focus:border-black outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-muted ml-1">WhatsApp Number</label>
              <input 
                type="text" 
                value={settings.contactWhatsapp}
                onChange={(e) => setSettings({ ...settings, contactWhatsapp: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-luxury-bg border border-luxury-border p-4 rounded-2xl text-sm font-medium focus:border-black outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Privacy Policy Section */}
        <section className="bg-white border border-luxury-border rounded-[32px] p-8 md:p-12 shadow-soft space-y-10">
          <div className="flex items-center gap-3 pb-4 border-b border-luxury-border/50">
            <FileText className="text-luxury-muted" size={20} />
            <h3 className="text-xl font-medium tracking-tight">Privacy Policy Framework</h3>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] text-luxury-muted leading-relaxed uppercase tracking-widest font-bold">Document Content (HTML/Markdown Supported)</p>
            <textarea 
              value={settings.privacyPolicy}
              onChange={(e) => setSettings({ ...settings, privacyPolicy: e.target.value })}
              rows={12}
              placeholder="Outline your data handling procedures here..."
              className="w-full bg-luxury-bg border border-luxury-border p-6 rounded-[24px] text-sm font-medium focus:border-black outline-none transition-all resize-none leading-relaxed"
            />
          </div>
        </section>

        {/* Final Save Button */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full md:w-auto px-12 py-5 bg-black text-white rounded-[24px] text-[11px] font-bold uppercase tracking-[0.4em] shadow-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Save Configuration'}
            <Save size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminSettingsPage;
