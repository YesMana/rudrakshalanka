"use client";

import styles from '../page.module.css';

export default function About() {
  return (
    <div className={styles.container} style={{ paddingTop: '100px', paddingBottom: '60px', minHeight: '80vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px', color: '#fff' }}>
        <h1 className={styles.sectionTitle} style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'left' }}>About Us</h1>
        
        <div style={{ background: 'rgba(20, 20, 20, 0.8)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '12px', padding: '2rem', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '1.5rem', color: '#ccc' }}>
            Welcome to <strong>Rudraksha Lanka</strong>, your premier destination for authentic, high-quality Rudraksha beads in Sri Lanka. 
          </p>
          <p style={{ marginBottom: '1.5rem', color: '#ccc' }}>
            We believe in the spiritual and healing power of genuine Rudraksha. Our mission is to provide you with carefully sourced, blessed, and certified beads that bring peace, prosperity, and well-being into your life.
          </p>
          <p style={{ color: '#ccc' }}>
            Every bead we offer is tested for authenticity and comes with our promise of quality. Whether you are looking for a specific Mukhi or a customized mala, we are here to guide you on your spiritual journey.
          </p>
        </div>
      </div>
    </div>
  );
}
