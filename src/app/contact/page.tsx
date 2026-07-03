"use client";

import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { SiteSettings } from '@/lib/settings';

export default function Contact() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch settings', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className={styles.container} style={{ paddingTop: '100px', paddingBottom: '60px', minHeight: '80vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px', color: '#fff' }}>
        <h1 className={styles.sectionTitle} style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'left' }}>Contact Us</h1>
        
        <div style={{ background: 'rgba(20, 20, 20, 0.8)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '12px', padding: '2rem', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '2rem', color: '#ccc' }}>
            Have a question about our products or need help finding the right Rudraksha? We're here to help!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div>
              <h3 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>Email</h3>
              <p style={{ color: '#ccc' }}>{settings?.contactEmail || 'info@rudrakshalanka.com'}</p>
            </div>
            
            <div>
              <h3 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>Phone / WhatsApp</h3>
              <p style={{ color: '#ccc' }}>{settings?.contactPhone || '+94 77 123 4567'}</p>
            </div>
            
            <div>
              <h3 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>Location</h3>
              <p style={{ color: '#ccc' }}>Colombo, Sri Lanka</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
