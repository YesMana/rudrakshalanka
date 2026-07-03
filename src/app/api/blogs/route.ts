import { NextResponse } from 'next/server';
import { getBlogs, saveBlog, deleteBlog } from '@/lib/db';
import { BlogPost } from '@/types/blog';

export async function GET() {
  try {
    const blogs = getBlogs();
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const blog: BlogPost = await request.json();
    if (!blog.id || !blog.en || !blog.si || !blog.ta) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Automatically generate date if not present
    if (!blog.date) {
      blog.date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    saveBlog(blog);
    return NextResponse.json({ success: true, blog });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save blog' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    deleteBlog(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
