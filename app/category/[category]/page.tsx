import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '../../../lib/utils';

// This would be replaced with a database call in a real application
async function getArticlesByCategory(category: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/articles?category=${category}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch articles');
  }
  
  return res.json();
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { articles } = await getArticlesByCategory(params.category);
  
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Home
          </Link>
          <span>/</span>
          <h1 className="text-3xl font-bold capitalize">{params.category}</h1>
        </div>
        
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No articles found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => (
              <Link 
                key={article.id} 
                href={`/articles/${article.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="text-blue-600 text-sm font-semibold capitalize">
                    {article.category}
                  </span>
                  <h2 className="text-xl font-bold mt-2 line-clamp-2">{article.title}</h2>
                  <p className="text-gray-600 mt-2 line-clamp-3">{article.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                    <span>By {article.author}</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 