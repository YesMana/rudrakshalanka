"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import styles from './ProductManagement.module.css'; // Reusing styles

export default function SiteSettings() {
  const [settings, setSettings] = useState({
    siteTitle: '',
    siteDescription: '',
    seoKeywords: '',
    heroTitle: '',
    heroSubtitle: '',
    contactEmail: '',
    contactPhone: '',
    facebookUrl: '',
    bankName: '',
    accountName: '',
    accountNo: '',
    branch: ''
  });
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch settings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        alert('Settings updated successfully!');
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading settings...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.formSection} style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h3>Website Settings (CMS & SEO)</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="siteTitle">Site Title (SEO)</label>
            <input type="text" id="siteTitle" name="siteTitle" value={settings.siteTitle} onChange={handleChange} required />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="siteDescription">Site Description (SEO)</label>
            <textarea id="siteDescription" name="siteDescription" value={settings.siteDescription} onChange={handleChange} required rows={2}></textarea>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="seoKeywords">SEO Keywords (Comma separated)</label>
            <input type="text" id="seoKeywords" name="seoKeywords" value={settings.seoKeywords} onChange={handleChange} required />
          </div>

          <hr style={{ margin: '2rem 0', borderColor: 'rgba(255,255,255,0.1)' }} />

          <div className={styles.formGroup}>
            <label htmlFor="heroTitle">Main Page Hero Title</label>
            <input type="text" id="heroTitle" name="heroTitle" value={settings.heroTitle} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="heroSubtitle">Main Page Hero Subtitle</label>
            <textarea id="heroSubtitle" name="heroSubtitle" value={settings.heroSubtitle} onChange={handleChange} required rows={2}></textarea>
          </div>

          <hr style={{ margin: '2rem 0', borderColor: 'rgba(255,255,255,0.1)' }} />

          <div className={styles.formGroup}>
            <label htmlFor="contactEmail">Contact Email</label>
            <input type="email" id="contactEmail" name="contactEmail" value={settings.contactEmail} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contactPhone">Contact Phone (WhatsApp)</label>
            <input type="text" id="contactPhone" name="contactPhone" value={settings.contactPhone} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="facebookUrl">Facebook Page URL</label>
            <input type="text" id="facebookUrl" name="facebookUrl" value={settings.facebookUrl} onChange={handleChange} required />
          </div>

          {session?.user?.email === 'yes.manujaya@gmail.com' && (
            <>
              <hr style={{ margin: '2rem 0', borderColor: 'rgba(255,255,255,0.1)' }} />
              <h4 style={{ color: 'var(--color-gold)', marginBottom: '1rem' }}>Bank Details (Master Admin Only)</h4>
              
              <div className={styles.formGroup}>
                <label htmlFor="bankName">Bank Name</label>
                <input type="text" id="bankName" name="bankName" value={settings.bankName} onChange={handleChange} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="accountName">Account Name</label>
                <input type="text" id="accountName" name="accountName" value={settings.accountName} onChange={handleChange} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="accountNo">Account No</label>
                <input type="text" id="accountNo" name="accountNo" value={settings.accountNo} onChange={handleChange} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="branch">Branch</label>
                <input type="text" id="branch" name="branch" value={settings.branch} onChange={handleChange} />
              </div>

              <div className={styles.formGroup}>
                <label>QR Code Image</label>
                <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>
                  Please upload your QR code image via cPanel to <code style={{color: '#ccc'}}>/public/images/qr.png</code>
                </p>
              </div>
            </>
          )}
          
          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}
