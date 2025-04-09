'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
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

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles')
      if (!res.ok) {
        throw new Error('Failed to fetch articles')
      }
      const data = await res.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">All Articles</h1>
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div
                key={article.id}
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
                  <div className="flex items-center justify-between mb-2">
                    <Link
                      href={`/category/${article.category}`}
                      className="text-blue-600 text-sm font-semibold hover:text-blue-800"
                    >
                      {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                    </Link>
                    <span className="text-gray-500 text-sm">
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>
                  <Link href={`/article/${article.slug}`}>
                    <h2 className="text-xl font-bold mb-2 hover:text-blue-600">
                      {article.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">By {article.author}</span>
                    <Link
                      href={`/article/${article.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
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