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
  const inStock = (product.stock ?? 10) > 0;

  return (
    <div className={styles.card}>
      <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className={styles.imagePlaceholder} style={{ position: 'relative' }}>
          {displayImage && displayImage !== '' ? (
            <img src={displayImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span>{product.name}</span>
          )}
          {/* Stock Badge */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: inStock ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </div>
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
            onClick={() => inStock && addToCart(product)} 
            className={styles.button}
            disabled={!inStock}
            style={{ 
              flex: 1, 
              background: 'transparent', 
              border: '1px solid var(--color-gold)', 
              color: 'var(--color-gold)',
              opacity: inStock ? 1 : 0.5,
              cursor: inStock ? 'pointer' : 'not-allowed'
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
