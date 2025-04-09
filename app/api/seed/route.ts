import { NextResponse } from 'next/server';
import prisma from '../../../lib/db';

const sampleArticles = [
  {
    title: "The Future of AI in Journalism",
    slug: "future-of-ai-journalism",
    content: "Artificial Intelligence is revolutionizing how news is gathered, written, and distributed...",
    excerpt: "How AI is changing the landscape of modern journalism",
    image: "https://source.unsplash.com/random/800x600/?ai",
    category: "Technology",
    author: "John Doe",
    tags: "AI,journalism,technology",
    featured: true
  },
  {
    title: "Global Climate Summit 2024",
    slug: "global-climate-summit-2024",
    content: "World leaders gather to discuss urgent measures against climate change...",
    excerpt: "Key decisions from the latest climate summit",
    image: "https://source.unsplash.com/random/800x600/?climate",
    category: "World",
    author: "Jane Smith",
    tags: "climate,politics,environment",
    featured: true
  },
  {
    title: "New Breakthrough in Quantum Computing",
    slug: "quantum-computing-breakthrough",
    content: "Scientists achieve major milestone in quantum computing development...",
    excerpt: "Latest advances in quantum computing research",
    image: "https://source.unsplash.com/random/800x600/?quantum",
    category: "Science",
    author: "Dr. Robert Chen",
    tags: "quantum,science,technology",
    featured: false
  }
];

export async function POST() {
  try {
    const articles = await Promise.all(
      sampleArticles.map(article =>
        prisma.article.create({
          data: article
        })
      )
    );

    return NextResponse.json({ success: true, count: articles.length });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ success: false, error: 'Failed to seed database' }, { status: 500 });
  }
} 