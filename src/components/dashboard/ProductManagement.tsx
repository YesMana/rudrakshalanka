"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Product } from '@/types/product';
import styles from './ProductManagement.module.css';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<{file: File, preview: string}[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Cleanup function to revoke ObjectURLs when component unmounts
    return () => {
      imageFiles.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      const totalFiles = [...imageFiles, ...newFiles];
      
      if (totalFiles.length > 5) {
        alert("You can only upload up to 5 images total.");
        newFiles.forEach(f => URL.revokeObjectURL(f.preview)); // Cleanup excess
      } else {
        setImageFiles(totalFiles);
      }
      
      // Reset input so the same file can be selected again if needed
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const imageUrls: string[] = [];
      
      // Handle multiple image uploads
      for (const imgObj of imageFiles) {
        const uploadData = new FormData();
        uploadData.append('image', imgObj.file);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });
        
        if (uploadRes.ok) {
          const result = await uploadRes.json();
          imageUrls.push(result.imageUrl);
        } else {
          throw new Error('Image upload failed');
        }
      }

      // Prepare product data
      const benefitsString = formData.get('benefits') as string;
      const benefitsArray = benefitsString.split(',').map(b => b.trim()).filter(b => b);
      
      const productData = {
        name: formData.get('name'),
        price: Number(formData.get('price')),
        description: formData.get('description'),
        benefits: benefitsArray,
        stock: Number(formData.get('stock')) || 0,
        image: imageUrls.length > 0 ? imageUrls[0] : '/images/products/placeholder.jpg',
        images: imageUrls.length > 0 ? imageUrls : ['/images/products/placeholder.jpg'],
      };

      // Save product
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        const newProductRes = await res.json();
        setProducts([...products, newProductRes.product]);
        (e.target as HTMLFormElement).reset();
        setImageFiles([]);
      }
    } catch (error) {
      console.error('Failed to add product', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h3>Add New Product</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Product Name *</label>
            <input type="text" id="name" name="name" required />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="price">Price (LKR) *</label>
            <input type="number" id="price" name="price" required min="0" />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="stock">Stock Quantity *</label>
            <input type="number" id="stock" name="stock" required min="0" defaultValue="10" />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="description">Description *</label>
            <textarea id="description" name="description" required rows={3}></textarea>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="benefits">Benefits (comma-separated) *</label>
            <input type="text" id="benefits" name="benefits" required placeholder="e.g. Wealth, Health, Peace" />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="image">Product Images (Up to 5) *</label>
            <input 
              type="file" 
              id="image" 
              accept="image/*" 
              required={imageFiles.length === 0} 
              multiple
              onChange={handleImageChange}
            />
            {imageFiles.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Selected Images ({imageFiles.length}/5):</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {imageFiles.map((imgObj, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '80px', height: '80px' }}>
                      <img 
                        src={imgObj.preview} 
                        alt={`Preview ${idx}`} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
                      />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        style={{ 
                          position: 'absolute', top: '-5px', right: '-5px', 
                          background: '#ff4444', color: 'white', border: 'none', 
                          borderRadius: '50%', width: '20px', height: '20px', 
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '12px' 
                        }}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Uploading...' : 'Add Product'}
          </button>
        </form>
      </div>

      <div className={styles.listSection}>
        <h3>Current Products</h3>
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className={styles.productGrid}>
            {products.map(product => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImagePlaceholder}>
                  {product.image && <img src={product.image} alt={product.name} />}
                </div>
                <div className={styles.productInfo}>
                  <h4>{product.name}</h4>
                  <p>Rs. {product.price}</p>
                  <p style={{ color: (product.stock ?? 10) > 0 ? '#4CAF50' : '#f44336', fontSize: '0.9rem', marginTop: '4px' }}>
                    {(product.stock ?? 10) > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </p>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
