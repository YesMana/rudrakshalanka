"use client";

import Link from 'next/link';
import styles from './ProductCard.module.css';
import { Product } from '@/types/product';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }: { product: Product }) {
  const { t } = useLanguage();
  const { addToCart } = useCart();

  const displayImage = product.images && product.images.length > 0 ? product.images[0] : product.image;

  return (
    <div className={styles.card}>
      <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className={styles.imagePlaceholder}>
          {displayImage && displayImage !== '' ? (
            <img src={displayImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span>{product.name}</span>
          )}
        </div>
      </Link>
      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.price}>{t.products.price} {product.price.toLocaleString()}</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <Link href={`/product/${product.id}`} className={styles.button} style={{ flex: 1, textAlign: 'center' }}>
            {t.products.viewDetails}
          </Link>
          <button 
            onClick={() => addToCart(product)} 
            className={styles.button}
            style={{ flex: 1, background: 'transparent', border: '1px solid var(--color-gold)', color: 'var(--color-gold)' }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
