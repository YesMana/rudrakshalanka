import { NextResponse } from 'next/server';
import { addProductReview } from '@/lib/products-db';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, rating, comment } = await request.json();
    
    if (!name || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedProduct = addProductReview(params.id, { name, rating, comment });
    
    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
}
