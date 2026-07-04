"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './FloatingCart.module.css';

export default function FloatingCart() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  if (totalItems === 0) return null;

  return (
    <>
      <button 
        className={styles.cartButton} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Cart"
      >
        <span className={styles.badge}>{totalItems}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      </button>

      {isOpen && (
        <div className={styles.cartDropdown}>
          <div className={styles.cartHeader}>
            <h3>Your Cart</h3>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className={styles.cartItems}>
            {items.map(item => {
              const displayImg = item.product.images && item.product.images.length > 0 ? item.product.images[0] : item.product.image;
              return (
                <div key={item.id} className={styles.cartItem}>
                  <img src={displayImg} alt={item.product.name} className={styles.itemImage} />
                  <div className={styles.itemDetails}>
                    <h4 className={styles.itemName}>
                      {item.product.name}
                      {item.variation && <span className={styles.itemVariation}> ({item.variation})</span>}
                    </h4>
                    <div className={styles.qtyRow}>
                      <p className={styles.itemPrice}>Rs. {item.product.price.toLocaleString()}</p>
                      <div className={styles.quantityControls}>
                        <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span className={styles.qty}>{item.quantity}</span>
                        <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                  </div>
                  <button 
                    className={styles.removeBtn} 
                    onClick={() => removeFromCart(item.id)}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
          
          <div className={styles.cartFooter}>
            <div className={styles.total}>
              <span>Total:</span>
              <span>Rs. {totalPrice.toLocaleString()}</span>
            </div>
            <div className={styles.footerActions}>
              <button className={styles.clearBtn} onClick={clearCart}>Clear</button>
              <Link href="/checkout" className={styles.checkoutBtn} onClick={() => setIsOpen(false)}>
                Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
