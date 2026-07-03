"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types/product';
import styles from './CheckoutForm.module.css';
import { event } from '@/components/pixel/MetaPixel';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';

const sriLankaDistricts = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", 
  "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", 
  "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Moneragala", 
  "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", 
  "Trincomalee", "Vavuniya"
];

import { useSession } from 'next-auth/react';

export default function CheckoutForm() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const { t } = useLanguage();
  const { items: cartItems, clearCart, totalPrice: cartTotal } = useCart();
  const { data: session } = useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        event('InitiateCheckout');
        return;
      }
      
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const products: Product[] = await res.json();
          const found = products.find(p => p.id === productId);
          if (found) {
            setProduct(found);
            event('InitiateCheckout', { content_ids: [found.id], num_items: 1, value: found.price, currency: 'LKR' });
          }
        }
      } catch (error) {
        console.error('Failed to fetch product for checkout', error);
      }
    };
    
    fetchProduct();
  }, [productId]);

  const isCartCheckout = !productId && cartItems.length > 0;
  const displayPrice = isCartCheckout ? cartTotal : (product?.price || 0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    let orderProductId = productId as string;
    
    if (isCartCheckout) {
      orderProductId = cartItems.map(item => `${item.product.name} (x${item.quantity})`).join(', ');
    }

    const data = {
      productId: orderProductId,
      name: formData.get('name'),
      address: formData.get('address'),
      district: formData.get('district'),
      phone1: formData.get('phone1'),
      phone2: formData.get('phone2'),
      paymentMethod: formData.get('paymentMethod'),
      userEmail: session?.user?.email || null, // Link order to user if logged in
      agreedToTerms: formData.get('agreedToTerms') === 'on',
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        event('Purchase', { value: displayPrice, currency: 'LKR' });
        setSuccess(true);
        if (isCartCheckout) clearCart();
      }
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product && !isCartCheckout) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-gold)' }}>Please select a product to checkout.</div>;
  }

  if (success) {
    return (
      <div className={styles.success}>
        <div className={styles.checkIcon}>✓</div>
        <h2>{t.checkout.successTitle}</h2>
        <p>{t.checkout.successMsg}</p>
        <button onClick={() => window.location.href = '/'} className={styles.submitBtn} style={{ marginTop: '2rem' }}>
          {t.header.home}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h2>{t.checkout.title}</h2>
        
        <div className={styles.orderSummary}>
          <h3>{t.checkout.orderSummary}</h3>
          <div className={styles.summaryItem}>
            <span>{isCartCheckout ? `Cart (${cartItems.length} items)` : product?.name}</span>
            <span className={styles.price}>Rs. {displayPrice.toLocaleString()}</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Delivery</span>
            <span>Free</span>
          </div>
          <div className={`${styles.summaryItem} ${styles.total}`}>
            <span>Total</span>
            <span className={styles.price}>Rs. {displayPrice.toLocaleString()}</span>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">{t.checkout.fullNameRequired}</label>
            <input type="text" id="name" name="name" required placeholder={t.checkout.fullName} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">{t.checkout.addressRequired}</label>
            <textarea id="address" name="address" required rows={3} placeholder={t.checkout.address}></textarea>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="district">{t.checkout.districtRequired}</label>
            <select id="district" name="district" required>
              <option value="">{t.checkout.selectDistrict}</option>
              {sriLankaDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="phone1">Phone Number 01 *</label>
              <input type="tel" id="phone1" name="phone1" required placeholder="07XXXXXXXX" pattern="[0-9]{10}" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone2">Phone Number 02 (Optional)</label>
              <input type="tel" id="phone2" name="phone2" placeholder="07XXXXXXXX" pattern="[0-9]{10}" />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Payment Method</label>
            <div className={styles.paymentMethods}>
              <label className={`${styles.paymentOption} ${paymentMethod === 'cod' ? styles.active : ''}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="cod" 
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash on Delivery (COD)</span>
              </label>
              <label className={`${styles.paymentOption} ${paymentMethod === 'bank' ? styles.active : ''}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="bank" 
                  checked={paymentMethod === 'bank'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>QR Pay / Bank Transfer</span>
              </label>
            </div>
          </div>

          {paymentMethod === 'bank' && (
            <div className={styles.bankDetails}>
              <h4>Bank Details</h4>
              <p>Bank: <strong>Bank of Ceylon</strong></p>
              <p>Account Name: <strong>Rudraksha Lanka</strong></p>
              <p>Account No: <strong>12345678</strong></p>
              <p>Branch: <strong>Colombo</strong></p>
              <p className={styles.note}>Please transfer the amount and send the receipt to our WhatsApp.</p>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <input type="checkbox" id="agreedToTerms" name="agreedToTerms" required style={{ marginTop: '4px', transform: 'scale(1.2)' }} />
            <label htmlFor="agreedToTerms" style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: '1.5' }}>
              I have read and agree to the <a href="/terms" target="_blank" style={{ color: 'var(--color-gold)', textDecoration: 'underline' }}>Return & Exchange Policy</a>.
            </label>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Confirm Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
