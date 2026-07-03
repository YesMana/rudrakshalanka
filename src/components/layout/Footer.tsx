"use client";

import { useState, useEffect } from 'react';
import styles from './Footer.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { SiteSettings } from '@/lib/settings';

export default function Footer() {
  const { t } = useLanguage();
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

  const defaultFbUrl = "https://www.facebook.com/profile.php?id=61591698745191";
  const fbUrl = settings?.facebookUrl || defaultFbUrl;
  const encodedFbUrl = encodeURIComponent(fbUrl);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h3>{t.header.logo}</h3>
          <p>{t.footer.tagline}</p>
        </div>
        <div className={styles.links}>
          <h4>{t.footer.quickLinks}</h4>
          <ul>
            <li><a href="/">{t.header.home}</a></li>
            <li><a href="/shop">{t.header.shop}</a></li>
            <li><a href="/about">{t.header.about}</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
          </ul>
        </div>
        <div className={styles.social}>
          <h4>Follow Us</h4>
          <iframe 
            src={`https://www.facebook.com/plugins/page.php?href=${encodedFbUrl}&tabs=&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`}
            width="340" 
            height="130" 
            style={{ border: 'none', overflow: 'hidden', borderRadius: '8px', marginTop: '1rem', background: 'white' }} 
            scrolling="no" 
            frameBorder="0" 
            allowFullScreen={true} 
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>
          &copy; {new Date().getFullYear()} {t.header.logo}
          <span 
            onDoubleClick={() => window.location.href = '/dashboard'}
            style={{ cursor: 'default', userSelect: 'none', opacity: 0.1, padding: '0 5px' }}
          >.</span>
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
