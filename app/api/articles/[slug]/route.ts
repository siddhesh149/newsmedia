import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// GET a single article by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!article) {
      return new NextResponse(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new NextResponse(JSON.stringify(article), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return new NextResponse(JSON.stringify({ error: 'Error fetching article' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// UPDATE an article
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    
    const article = await prisma.article.update({
      where: {
        slug: params.slug
      },
      data: body
    });
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Revalidate the pages
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath(`/articles/${article.slug}`);
    
    return NextResponse.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE an article
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Delete the article by slug
    const article = await prisma.article.delete({
      where: {
        slug: params.slug,
      },
    });

    // Revalidate the homepage and article pages
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath(`/articles/${article.slug}`);

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Error deleting article' },
      { status: 500 }
    );
  }
} 