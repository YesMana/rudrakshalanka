import { NextResponse } from 'next/server';
import { getOrders, saveOrder, updateOrderStatus } from '@/lib/db';
import { Order } from '@/types/order';
import { sendOrderEmail, sendStatusUpdateEmail } from '@/lib/email';

import { getProducts, updateProduct } from '@/lib/products-db';

export async function GET() {
  try {
    const orders = getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const products = getProducts();
    
    // Check stock before ordering
    if (body.cartItemsForStockUpdate) {
      for (const item of body.cartItemsForStockUpdate) {
        if (!item.product) continue;
        const p = products.find(prod => prod.id === item.product.id);
        if (p && p.stock !== undefined && p.stock < item.quantity) {
          return NextResponse.json({ error: `${p.name} is out of stock or requested quantity unavailable` }, { status: 400 });
        }
      }
    } else {
      // Fallback for direct buy if any
      const product = products.find(p => p.id === body.productId);
      if (product && (product.stock !== undefined && product.stock <= 0)) {
        return NextResponse.json({ error: 'Product is out of stock' }, { status: 400 });
      }
    }

    const { cartItemsForStockUpdate, ...orderDataToSave } = body;

    const newOrder: Order = {
      ...orderDataToSave,
      id: `ORD${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    saveOrder(newOrder);

    // Deduct stock
    if (cartItemsForStockUpdate) {
      for (const item of cartItemsForStockUpdate) {
        if (!item.product) continue;
        const p = products.find(prod => prod.id === item.product.id);
        if (p && p.stock !== undefined) {
          updateProduct(p.id, { stock: p.stock - item.quantity });
        }
      }
    } else {
      const product = products.find(p => p.id === body.productId);
      if (product && product.stock !== undefined) {
        updateProduct(product.id, { stock: product.stock - 1 });
      }
    }

    // Send email notification asynchronously (don't wait for it)
    sendOrderEmail(newOrder).catch(console.error);

    // Google Sheets Webhook (Automated live sync)
    if (process.env.GOOGLE_SHEETS_WEBHOOK) {
      fetch(process.env.GOOGLE_SHEETS_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      }).catch(console.error);
    }

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    const updatedOrder = updateOrderStatus(id, status);
    
    if (updatedOrder) {
      // Send email notification asynchronously
      sendStatusUpdateEmail(updatedOrder).catch(console.error);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
