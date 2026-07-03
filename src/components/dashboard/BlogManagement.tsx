"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { BlogPost, BlogTranslation } from '@/types/blog';
import styles from './BlogManagement.module.css';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import react-quill-new to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const emptyTranslation: BlogTranslation = { title: '', excerpt: '', content: '' };

const emptyBlog: BlogPost = {
  id: '',
  image: '',
  date: '',
  author: 'Rudraksha Lanka Team',
  en: { ...emptyTranslation },
  si: { ...emptyTranslation },
  ta: { ...emptyTranslation }
};

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState<'en' | 'si' | 'ta'>('en');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error('Failed to fetch blogs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog({ ...blog });
    setActiveTab('en');
  };

  const handleAddNew = () => {
    setEditingBlog({ ...emptyBlog, id: 'blog-' + Date.now() });
    setActiveTab('en');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await fetch(`/api/blogs?id=${id}`, { method: 'DELETE' });
        fetchBlogs();
      } catch (error) {
        alert('Failed to delete blog');
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingBlog) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'blogs');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.imageUrl) {
        setEditingBlog({ ...editingBlog, image: data.imageUrl });
      }
    } catch (error) {
      alert('Failed to upload image');
    }
  };

  const handleSave = async () => {
    if (!editingBlog) return;
    setSaving(true);
    
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBlog)
      });
      
      if (res.ok) {
        setEditingBlog(null);
        fetchBlogs();
      } else {
        alert('Failed to save blog');
      }
    } catch (error) {
      alert('Error saving blog');
    } finally {
      setSaving(false);
    }
  };

  // Quill modules for rich text formatting
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  if (loading) return <div>Loading blogs...</div>;

  if (editingBlog) {
    return (
      <div className={styles.editorContainer}>
        <h2>{editingBlog.id.startsWith('blog-') && editingBlog.id.length > 10 ? 'Create New Blog' : 'Edit Blog'}</h2>
        
        <div className={styles.formGroup}>
          <label>URL Slug (ID):</label>
          <input 
            type="text" 
            value={editingBlog.id} 
            onChange={e => setEditingBlog({...editingBlog, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
            placeholder="e.g. benefits-of-rudraksha"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Cover Image:</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              type="text" 
              value={editingBlog.image} 
              onChange={e => setEditingBlog({...editingBlog, image: e.target.value})}
              placeholder="/images/blogs/cover.jpg"
              className={styles.input}
            />
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              style={{ display: 'none' }} 
            />
            <button onClick={() => fileInputRef.current?.click()} className={styles.btnSecondary}>
              Upload Photo
            </button>
          </div>
          {editingBlog.image && <img src={editingBlog.image} alt="Cover" className={styles.coverPreview} />}
        </div>

        <div className={styles.formGroup}>
          <label>Author:</label>
          <input 
            type="text" 
            value={editingBlog.author} 
            onChange={e => setEditingBlog({...editingBlog, author: e.target.value})}
            className={styles.input}
          />
        </div>

        <div className={styles.langTabs}>
          <button className={`${styles.langTab} ${activeTab === 'en' ? styles.activeTab : ''}`} onClick={() => setActiveTab('en')}>English</button>
          <button className={`${styles.langTab} ${activeTab === 'si' ? styles.activeTab : ''}`} onClick={() => setActiveTab('si')}>Sinhala</button>
          <button className={`${styles.langTab} ${activeTab === 'ta' ? styles.activeTab : ''}`} onClick={() => setActiveTab('ta')}>Tamil</button>
        </div>

        <div className={styles.translationSection}>
          <div className={styles.formGroup}>
            <label>Title ({activeTab.toUpperCase()}):</label>
            <input 
              type="text" 
              value={editingBlog[activeTab].title} 
              onChange={e => setEditingBlog({...editingBlog, [activeTab]: { ...editingBlog[activeTab], title: e.target.value }})}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Excerpt / Short Description ({activeTab.toUpperCase()}):</label>
            <textarea 
              value={editingBlog[activeTab].excerpt} 
              onChange={e => setEditingBlog({...editingBlog, [activeTab]: { ...editingBlog[activeTab], excerpt: e.target.value }})}
              className={styles.textarea}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Full Content ({activeTab.toUpperCase()}):</label>
            <div className={styles.quillWrapper}>
              <ReactQuill 
                theme="snow" 
                value={editingBlog[activeTab].content} 
                onChange={(content) => setEditingBlog({...editingBlog, [activeTab]: { ...editingBlog[activeTab], content }})} 
                modules={modules}
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={handleSave} disabled={saving} className={styles.btnPrimary}>
            {saving ? 'Saving...' : 'Save Blog Post'}
          </button>
          <button onClick={() => setEditingBlog(null)} className={styles.btnSecondary}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Manage Blog Posts</h2>
        <button onClick={handleAddNew} className={styles.btnPrimary}>+ Create New Blog</button>
      </div>

      <div className={styles.grid}>
        {blogs.map(blog => (
          <div key={blog.id} className={styles.card}>
            <img src={blog.image} alt={blog.en.title} className={styles.cardImage} />
            <div className={styles.cardContent}>
              <h3>{blog.en.title}</h3>
              <p>{blog.date} | {blog.author}</p>
              <div className={styles.cardActions}>
                <button onClick={() => handleEdit(blog)} className={styles.btnSecondary}>Edit</button>
                <button onClick={() => handleDelete(blog.id)} className={styles.btnDanger}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
