import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasUrl: !!process.env.NEXTAUTH_URL,
    urlValue: process.env.NEXTAUTH_URL || 'missing',
    hasSecret: !!process.env.NEXTAUTH_SECRET,
    hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    nodeEnv: process.env.NODE_ENV,
  });
}
