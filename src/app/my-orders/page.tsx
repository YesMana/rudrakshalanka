"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Order } from '@/types/order';
import Link from 'next/link';

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch('/api/orders');
          if (res.ok) {
            const allOrders: Order[] = await res.json();
            // Filter orders that belong to the logged in user
            const myOrders = allOrders.filter(o => (o as any).userEmail === session.user?.email);
            setOrders(myOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          }
        } catch (error) {
          console.error("Failed to fetch my orders", error);
        }
      }
      setLoading(false);
    };

    if (session?.user?.email) {
      fetchMyOrders();
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [session, status]);

  if (status === 'loading' || loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-gold)' }}>Loading your orders...</div>;
  }

  if (!session) return null;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 style={{ color: 'var(--color-gold)', marginBottom: '2rem' }}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={{ background: 'rgba(20,20,20,0.8)', padding: '3rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #333' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>No orders found</h2>
          <p style={{ color: '#888', marginBottom: '2rem' }}>You haven't placed any orders yet.</p>
          <Link href="/shop" style={{ background: 'var(--color-gold)', color: 'black', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
            Browse Shop
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => (
            <div key={order.id} style={{ background: 'rgba(20,20,20,0.8)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ color: '#888', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>Order ID: {order.id}</p>
                <h3 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>{order.productId}</h3>
                <p style={{ color: '#aaa', margin: 0 }}>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ 
                  display: 'inline-block', 
                  padding: '0.4rem 0.8rem', 
                  borderRadius: '20px', 
                  fontSize: '0.9rem', 
                  fontWeight: 'bold',
                  background: order.status === 'Pending' ? 'rgba(245, 205, 121, 0.2)' : 
                              order.status === 'Verified' ? 'rgba(52, 152, 219, 0.2)' :
                              order.status === 'Shipped' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)',
                  color: order.status === 'Pending' ? '#f5cd79' : 
                         order.status === 'Verified' ? '#3498db' :
                         order.status === 'Shipped' ? '#2ecc71' : '#e74c3c'
                }}>
                  {order.status}
                </span>
                <p style={{ color: '#888', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>{order.paymentMethod.toUpperCase()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
