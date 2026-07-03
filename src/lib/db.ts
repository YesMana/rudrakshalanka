import fs from 'fs';
import path from 'path';
import { Order } from '@/types/order';
import { BlogPost } from '@/types/blog';

const dataFilePath = path.join(process.cwd(), 'orders.json');
const blogsFilePath = path.join(process.cwd(), 'blogs.json');

export const getOrders = (): Order[] => {
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  const fileData = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(fileData);
};

export const saveOrder = (order: Order) => {
  const orders = getOrders();
  orders.push(order);
  fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2));
};

export const updateOrderStatus = (id: string, status: Order['status']) => {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index !== -1) {
    orders[index].status = status;
    fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2));
  }
};

export const getBlogs = (): BlogPost[] => {
  if (!fs.existsSync(blogsFilePath)) {
    return [];
  }
  const fileData = fs.readFileSync(blogsFilePath, 'utf-8');
  return JSON.parse(fileData);
};

export const saveBlog = (blog: BlogPost) => {
  const blogs = getBlogs();
  const index = blogs.findIndex(b => b.id === blog.id);
  if (index !== -1) {
    blogs[index] = blog;
  } else {
    blogs.push(blog);
  }
  fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2));
};

export const deleteBlog = (id: string) => {
  let blogs = getBlogs();
  blogs = blogs.filter(b => b.id !== id);
  fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2));
};
