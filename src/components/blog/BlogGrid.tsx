"use client";

import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import styles from '@/app/blog/page.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const { locale } = useLanguage();

  return (
    <div className={styles.grid}>
      {posts.map((post) => {
        const current = post[locale] || post.en;
        return (
          <Link href={`/blog/${post.id}`} key={post.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={post.image} alt={current.title} className={styles.image} />
            </div>
            <div className={styles.content}>
              <span className={styles.date}>{post.date}</span>
              <h2 className={styles.postTitle}>{current.title}</h2>
              <p className={styles.excerpt}>{current.excerpt}</p>
              <span className={styles.readMore}>Read Article &rarr;</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
