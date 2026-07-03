"use client";

import { BlogPost } from '@/types/blog';
import styles from '@/app/blog/[id]/article.module.css';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function BlogArticleClient({ post }: { post: BlogPost }) {
  const { locale } = useLanguage();
  const current = post[locale] || post.en;

  return (
    <article className={styles.article}>
      <div className={styles.hero} style={{ backgroundImage: `url(${post.image})` }}>
        <div className={styles.overlay}>
          <div className={styles.heroContent}>
            <Link href="/blog" className={styles.backLink}>&larr; Back to Blog</Link>
            <h1 className={styles.title}>{current.title}</h1>
            <div className={styles.meta}>
              <span>{post.date}</span>
              <span className={styles.dot}>•</span>
              <span>By {post.author}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          {current.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        <div className={styles.footer}>
          <hr className={styles.divider} />
          <div className={styles.share}>
            <span>Share this article:</span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=https://rudrakshalanka.com/blog/${post.id}`} target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href={`https://twitter.com/intent/tweet?url=https://rudrakshalanka.com/blog/${post.id}&text=${encodeURIComponent(current.title)}`} target="_blank" rel="noopener noreferrer">X (Twitter)</a>
            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(current.title + " - https://rudrakshalanka.com/blog/" + post.id)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </div>
    </article>
  );
}
