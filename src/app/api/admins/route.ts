import { NextResponse } from 'next/server';
import { getAdmins, saveAdmin, deleteAdmin } from '@/lib/admins-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admins = getAdmins();
    return NextResponse.json(admins);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newAdmin = {
      ...body,
      id: `admin-${Date.now()}`
    };
    saveAdmin(newAdmin);
    return NextResponse.json({ success: true, admin: newAdmin }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    
    deleteAdmin(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
  }
}
