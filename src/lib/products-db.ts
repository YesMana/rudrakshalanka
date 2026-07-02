import fs from 'fs';
import path from 'path';
import { Product, Review } from '@/types/product';

const dataFilePath = path.join(process.cwd(), 'products.json');

// Initialize with default products if the file doesn't exist
const initializeProducts = () => {
  if (!fs.existsSync(dataFilePath)) {
    const defaultProducts: Product[] = [
      {
        id: 'p1',
        name: '5 Mukhi Nepali Rudraksha',
        price: 4500,
        description: 'Authentic 5 Mukhi Rudraksha from Nepal, blessed and energized for daily wear.',
        benefits: ['Improves focus and memory', 'Brings peace of mind', 'Regulates blood pressure'],
        image: '/images/products/5-mukhi.jpg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'p2',
        name: '7 Mukhi Rudraksha Mala',
        price: 12000,
        description: 'A complete mala made of 7 Mukhi Rudraksha beads, associated with Goddess Mahalaxmi.',
        benefits: ['Attracts wealth and prosperity', 'Helps overcome financial difficulties', 'Promotes success in business'],
        image: '/images/products/7-mukhi-mala.jpg',
        createdAt: new Date().toISOString()
      },
      {
        id: 'p3',
        name: 'Gauri Shankar Rudraksha',
        price: 25000,
        description: 'Rare joined Rudraksha representing Lord Shiva and Goddess Parvati.',
        benefits: ['Improves relationships', 'Brings harmony to family life', 'Helps in finding a suitable partner'],
        image: '/images/products/gauri-shankar.jpg',
        createdAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(dataFilePath, JSON.stringify(defaultProducts, null, 2));
  }
};

export const getProducts = (): Product[] => {
  initializeProducts();
  const fileData = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(fileData);
};

export const saveProduct = (product: Product) => {
  const products = getProducts();
  products.push(product);
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));
};

export const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));
  }
};

export const deleteProduct = (id: string) => {
  let products = getProducts();
  products = products.filter(p => p.id !== id);
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));
};

export const addProductReview = (productId: string, review: Omit<Review, 'id' | 'createdAt'>): Product | null => {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === productId);
  
  if (index !== -1) {
    if (!products[index].reviews) {
      products[index].reviews = [];
    }
    
    const newReview: Review = {
      ...review,
      id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString()
    };
    
    products[index].reviews.push(newReview);
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));
    return products[index];
  }
  
  return null;
};
