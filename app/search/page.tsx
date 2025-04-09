'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
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

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (query) {
      searchArticles()
    } else {
      setArticles([])
      setLoading(false)
    }
  }, [query])

  const searchArticles = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/articles?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error('Error searching articles:', error)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Searching...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-gray-600 mb-8">
          {query ? (
            articles.length > 0 ? (
              `Found ${articles.length} article${articles.length === 1 ? '' : 's'} for "${query}"`
            ) : (
              `No articles found for "${query}"`
            )
          ) : (
            'Enter a search term to find articles'
          )}
        </p>

        {articles.length > 0 && (
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
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">
                    <Link href={`/articles/${article.slug}`} className="hover:text-blue-600">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">{article.author}</span>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1 group"
                    >
                      Read more
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 