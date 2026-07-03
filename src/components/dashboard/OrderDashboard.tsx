"use client";

import { useState, useEffect } from 'react';
import { Order } from '@/types/order';
import styles from './OrderDashboard.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function OrderDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { t } = useLanguage();

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: Order['status']) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!startDate && !endDate) return true;
    const orderDate = new Date(order.createdAt).getTime();
    const start = startDate ? new Date(startDate).getTime() : 0;
    const end = endDate ? new Date(endDate).getTime() + 86400000 : Infinity;
    return orderDate >= start && orderDate <= end;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const downloadCSV = () => {
    if (filteredOrders.length === 0) return;
    
    const headers = ['Order ID', 'Date', 'Customer Name', 'Product ID', 'Price', 'Phone 1', 'Phone 2', 'Address', 'District', 'Payment Method', 'Status'];
    const rows = filteredOrders.map(o => [
      o.id,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.name}"`,
      o.productId,
      '0', // We can add actual price logic if needed later
      o.phone1,
      o.phone2 || '',
      `"${o.address}"`,
      o.district,
      o.paymentMethod,
      o.agreedToTerms ? 'Yes' : 'No',
      o.status
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n' 
      + rows.map(e => e.join(',')).join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `orders_${startDate || 'all'}_to_${endDate || 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div style={{ color: '#aaa', padding: '2rem' }}>{t.dashboard.loading}</div>;

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2>{t.dashboard.title || 'Recent Orders'}</h2>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-off-white)', marginBottom: '0.2rem' }}>Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', background: '#333', color: 'white', border: '1px solid #555' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-off-white)', marginBottom: '0.2rem' }}>End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', background: '#333', color: 'white', border: '1px solid #555' }} />
          </div>
          <button onClick={downloadCSV} style={{ padding: '0.6rem 1rem', background: 'var(--color-gold)', color: 'black', fontWeight: 'bold', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
            Export CSV
          </button>
          <button className={styles.refreshBtn} onClick={fetchOrders} style={{ marginLeft: 'auto' }}>
            Refresh
          </button>
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <p className={styles.noOrders}>{t.dashboard.noOrders || 'No orders found for this period.'}</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t.dashboard.orderId}</th>
                <th>{t.dashboard.date}</th>
                <th>{t.dashboard.customer}</th>
                <th>{t.dashboard.contact}</th>
                <th>{t.dashboard.district}</th>
                <th>{t.dashboard.payment}</th>
                <th>Terms Agreed</th>
                <th>{t.dashboard.status}</th>
                <th>{t.dashboard.update}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontSize: '0.75rem', color: '#888' }}>{order.id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.name}</td>
                  <td>
                    {order.phone1}
                    {order.phone2 && <><br />{order.phone2}</>}
                  </td>
                  <td>{order.district}</td>
                  <td>{order.paymentMethod.toUpperCase()}</td>
                  <td style={{ textAlign: 'center', color: order.agreedToTerms ? 'var(--color-gold)' : '#888' }}>
                    {order.agreedToTerms ? '✓ Yes' : '✗ No'}
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                      {t.dashboard[order.status.toLowerCase() as keyof typeof t.dashboard]}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                      className={styles.statusSelect}
                    >
                      <option value="Pending">{t.dashboard.pending}</option>
                      <option value="Verified">{t.dashboard.verified}</option>
                      <option value="Shipped">{t.dashboard.shipped}</option>
                      <option value="Cancelled">{t.dashboard.cancelled}</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
