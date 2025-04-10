import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import prisma from '../../../lib/db'
import ShareButtons from '../../components/ShareButtons'
import { formatDate } from '../../../lib/utils'
import { Metadata } from 'next'

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug)
  
  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.'
    }
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
      type: 'article',
      publishedTime: article.publishedAt.toISOString(),
      authors: [article.author],
      tags: article.tags?.split(',') || []
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    }
  }
}

async function getArticle(slug: string) {
  try {
    console.log('Fetching article with slug:', slug)
    const article = await prisma.article.findUnique({
      where: { slug }
    })

    if (!article) {
      console.log('Article not found:', slug)
      return null
    }

    console.log('Article found:', article.title)
    return article
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

async function getRelatedArticles(category: string, currentSlug: string) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        category,
        slug: { not: currentSlug }
      },
      take: 3,
      orderBy: { publishedAt: 'desc' }
    })

    return articles
  } catch (error) {
    console.error('Error fetching related articles:', error)
    return []
  }
}

async function getRecommendedArticles(currentSlug: string) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        featured: true,
        slug: { not: currentSlug }
      },
      take: 4,
      orderBy: { publishedAt: 'desc' }
    })

    return articles
  } catch (error) {
    console.error('Error fetching recommended articles:', error)
    return []
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)

  if (!article) {
    notFound() // This will trigger the not-found.tsx page
  }

  const [relatedArticles, recommendedArticles] = await Promise.all([
    getRelatedArticles(article.category, article.slug),
    getRecommendedArticles(article.slug)
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Article Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <Link 
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center space-x-4">
              <Link href={`/category/${article.category.toLowerCase()}`} className="text-gray-600 hover:text-blue-600">
                {article.category}
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Hero */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center text-gray-600 text-sm mb-6">
              <span className="font-medium">{article.author}</span>
              <span className="mx-2">•</span>
              <time>{formatDate(article.publishedAt.toString())}</time>
              <span className="mx-2">•</span>
              <span>5 min read</span>
            </div>
            <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Article Content */}
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
              <h3 className="text-lg font-semibold mb-4">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.split(',').map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${tag.trim()}`}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
                  >
                    {tag.trim()}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Share Buttons */}
          <div className="mt-8 pt-8 border-t">
            <ShareButtons 
              title={article.title}
              url={`${process.env.NEXT_PUBLIC_API_URL}/articles/${article.slug}`}
            />
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">More from {article.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/articles/${relatedArticle.slug}`}
                    className="block group"
                  >
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={relatedArticle.image}
                          alt={relatedArticle.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold group-hover:text-blue-600 transition-colors line-clamp-2">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                          By {relatedArticle.author} • {formatDate(relatedArticle.publishedAt.toString())}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recommended Articles */}
      {recommendedArticles.length > 0 && (
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Recommended for you</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedArticles.map((recommendedArticle) => (
                  <Link
                    key={recommendedArticle.id}
                    href={`/articles/${recommendedArticle.slug}`}
                    className="block group"
                  >
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={recommendedArticle.image}
                          alt={recommendedArticle.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="p-4">
                        <span className="text-xs text-blue-600 font-medium">
                          {recommendedArticle.category}
                        </span>
                        <h3 className="font-semibold group-hover:text-blue-600 transition-colors mt-1 line-clamp-2">
                          {recommendedArticle.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                          {formatDate(recommendedArticle.publishedAt.toString())}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
} 