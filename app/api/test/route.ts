import { NextResponse } from 'next/server';
import prisma from '../../../lib/db';

export async function GET() {
  try {
    // Test database connection by counting articles
    const count = await prisma.article.count();
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 });
  }
} 