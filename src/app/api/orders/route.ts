import { NextResponse } from 'next/server';
import { getOrders, saveOrder, updateOrderStatus } from '@/lib/db';
import { Order } from '@/types/order';
import { sendOrderEmail } from '@/lib/email';

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
    const newOrder: Order = {
      ...body,
      id: `ORD${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    saveOrder(newOrder);

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

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    updateOrderStatus(id, status);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
