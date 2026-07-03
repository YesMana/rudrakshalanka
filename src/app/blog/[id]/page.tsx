import { notFound } from 'next/navigation';
import { blogPosts } from '@/lib/blogData';
import { Metadata } from 'next';
import BlogArticleClient from '@/components/blog/BlogArticleClient';

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
    title: `${post.en.title} | Rudraksha Lanka Blog`,
    description: post.en.excerpt,
    openGraph: {
      title: post.en.title,
      description: post.en.excerpt,
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

  return <BlogArticleClient post={post} />;
}
