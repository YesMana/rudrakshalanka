"use client";

import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { Product } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';
import { useLanguage } from '@/context/LanguageContext';

export default function Shop() {
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

  return (
    <div className={styles.container} style={{ paddingTop: '80px' }}>
      <section id="products" className={styles.productsSection}>
        <h1 className={styles.sectionTitle} style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>{t.products.sectionTitle}</h1>
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
