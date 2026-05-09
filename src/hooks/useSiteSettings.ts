"use client";

import { useState, useEffect } from 'react';

export const useSiteSettings = () => {
  const [settings, setSettings] = useState({
    privacyPolicy: '',
    contactEmail: 'support@hotwheels.com',
    contactPhone: '+1 (555) 000-0000',
    contactWhatsapp: '+1 (555) 000-0000'
  });

  useEffect(() => {
    const saved = localStorage.getItem('site_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing site settings');
      }
    }
  }, []);

  return settings;
};
