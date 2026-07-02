"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage, Locale } from '@/context/LanguageContext';
import { useSession, signOut } from 'next-auth/react';
import styles from './Header.module.css';

const langLabels: Record<Locale, string> = {
  en: 'EN',
  si: 'සිං',
  ta: 'தமி',
};

export default function Header() {
  const { t, locale, setLocale } = useLanguage();
  const { data: session } = useSession();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoImage}>
            <Image src="/images/logo.png" alt="Rudraksha Lanka" width={40} height={40} />
          </div>
          <span className={styles.logoText}>{t.header.logo}</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/">{t.header.home}</Link>
          <Link href="/shop">{t.header.shop}</Link>
          <Link href="/about">{t.header.about}</Link>
          <Link href="/contact">{t.header.contact}</Link>
        </nav>

        <div className={styles.actions}>
          {session ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link href={(session.user as any)?.role === 'admin' ? '/dashboard' : '/my-orders'} style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>
                {(session.user as any)?.role === 'admin' ? 'Dashboard' : 'My Orders'}
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                style={{ background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/auth/signin" style={{ color: 'var(--color-gold)', fontWeight: 'bold', border: '1px solid var(--color-gold)', padding: '0.25rem 0.75rem', borderRadius: '4px' }}>
              Login
            </Link>
          )}

          <div className={styles.languageToggle}>
            {(Object.keys(langLabels) as Locale[]).map((l) => (
              <button
                key={l}
                className={locale === l ? styles.activeLang : ''}
                onClick={() => setLocale(l)}
              >
                {langLabels[l]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
