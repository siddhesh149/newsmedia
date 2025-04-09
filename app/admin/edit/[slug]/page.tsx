'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  image: string
  category: string
  author: string
  tags: string
  featured: boolean
}

export default function EditArticlePage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState<Article>({
    id: '',
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image: '',
    category: '',
    author: '',
    tags: '',
    featured: false
  })
  const [status, setStatus] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const adminSecret = localStorage.getItem('adminSecret')
        if (!adminSecret) {
          router.push('/admin')
          return
        }

        const res = await fetch(`/api/articles/${params.slug}`, {
          headers: {
            'Authorization': `Bearer ${adminSecret}`
          }
        })

        if (!res.ok) throw new Error('Failed to fetch article')
        
        const article = await res.json()
        setFormData(article)
        setImagePreview(article.image)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching article:', error)
        setStatus('Failed to load article')
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.slug, router])

  const handleImageUpload = async (file: File, isMainImage: boolean = false) => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Failed to upload image')
      
      const data = await res.json()
      const imageUrl = data.url

      if (isMainImage) {
        setFormData(prev => ({ ...prev, image: imageUrl }))
        setImagePreview(imageUrl)
      } else {
        const textarea = editorRef.current
        if (textarea) {
          const start = textarea.selectionStart
          const end = textarea.selectionEnd
          const content = textarea.value
          const newContent = content.substring(0, start) + 
            `![Image](${imageUrl})` + 
            content.substring(end)
          
          setFormData(prev => ({ ...prev, content: newContent }))
        }
      }

      return imageUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      setStatus('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleImageUpload(file, true)
    }
  }

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleImageUpload(file, false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Updating article...')

    try {
      const adminSecret = localStorage.getItem('adminSecret')
      if (!adminSecret) {
        router.push('/admin')
        return
      }

      const res = await fetch(`/api/articles/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSecret}`
        },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to update article')

      setStatus('Article updated successfully!')
      router.push('/admin')
    } catch (error) {
      console.error('Error updating article:', error)
      setStatus('Failed to update article')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Loading...</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
            <button
              onClick={() => router.push('/admin')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Category & Author */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select category</option>
                  <option value="world">World</option>
                  <option value="politics">Politics</option>
                  <option value="business">Business</option>
                  <option value="technology">Technology</option>
                  <option value="science">Science</option>
                  <option value="health">Health</option>
                  <option value="sports">Sports</option>
                  <option value="entertainment">Entertainment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Main Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Main Image</label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imagePreview && (
                  <div className="relative h-20 w-20">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Content with Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <div className="mt-1">
                <div className="mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleContentImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Upload images to insert into content
                  </p>
                </div>
                <textarea
                  ref={editorRef}
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={15}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Featured Article
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={uploading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Update Article'}
              </button>
            </div>

            {/* Status Message */}
            {status && (
              <div className={`mt-4 p-4 rounded-md ${
                status.includes('success')
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                {status}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
} 