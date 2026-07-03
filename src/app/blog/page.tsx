import Link from 'next/link';
import { blogPosts } from '@/lib/blogData';
import styles from './page.module.css';

export const metadata = {
  title: 'Blog - Rudraksha Lanka',
  description: 'Read our latest articles on spirituality, healing, and Rudraksha beads.',
};

export default function BlogIndex() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Spiritual Insights & Guides</h1>
        <p className={styles.subtitle}>
          Explore our collection of articles to deepen your understanding of Rudraksha beads and spiritual wellness.
        </p>
      </div>

      <div className={styles.grid}>
        {blogPosts.map((post) => (
          <Link href={`/blog/${post.id}`} key={post.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={post.image} alt={post.title} className={styles.image} />
            </div>
            <div className={styles.content}>
              <span className={styles.date}>{post.date}</span>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <p className={styles.excerpt}>{post.excerpt}</p>
              <span className={styles.readMore}>Read Article &rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
