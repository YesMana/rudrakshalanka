"use client";

import { useState, Suspense, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import OrderDashboard from '../../components/dashboard/OrderDashboard';
import ProductManagement from '../../components/dashboard/ProductManagement';
import SiteSettings from '../../components/dashboard/SiteSettings';
import BlogManagement from '../../components/dashboard/BlogManagement';
import AdminManagement from '../../components/dashboard/AdminManagement';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'blogs' | 'settings' | 'admins'>('orders');

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && (session?.user as any)?.role !== 'admin')) {
      router.push('/auth/signin');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-gold)' }}>Loading Dashboard...</div>;
  }

  if (status === 'unauthenticated' || (session?.user as any)?.role !== 'admin') {
    return null;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--color-gold)', margin: 0 }}>Admin Dashboard</h1>
        <button 
          onClick={() => {
            window.location.href = '/api/auth/signout?callbackUrl=/';
          }}
          style={{ background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.active : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          {t.dashboard.title}
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'products' ? styles.active : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Product Management
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'blogs' ? styles.active : ''}`}
          onClick={() => setActiveTab('blogs')}
        >
          Blog Management
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Site Settings
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'admins' ? styles.active : ''}`}
          onClick={() => setActiveTab('admins')}
        >
          Manage Admins
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'orders' && (
          <Suspense fallback={<div>{t.dashboard.loading}</div>}>
            <OrderDashboard />
          </Suspense>
        )}
        {activeTab === 'products' && (
          <Suspense fallback={<div>Loading product management...</div>}>
            <ProductManagement />
          </Suspense>
        )}
        {activeTab === 'blogs' && (
          <Suspense fallback={<div>Loading blog management...</div>}>
            <BlogManagement />
          </Suspense>
        )}
        {activeTab === 'settings' && (
          <Suspense fallback={<div>Loading site settings...</div>}>
            <SiteSettings />
          </Suspense>
        )}
        {activeTab === 'admins' && (
          <Suspense fallback={<div>Loading admin management...</div>}>
            <AdminManagement />
          </Suspense>
        )}
      </div>
    </div>
  );
}
