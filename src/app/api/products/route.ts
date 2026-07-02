import { NextResponse } from 'next/server';
import { getProducts, saveProduct } from '@/lib/products-db';
import { Product } from '@/types/product';

export async function GET() {
  try {
    const products = getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct: Product = {
      ...body,
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    saveProduct(newProduct);
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
  }
}
