import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import prisma from '../../../lib/db'
import ShareButtons from '../../components/ShareButtons'
import { formatDate } from '../../../lib/utils'

async function getArticle(slug: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { slug }
    })

    if (!article) {
      return null
    }

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
        category: category,
        slug: {
          not: currentSlug
        }
      },
      take: 3,
      orderBy: {
        publishedAt: 'desc'
      }
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
        slug: {
          not: currentSlug
        }
      },
      take: 4,
      orderBy: {
        publishedAt: 'desc'
      }
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

  const [relatedArticles, recommendedArticles] = await Promise.all([
    getRelatedArticles(article.category, article.slug),
    getRecommendedArticles(article.slug)
  ])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="relative w-full h-[500px]">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="mb-2">
                <span className="bg-blue-600 text-sm px-3 py-1 rounded-full">
                  {article.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4 text-shadow">{article.title}</h1>
              <div className="flex items-center text-gray-200 text-sm">
                <span>{article.author}</span>
                <span className="mx-2">•</span>
                <time>{formatDate(article.publishedAt.toString())}</time>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-8">
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
          <div className="max-w-4xl mx-auto mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
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
                      <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {formatDate(relatedArticle.publishedAt.toString())}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Articles */}
        {recommendedArticles.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12">
            <h2 className="text-2xl font-bold mb-6">Recommended Articles</h2>
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
                      <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
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
        )}
      </div>
    </div>
  )
} 