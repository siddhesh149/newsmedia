'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AddArticle() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    setUploadStatus('Uploading...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setImagePreview(data.imageUrl);
      setUploadStatus('Upload successful!');
      
      // Set the hidden input value
      const imageInput = document.getElementById('imageUrl') as HTMLInputElement;
      if (imageInput) imageInput.value = data.imageUrl;
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed. Please try again.');
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const article = {
      title: formData.get('title'),
      slug: formData.get('title')?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content: formData.get('content'),
      excerpt: formData.get('excerpt'),
      image: formData.get('imageUrl'), // Use the hidden input value
      category: formData.get('category'),
      author: formData.get('author'),
      tags: formData.get('tags'),
      featured: formData.get('featured') === 'true'
    };

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      });

      if (!res.ok) {
        throw new Error('Failed to add article');
      }

      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Error adding article:', error);
      alert('Failed to add article');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Article</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            name="title"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Content</label>
          <textarea
            name="content"
            required
            rows={10}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Excerpt</label>
          <textarea
            name="excerpt"
            required
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded"
          />
          <input
            type="hidden"
            name="imageUrl"
            id="imageUrl"
          />
          {uploadStatus && (
            <p className={uploadStatus.includes('failed') ? 'text-red-500' : 'text-green-500'}>
              {uploadStatus}
            </p>
          )}
          {imagePreview && (
            <div className="mt-2 relative h-48 w-full">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover rounded"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block mb-2">Category</label>
          <select name="category" required className="w-full p-2 border rounded">
            <option value="World">World</option>
            <option value="Technology">Technology</option>
            <option value="Politics">Politics</option>
            <option value="Business">Business</option>
            <option value="Science">Science</option>
            <option value="Sports">Sports</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Author</label>
          <input
            type="text"
            name="author"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            className="w-full p-2 border rounded"
            placeholder="news,world,politics"
          />
        </div>

        <div>
          <label className="block mb-2">Featured</label>
          <select name="featured" className="w-full p-2 border rounded">
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Adding...' : 'Add Article'}
        </button>
      </form>
    </div>
  );
} 