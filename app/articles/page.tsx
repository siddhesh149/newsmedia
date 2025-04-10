'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '../../lib/utils'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  image: string
  category: string
  author: string
  publishedAt: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
      console.log('Fetching articles from:', apiUrl);
      
      const res = await fetch(`${apiUrl}/api/articles`, {
        cache: 'no-store'
      })
      
      if (!res.ok) {
        throw new Error('Failed to fetch articles')
      }
      
      const data = await res.json()
      console.log('Fetched articles:', data);
      setArticles(data.articles || [])
      setError('')
    } catch (error) {
      console.error('Error fetching articles:', error)
      setError('Failed to load articles. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Loading articles...</h1>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Error</h1>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchArticles}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">All Articles</h1>
        
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <Link
                    href={`/category/${article.category}`}
                    className="text-blue-600 text-sm font-semibold hover:text-blue-800"
                  >
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                  </Link>
                  <Link href={`/articles/${article.slug}`}>
                    <h2 className="text-xl font-bold mt-2 mb-3 hover:text-blue-600">
                      {article.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span>By {article.author}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No articles available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
} 