"use client";

import Link from 'next/link';
import styles from './ProductCard.module.css';
import { Product } from '@/types/product';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product }: { product: Product }) {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const router = useRouter();

  const displayImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
  const inStock = (product.stock ?? 10) > 0;

  return (
    <div className={styles.card}>
      <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className={styles.imagePlaceholder} style={{ position: 'relative' }}>
          {displayImage && displayImage !== '' ? (
            <img src={displayImage} alt={product.name} className={styles.image} />
          ) : (
            <span>{product.name}</span>
          )}
          {/* Stock Badge */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: inStock ? 'rgba(76, 175, 80, 0.95)' : 'rgba(244, 67, 54, 0.95)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)'
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
          {(product.hasVariations || product.requiresBirthDetails) ? (
            <button 
              className={styles.buttonSecondary}
              onClick={() => router.push(`/product/${product.id}`)}
              style={{ flex: 1 }}
            >
              Select Options
            </button>
          ) : (
            <button 
              className={styles.buttonSecondary}
              onClick={() => inStock && addToCart(product)} 
              disabled={!inStock}
              style={{ 
                flex: 1, 
                opacity: inStock ? 1 : 0.5,
                cursor: inStock ? 'pointer' : 'not-allowed'
              }}
            >
              {t.products.addToCart}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
