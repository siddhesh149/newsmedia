import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// GET a single article by slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: {
        slug: params.slug
      }
    });

    if (!article) {
      return notFound();
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
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