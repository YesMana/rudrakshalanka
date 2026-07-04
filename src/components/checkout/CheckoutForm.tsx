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
  const [wantsEmailUpdate, setWantsEmailUpdate] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) setSettings(await res.json());
      } catch (error) {
        console.error('Failed to fetch settings', error);
      }
    };
    fetchSettings();
  }, []);

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
  const subtotal = isCartCheckout ? cartTotal : (product?.price || 0);
  const deliveryCharge = 350;
  const total = subtotal + deliveryCharge;
  const needsAdvance = subtotal > 5000;
  const advanceAmount = 500;

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
      customerEmail: formData.get('customerEmail'),
      wantsEmailUpdate: wantsEmailUpdate,
      agreedToTerms: formData.get('agreedToTerms') === 'on',
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        event('Purchase', { value: total, currency: 'LKR' });
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
            <span className={styles.price}>Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Delivery Charge</span>
            <span>Rs. {deliveryCharge}</span>
          </div>
          <div className={`${styles.summaryItem} ${styles.total}`}>
            <span>Total</span>
            <span className={styles.price}>Rs. {total.toLocaleString()}</span>
          </div>
          {needsAdvance && (
            <div className={styles.summaryItem} style={{ color: '#e65100', marginTop: '0.5rem', borderTop: 'none', paddingTop: 0 }}>
              <span>Advance Required</span>
              <span>Rs. {advanceAmount.toLocaleString()}</span>
            </div>
          )}
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

          {needsAdvance && (
            <div style={{ background: 'rgba(230, 81, 0, 0.1)', border: '1px solid #e65100', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#e65100', margin: '0 0 0.5rem 0' }}>Advance Payment Required</h4>
              <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
                Since your order subtotal is over Rs. 5,000, a minimum advance payment of <strong>Rs. 500</strong> is required to confirm your order. 
                Please transfer the amount via Bank Transfer or QR Pay and send the receipt to our WhatsApp. 
                The remaining balance of <strong>Rs. {(total - advanceAmount).toLocaleString()}</strong> can be paid on delivery.
              </p>
              <div style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', fontSize: '0.9rem', color: '#ddd' }}>
                <strong style={{ color: '#e0b04c' }}>Contact Us (WhatsApp / Call):</strong> {settings?.contactPhone || '076 220 9299'}<br/>
                <strong style={{ color: '#e0b04c' }}>Address:</strong> No.194/4, Kurunegala Road, Puttalam
              </div>
            </div>
          )}

          {(paymentMethod === 'bank' || needsAdvance) && (
            <div className={styles.bankDetails}>
              <h4>Bank & QR Details</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '1rem' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <p>Bank: <strong>{settings?.bankName || 'Bank of Ceylon'}</strong></p>
                  <p>Account Name: <strong>{settings?.accountName || 'Rudraksha Lanka'}</strong></p>
                  <p>Account No: <strong>{settings?.accountNo || '12345678'}</strong></p>
                  <p>Branch: <strong>{settings?.branch || 'Colombo'}</strong></p>
                  <p className={styles.note} style={{ marginTop: '1rem' }}>Please transfer {needsAdvance ? `Rs. 500 (or full amount)` : `the full amount`} and send the receipt to our WhatsApp.</p>
                </div>
                <div style={{ flex: 1, minWidth: '200px', textAlign: 'center' }}>
                  <img 
                    src="/images/qr.png" 
                    alt="LankaQR Payment" 
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #333' }} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Scan to pay via LankaQR</p>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <input 
              type="checkbox" 
              id="wantsEmailUpdate" 
              checked={wantsEmailUpdate}
              onChange={(e) => setWantsEmailUpdate(e.target.checked)}
              style={{ marginTop: '4px', transform: 'scale(1.2)' }} 
            />
            <label htmlFor="wantsEmailUpdate" style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: '1.5' }}>
              Send me order updates via email (Optional)
            </label>
          </div>

          {wantsEmailUpdate && (
            <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
              <label htmlFor="customerEmail">Email Address *</label>
              <input type="email" id="customerEmail" name="customerEmail" required placeholder="your.email@example.com" />
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
