import { notFound } from 'next/navigation';
import { blogPosts } from '@/lib/blogData';
import styles from './article.module.css';
import Link from 'next/link';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

// Generate metadata for SEO dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = blogPosts.find(p => p.id === id);
  if (!post) {
    return { title: 'Post Not Found | Rudraksha Lanka' };
  }
  return {
    title: `${post.title} | Rudraksha Lanka Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    }
  };
}

// Ensure static generation for all known blog posts
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: post.id,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    notFound();
  }

  return (
    <article className={styles.article}>
      <div className={styles.hero} style={{ backgroundImage: `url(${post.image})` }}>
        <div className={styles.overlay}>
          <div className={styles.heroContent}>
            <Link href="/blog" className={styles.backLink}>&larr; Back to Blog</Link>
            <h1 className={styles.title}>{post.title}</h1>
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
          {post.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        <div className={styles.footer}>
          <hr className={styles.divider} />
          <div className={styles.share}>
            <span>Share this article:</span>
            {/* Simple share links using standard URL schemes */}
            <a href={`https://www.facebook.com/sharer/sharer.php?u=https://rudrakshalanka.com/blog/${post.id}`} target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href={`https://twitter.com/intent/tweet?url=https://rudrakshalanka.com/blog/${post.id}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer">X (Twitter)</a>
            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " - https://rudrakshalanka.com/blog/" + post.id)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </div>
    </article>
  );
}
