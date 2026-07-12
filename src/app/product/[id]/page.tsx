"use client";

import { notFound } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import styles from './product.module.css';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';
import { useSession } from 'next-auth/react';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<string>('');
  const [birthDob, setBirthDob] = useState<string>('');
  const [birthZodiac, setBirthZodiac] = useState<string>('');

  // ... (fetch logic remains same)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res, settingsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/settings')
        ]);
        
        if (settingsRes.ok) {
          setSettings(await settingsRes.json());
        }

        if (res.ok) {
          const products: Product[] = await res.json();
          const found = products.find((p) => p.id === id);
          if (found) {
            setProduct(found);
            if (found.hasVariations && found.variations && found.variations.length > 0) {
              setSelectedVariation(found.variations[0]);
            }
          } else {
            notFound();
          }
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-gold)' }}>Loading product...</div>;
  }

  if (!product) return null;

  const rawNumber = settings?.contactPhone || '94770000000';
  const whatsappNumber = rawNumber.replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(`Hello, I'm interested in buying the ${product.name} for Rs. ${product.price}.`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const displayImages = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

  return (
    <div className={styles.container}>
      <div className={styles.productWrapper}>
        <div className={styles.imageSection}>
          <div className={styles.imagePlaceholder} style={{ marginBottom: displayImages.length > 1 ? '1rem' : '0', background: 'rgba(0,0,0,0.2)' }}>
            {displayImages.length > 0 && displayImages[currentImageIndex] !== '' ? (
              <img 
                src={displayImages[currentImageIndex]} 
                alt={product.name} 
                onClick={() => setIsFullscreen(true)}
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px', cursor: 'pointer' }} 
              />
            ) : (
              <span>{product.name}</span>
            )}
          </div>
          
          {/* Thumbnails Gallery */}
          {displayImages.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.5rem 0' }}>
              {displayImages.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setCurrentImageIndex(idx)}
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    border: currentImageIndex === idx ? '2px solid var(--color-gold)' : '2px solid transparent',
                    opacity: currentImageIndex === idx ? 1 : 0.6,
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.detailsSection}>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.price}>{t.products.price} {product.price.toLocaleString()}</p>
          <p style={{ color: (product.stock ?? 10) > 0 ? ((product.stock ?? 10) <= 5 ? '#ff9800' : '#4CAF50') : '#f44336', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
            {(product.stock ?? 10) > 0 
              ? (session?.user || product.showExactStock ? `In Stock (${product.stock ?? 10} available)` 
                 : (product.stock ?? 10) <= 5 ? 'Only a few items left in stock!' : 'In Stock')
              : 'Out of Stock'}
          </p>

          <div className={styles.description}>
            <p style={{ whiteSpace: 'pre-wrap' }}>{product.description}</p>
          </div>

          {product.hasVariations && product.variations && product.variations.length > 0 && (
            <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Select Option:</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.variations.map((variation, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariation(variation)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      border: selectedVariation === variation ? '2px solid var(--color-gold)' : '1px solid #444',
                      background: selectedVariation === variation ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                      color: selectedVariation === variation ? 'var(--color-gold)' : '#fff',
                      cursor: 'pointer',
                      fontWeight: selectedVariation === variation ? 'bold' : 'normal',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {variation}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.requiresBirthDetails && (
            <div className={styles.personalDetailsBox}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-gold)' }}>Personal Details Required</h3>
              <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#ccc' }}>Please provide the following details for astrology/customization purposes.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Date of Birth *</label>
                  <input 
                    type="date" 
                    required 
                    value={birthDob}
                    onChange={(e) => setBirthDob(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Zodiac Sign (Lagnaya) *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Leo / Singha"
                    value={birthZodiac}
                    onChange={(e) => setBirthZodiac(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
              </div>
            </div>
          )}

          <div className={styles.benefits}>
            <h3>{t.productPage.benefits}:</h3>
            <ul>
              {product.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div className={styles.actions} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {(product.stock ?? 10) > 0 ? (
              <button 
                onClick={() => {
                  if (product.hasVariations && !selectedVariation) {
                    alert('Please select an option first.');
                    return;
                  }
                  if (product.requiresBirthDetails && (!birthDob || !birthZodiac)) {
                    alert('Please enter your Date of Birth and Zodiac Sign (Lagnaya) before proceeding.');
                    return;
                  }
                  addToCart(product, 1, selectedVariation || undefined, product.requiresBirthDetails ? { dob: birthDob, zodiac: birthZodiac } : undefined);
                  window.location.href = '/checkout';
                }}
                className={styles.buyNowBtn} 
                style={{ margin: 0, border: 'none', cursor: 'pointer' }}
              >
                {t.productPage.buyNow}
              </button>
            ) : (
              <button disabled className={styles.buyNowBtn} style={{ margin: 0, opacity: 0.5, cursor: 'not-allowed', border: 'none' }}>
                Out of Stock
              </button>
            )}
            <button 
              onClick={() => {
                if ((product.stock ?? 10) > 0) {
                  if (product.hasVariations && !selectedVariation) {
                    alert('Please select an option first.');
                    return;
                  }
                  if (product.requiresBirthDetails && (!birthDob || !birthZodiac)) {
                    alert('Please enter your Date of Birth and Zodiac Sign (Lagnaya) before proceeding.');
                    return;
                  }
                  addToCart(product, 1, selectedVariation || undefined, product.requiresBirthDetails ? { dob: birthDob, zodiac: birthZodiac } : undefined);
                  alert(`${product.name}${selectedVariation ? ` (${selectedVariation})` : ''} added to cart!`);
                  setBirthDob('');
                  setBirthZodiac('');
                }
              }}
              disabled={(product.stock ?? 10) <= 0}
              className={styles.whatsappBtn} 
              style={{ margin: 0, background: 'transparent', border: '2px solid var(--color-gold)', color: 'var(--color-gold)', opacity: (product.stock ?? 10) > 0 ? 1 : 0.5, cursor: (product.stock ?? 10) > 0 ? 'pointer' : 'not-allowed' }}
            >
              Add to Cart
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
              style={{ gridColumn: '1 / -1', margin: 0 }}
            >
              {t.productPage.whatsapp}
            </a>
          </div>
        </div>
      </div>

      {isFullscreen && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          onClick={() => setIsFullscreen(false)}
        >
          <img 
            src={displayImages[currentImageIndex]} 
            alt={product.name} 
            style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} 
          />
          <button 
            onClick={() => setIsFullscreen(false)}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', color: 'white', border: 'none', fontSize: '2rem', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      )}

      {/* Reviews Section */}
      <div style={{ marginTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
        <h2 style={{ color: 'var(--color-gold)', marginBottom: '1.5rem' }}>Customer Reviews</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {/* Add Review Form */}
          <div style={{ background: 'rgba(30,30,30,0.5)', padding: '2rem', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Write a Review</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                name: formData.get('name'),
                rating: parseInt(formData.get('rating') as string),
                comment: formData.get('comment')
              };
              
              try {
                const res = await fetch(`/api/products/${product.id}/reviews`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data)
                });
                if (res.ok) {
                  const updated = await res.json();
                  setProduct(updated.product);
                  (e.target as HTMLFormElement).reset();
                  alert('Review submitted successfully!');
                }
              } catch (err) {
                console.error(err);
                alert('Failed to submit review');
              }
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Your Name</label>
                <input name="name" type="text" required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Rating</label>
                <select name="rating" required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }}>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Your Review</label>
                <textarea name="comment" required rows={4} style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }}></textarea>
              </div>
              <button type="submit" style={{ background: 'var(--color-gold)', color: '#000', padding: '0.8rem', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>
                Submit Review
              </button>
            </form>
          </div>

          {/* Display Reviews */}
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Reviews ({product.reviews?.length || 0})</h3>
            {(!product.reviews || product.reviews.length === 0) ? (
              <p style={{ color: '#888' }}>No reviews yet. Be the first to review this product!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {product.reviews.map(review => (
                  <div key={review.id} style={{ background: 'rgba(20,20,20,0.5)', padding: '1.5rem', borderRadius: '8px', borderLeft: '3px solid var(--color-gold)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '1.1rem' }}>{review.name}</strong>
                      <span style={{ color: 'var(--color-gold)' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    </div>
                    <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>{review.comment}</p>
                    <small style={{ color: '#666' }}>{new Date(review.createdAt).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
