"use client";

import { useState, useEffect } from 'react';
import styles from './BlogManagement.module.css'; // Reuse some existing styles

export default function AdminManagement() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminType, setAdminType] = useState<'google' | 'credentials'>('google');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admins');
      const data = await res.json();
      setAdmins(data);
    } catch (error) {
      console.error('Failed to fetch admins', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = adminType === 'google' 
      ? { type: 'google', email } 
      : { type: 'credentials', username, password };

    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setEmail('');
        setUsername('');
        setPassword('');
        fetchAdmins();
      } else {
        alert('Failed to add admin');
      }
    } catch (error) {
      alert('Error adding admin');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this admin?')) {
      try {
        await fetch(`/api/admins?id=${id}`, { method: 'DELETE' });
        fetchAdmins();
      } catch (error) {
        alert('Failed to delete admin');
      }
    }
  };

  if (loading) return <div>Loading admins...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Manage Admins</h2>
      </div>
      
      <div style={{ background: '#1a1a1a', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--color-gold)', marginBottom: '1rem' }}>Add New Admin</h3>
        
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
          <label style={{ color: '#fff', cursor: 'pointer' }}>
            <input 
              type="radio" 
              checked={adminType === 'google'} 
              onChange={() => setAdminType('google')} 
              style={{ marginRight: '8px' }}
            />
            Google Email Login
          </label>
          <label style={{ color: '#fff', cursor: 'pointer' }}>
            <input 
              type="radio" 
              checked={adminType === 'credentials'} 
              onChange={() => setAdminType('credentials')} 
              style={{ marginRight: '8px' }}
            />
            Username & Password Login
          </label>
        </div>

        <form onSubmit={handleAddAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
          {adminType === 'google' ? (
            <div className={styles.formGroup}>
              <label>Google Email Address:</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className={styles.input}
                placeholder="admin@gmail.com"
              />
            </div>
          ) : (
            <>
              <div className={styles.formGroup}>
                <label>Username:</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  required 
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Password:</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className={styles.input}
                />
              </div>
            </>
          )}
          
          <button type="submit" disabled={saving} className={styles.btnPrimary} style={{ alignSelf: 'flex-start' }}>
            {saving ? 'Adding...' : 'Add Admin'}
          </button>
        </form>
      </div>

      <div style={{ background: '#1a1a1a', padding: '2rem', borderRadius: '8px' }}>
        <h3 style={{ color: 'var(--color-gold)', marginBottom: '1rem' }}>Current Admins</h3>
        <p style={{ color: '#888', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Note: The Master Admin (from environment variables) is not listed here but always has access.
        </p>
        
        {admins.length === 0 ? (
          <p style={{ color: '#fff' }}>No custom admins added yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                <th style={{ padding: '1rem 0' }}>Type</th>
                <th style={{ padding: '1rem 0' }}>Details</th>
                <th style={{ padding: '1rem 0', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '1rem 0', textTransform: 'capitalize' }}>{admin.type}</td>
                  <td style={{ padding: '1rem 0' }}>
                    {admin.type === 'google' ? admin.email : `Username: ${admin.username}`}
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDelete(admin.id)}
                      className={styles.btnDanger}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
