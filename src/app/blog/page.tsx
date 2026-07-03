import { getBlogs } from '@/lib/db';
import styles from './page.module.css';
import BlogGrid from '@/components/blog/BlogGrid';

export const metadata = {
  title: 'Blog - Rudraksha Lanka',
  description: 'Read our latest articles on spirituality, healing, and Rudraksha beads.',
};

export default function BlogIndex() {
  const blogs = getBlogs();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Spiritual Insights & Guides</h1>
        <p className={styles.subtitle}>
          Explore our collection of articles to deepen your understanding of Rudraksha beads and spiritual wellness.
        </p>
      </div>

      <BlogGrid posts={blogs} />
    </div>
  );
}
