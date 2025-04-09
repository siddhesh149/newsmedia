import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '../../../lib/utils'

async function getArticle(slug: string) {
  try {
    const res = await fetch(`/api/articles/${slug}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      return null
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {/* Article Header */}
        <div className="max-w-4xl mx-auto">
          <Link 
            href={`/category/${article.category}`}
            className="text-blue-600 text-sm font-semibold hover:text-blue-800 mb-4 inline-block"
          >
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </Link>
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center text-gray-600 mb-8">
            <span>By {article.author}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>

        {/* Article Image */}
        <div className="max-w-4xl mx-auto mb-12 relative aspect-video">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          {article.tags && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.split(',').map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 