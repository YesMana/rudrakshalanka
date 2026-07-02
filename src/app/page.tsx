"use client";

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { Product } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Generate random particles for gold dust effect
  const [particles, setParticles] = useState<{id: number, left: string, animationDuration: string, animationDelay: string, opacity: number}[]>([]);

  useEffect(() => {
    const generatedParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 4}s`,
      animationDelay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.3
    }));
    setParticles(generatedParticles);
  }, []);

  const [settings, setSettings] = useState<any>(null);

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
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.goldDust}>
          {particles.map(p => (
            <div 
              key={p.id} 
              className={styles.particle} 
              style={{
                left: p.left,
                animationDuration: p.animationDuration,
                animationDelay: p.animationDelay,
                opacity: p.opacity
              }}
            />
          ))}
        </div>
        <div className={styles.heroContent}>
          <h1>{settings?.heroTitle || t.hero.title}</h1>
          <p>{settings?.heroSubtitle || t.hero.subtitle}</p>
          <a href="#products" className={styles.heroBtn}>{t.hero.cta}</a>
        </div>
      </section>

      <section className={styles.trustBadges}>
        <div className={styles.badge}>{t.trust.authentic}</div>
        <div className={styles.badge}>{t.trust.delivery}</div>
        <div className={styles.badge}>{t.trust.cod}</div>
      </section>

      <section id="products" className={styles.productsSection}>
        <h2 className={styles.sectionTitle}>{t.products.sectionTitle}</h2>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--color-gold)', padding: '2rem' }}>
            Loading products...
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
