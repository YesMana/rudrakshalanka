import { Suspense } from 'react';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import styles from './checkout.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | Rudraksha Lanka',
};

export default function CheckoutPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Complete Your Order</h1>
      <Suspense fallback={
        <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa' }}>
          Loading checkout form...
        </div>
      }>
        <CheckoutForm />
      </Suspense>
    </div>
  );
}
