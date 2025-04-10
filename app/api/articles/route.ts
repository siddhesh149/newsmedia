import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';

// GET all articles with optional filtering
export async function GET(request: NextRequest) {
  console.log('GET /api/articles - Request received');
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured') === 'true';
  const limit = Number(searchParams.get('limit')) || undefined;
  const category = searchParams.get('category');
  const search = searchParams.get('q');

  console.log('Query params:', { featured, limit, category, search });

  try {
    const articles = await prisma.article.findMany({
      where: {
        ...(featured && { featured: true }),
        ...(category && { 
          category: {
            equals: category,
            mode: 'insensitive',
          }
        }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
            { excerpt: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: {
        publishedAt: 'desc',
      },
      ...(limit && { take: limit }),
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        category: true,
        author: true,
        publishedAt: true,
        featured: true,
        content: true,
        tags: true,
      },
    });

    console.log(`Found ${articles.length} articles`);

    return new NextResponse(JSON.stringify({ articles }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Request error:', error);
    return new NextResponse(JSON.stringify({ error: 'Error fetching articles' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// POST a new article
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      content,
      excerpt,
      image,
      category,
      author,
      tags,
      featured = false
    } = body;

    // Validate required fields
    if (!title || !slug || !content || !excerpt || !image || !category || !author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the article
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        image,
        category,
        author,
        tags,
        featured,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Error creating article' },
      { status: 500 }
    );
  }
} 