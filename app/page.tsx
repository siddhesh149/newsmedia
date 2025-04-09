import Image from 'next/image'
import { NewspaperIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { formatDate } from '../lib/utils'

// This would be replaced with a database call in a real application
async function getLatestArticles() {
  try {
    const res = await fetch('/api/articles?limit=4', {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!res.ok) {
      console.log('Failed to fetch latest articles:', await res.text());
      return { articles: [] };
    }
    
    const data = await res.json();
    console.log('Latest articles:', data);
    return data;
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    return { articles: [] };
  }
}

async function getFeaturedArticles() {
  try {
    const res = await fetch('/api/articles?featured=true&limit=3', {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!res.ok) {
      console.log('Failed to fetch featured articles:', await res.text());
      return { articles: [] };
    }
    
    const data = await res.json();
    console.log('Featured articles:', data);
    return data;
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    return { articles: [] };
  }
}

export default async function Home() {
  const { articles: latestArticles } = await getLatestArticles();
  const { articles: featuredArticles } = await getFeaturedArticles();
  
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <NewspaperIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">NewsMedia</h1>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
              <Link href="/category/world" className="text-gray-600 hover:text-blue-600">World</Link>
              <Link href="/category/politics" className="text-gray-600 hover:text-blue-600">Politics</Link>
              <Link href="/category/business" className="text-gray-600 hover:text-blue-600">Business</Link>
              <Link href="/category/technology" className="text-gray-600 hover:text-blue-600">Technology</Link>
            </div>
            <div className="flex items-center">
              <form action="/search" className="flex items-center">
                <input
                  type="text"
                  name="q"
                  placeholder="Search news..."
                  className="px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:border-blue-500 w-48"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          </nav>
        </div>
      </header>

      {/* Latest News Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Latest News</h2>
          {latestArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestArticles.map((article: any) => (
                <div key={article.id} className="flex flex-col p-4 border rounded-lg hover:shadow-md transition-all">
                  <div className="flex gap-4">
                    <div className="relative w-32 h-24 flex-shrink-0">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-blue-600 text-sm font-semibold">{article.category}</span>
                      <h3 className="text-lg font-bold mt-1 line-clamp-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{article.excerpt}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                      <span>By {article.author}</span>
                      <span>{formatDate(article.publishedAt.toString())}</span>
                    </div>
                    <Link 
                      href={`/article/${article.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1 group"
                    >
                      Read full article
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No articles available yet. Check back soon!</p>
            </div>
          )}
          <div className="text-center mt-8">
            <Link href="/articles" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              View All News
            </Link>
          </div>
        </div>
      </section>

      {/* Featured News Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Stories</h2>
        {featuredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article: any) => (
              <div 
                key={article.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-40">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="text-blue-600 text-sm font-semibold">{article.category}</span>
                  <h3 className="text-xl font-bold mt-2 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 mt-2 text-sm line-clamp-3">{article.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                      <span>By {article.author}</span>
                      <span>{formatDate(article.publishedAt.toString())}</span>
                    </div>
                    <Link 
                      href={`/article/${article.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1 group"
                    >
                      Read full article
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No featured stories available yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
          <p className="text-gray-600 mb-8">Subscribe to our newsletter for daily news updates</p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NewsMedia</h3>
              <p className="text-gray-400">Your trusted source for the latest news and updates from around the world.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/category/world" className="hover:text-white">World</Link></li>
                <li><Link href="/category/politics" className="hover:text-white">Politics</Link></li>
                <li><Link href="/category/business" className="hover:text-white">Business</Link></li>
                <li><Link href="/category/technology" className="hover:text-white">Technology</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NewsMedia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
} 