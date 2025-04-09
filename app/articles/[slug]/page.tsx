import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import prisma from '../../../lib/db'
import ShareButtons from '../../components/ShareButtons'
import { formatDate } from '../../../lib/utils'

async function getArticle(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug }
  })

  if (!article) {
    notFound()
  }

  return article
}

async function getRelatedArticles(category: string, currentSlug: string) {
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
}

async function getRecommendedArticles(currentSlug: string) {
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
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)
  const relatedArticles = await getRelatedArticles(article.category, params.slug)
  const recommendedArticles = await getRecommendedArticles(params.slug)

  // Calculate if the article is recent (less than 48 hours old)
  const isRecent = (new Date().getTime() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60) < 48;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      {/* Back to Home Button */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>

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
            <div className="flex items-center text-gray-600 text-sm">
              <span>{article.author}</span>
              <span className="mx-2">•</span>
              <time>{formatDate(article.publishedAt)}</time>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="p-8">
          {/* Social Share Buttons */}
          <ShareButtons 
            title={article.title} 
            url={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/articles/${article.slug}`} 
          />

          {/* Content */}
          <div className="prose max-w-none">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-lg leading-relaxed text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          {article.tags && (
            <div className="mt-12 pt-6 border-t border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Topics</h2>
              <div className="flex flex-wrap gap-2">
                {article.tags.split(',').map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?tag=${tag.trim()}`}
                    className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm hover:bg-blue-100 hover:text-blue-800 transition-colors"
                  >
                    #{tag.trim()}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="max-w-4xl mx-auto mt-12 px-4">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((related) => (
              <Link 
                key={related.slug}
                href={`/articles/${related.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={related.image}
                    alt={related.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{related.title}</h3>
                  <p className={`text-sm ${(new Date().getTime() - new Date(related.publishedAt).getTime()) / (1000 * 60 * 60) < 48 ? "text-green-600 font-medium" : "text-gray-600"}`}>
                    {formatDate(related.publishedAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Reading */}
      {recommendedArticles.length > 0 && (
        <section className="max-w-4xl mx-auto mt-12 px-4">
          <h2 className="text-2xl font-bold mb-6">Recommended Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedArticles.map((recommended) => (
              <Link 
                key={recommended.slug}
                href={`/articles/${recommended.slug}`}
                className="flex gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative w-32 h-24 flex-shrink-0">
                  <Image
                    src={recommended.image}
                    alt={recommended.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-blue-600 text-sm">{recommended.category}</span>
                  <h3 className="font-semibold line-clamp-2 mt-1">{recommended.title}</h3>
                  <p className={`text-sm mt-1 ${(new Date().getTime() - new Date(recommended.publishedAt).getTime()) / (1000 * 60 * 60) < 48 ? "text-green-600 font-medium" : "text-gray-600"}`}>
                    {formatDate(recommended.publishedAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
} 