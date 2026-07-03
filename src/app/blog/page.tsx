import { blogPosts } from '@/lib/blogData';
import styles from './page.module.css';
import BlogGrid from '@/components/blog/BlogGrid';

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

      <BlogGrid posts={blogPosts} />
    </div>
  );
}
