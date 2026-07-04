"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Product } from '@/types/product';
import styles from './ProductManagement.module.css';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<{file: File, preview: string}[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [hasVariations, setHasVariations] = useState(false);

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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setImageFiles([]); // Reset image files so new ones can be selected
    setHasVariations(product.hasVariations || false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setImageFiles([]);
    setHasVariations(false);
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
      
      const variationsString = formData.get('variations') as string || '';
      const variationsArray = hasVariations ? variationsString.split(',').map(v => v.trim()).filter(v => v) : [];
      
      const isEditing = !!editingProduct;
      const productData = {
        name: formData.get('name'),
        price: Number(formData.get('price')),
        description: formData.get('description'),
        benefits: benefitsArray,
        stock: Number(formData.get('stock')) || 0,
        showExactStock: formData.get('showExactStock') === 'on',
        hasVariations,
        variations: variationsArray,
        image: imageUrls.length > 0 ? imageUrls[0] : (isEditing ? editingProduct.image : '/images/products/placeholder.jpg'),
        images: imageUrls.length > 0 ? imageUrls : (isEditing && editingProduct.images ? editingProduct.images : ['/images/products/placeholder.jpg']),
      };

      if (isEditing) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });

        if (res.ok) {
          setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productData } as Product : p));
          setEditingProduct(null);
          setHasVariations(false);
          (e.target as HTMLFormElement).reset();
          setImageFiles([]);
        } else {
          throw new Error('Failed to update product');
        }
      } else {
        // Save new product
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });

        if (res.ok) {
          const newProductRes = await res.json();
          setProducts([...products, newProductRes.product]);
          setHasVariations(false);
          (e.target as HTMLFormElement).reset();
          setImageFiles([]);
        } else {
          throw new Error('Failed to add product');
        }
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
        <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
        <form key={editingProduct?.id || 'new'} onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Product Name *</label>
            <input type="text" id="name" name="name" required defaultValue={editingProduct?.name} />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="price">Price (LKR) *</label>
            <input type="number" id="price" name="price" required min="0" defaultValue={editingProduct?.price} />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="stock">Stock Quantity *</label>
            <input type="number" id="stock" name="stock" required min="0" defaultValue={editingProduct?.stock ?? 10} />
          </div>
          
          <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="showExactStock" name="showExactStock" style={{ width: 'auto' }} defaultChecked={editingProduct?.showExactStock} />
            <label htmlFor="showExactStock" style={{ margin: 0 }}>Show exact stock count to customers</label>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="description">Description *</label>
            <textarea id="description" name="description" required rows={5} defaultValue={editingProduct?.description}></textarea>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="benefits">Benefits (comma-separated) *</label>
            <input type="text" id="benefits" name="benefits" required placeholder="e.g. Wealth, Health, Peace" defaultValue={editingProduct?.benefits?.join(', ')} />
          </div>
          
          <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <input 
              type="checkbox" 
              id="hasVariations" 
              name="hasVariations" 
              style={{ width: 'auto' }} 
              checked={hasVariations}
              onChange={(e) => setHasVariations(e.target.checked)}
            />
            <label htmlFor="hasVariations" style={{ margin: 0, fontWeight: 'bold' }}>Product has variations (e.g. Gold, Silver)</label>
          </div>
          
          {hasVariations && (
            <div className={styles.formGroup} style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
              <label htmlFor="variations">Variations (comma-separated) *</label>
              <input type="text" id="variations" name="variations" required={hasVariations} placeholder="e.g. Gold, Silver, Copper" defaultValue={editingProduct?.variations?.join(', ')} />
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>Customers will be able to select one of these options when purchasing.</p>
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label htmlFor="image">{editingProduct ? 'Update Product Images (Optional)' : 'Product Images (Up to 5) *'}</label>
            <input 
              type="file" 
              id="image" 
              accept="image/*" 
              required={!editingProduct && imageFiles.length === 0} 
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
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
            </button>
            {editingProduct && (
              <button type="button" onClick={cancelEdit} className={styles.deleteBtn} style={{ margin: 0, padding: '1rem' }}>
                Cancel Edit
              </button>
            )}
          </div>
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
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button 
                      onClick={() => handleEdit(product)}
                      className={styles.submitBtn}
                      style={{ padding: '0.5rem', flex: 1, margin: 0, background: '#4CAF50' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className={styles.deleteBtn}
                      style={{ padding: '0.5rem', flex: 1, margin: 0 }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
