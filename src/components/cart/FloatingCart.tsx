"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './FloatingCart.module.css';

export default function FloatingCart() {
  const { items, totalItems, totalPrice, removeFromCart } = useCart();
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
                <div key={item.product.id} className={styles.cartItem}>
                  <img src={displayImg} alt={item.product.name} className={styles.itemImage} />
                <div className={styles.itemDetails}>
                  <h4>{item.product.name}</h4>
                  <p>Rs. {item.product.price.toLocaleString()} x {item.quantity}</p>
                </div>
                <button 
                  className={styles.removeBtn} 
                  onClick={() => removeFromCart(item.product.id)}
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
            <Link href="/checkout" className={styles.checkoutBtn} onClick={() => setIsOpen(false)}>
              Checkout
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
