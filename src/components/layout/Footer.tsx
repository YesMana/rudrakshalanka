"use client";

import styles from './Footer.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
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
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61591698745191&tabs=&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId" 
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
