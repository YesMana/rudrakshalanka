import fs from 'fs';
import path from 'path';
import { Order } from '@/types/order';

const dataFilePath = path.join(process.cwd(), 'orders.json');

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


