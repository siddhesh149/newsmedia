# Admin Page Implementation Guide

## Overview
This guide explains the implementation of a secure admin page for adding news articles to the NewsMedia website.

## File Structure
```
app/
├── admin/
│   └── page.tsx        # Admin page component
├── api/
│   └── articles/
│       └── route.ts    # API route for article creation
└── docs/
    └── admin-page-guide.md  # This documentation
```

## Features
- Secure password protection
- Article creation form with fields:
  - Title
  - Excerpt
  - Category selection
  - Image URL
  - Content (long-form text)
  - Tags (comma-separated)
  - Featured article toggle
- Automatic slug generation
- Error handling
- Loading states
- Success notifications
- Form reset after submission

## Security
- Password-protected access
- Environment variable based authentication
- API route protection
- Form validation

## Implementation Details

### 1. Admin Page Component (app/admin/page.tsx)
```typescript
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Article form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('world');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState('');
  const [featured, setFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login handler
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  // Article submission handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`,
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          category,
          image,
          tags: tags.split(',').map(tag => tag.trim()),
          featured,
        }),
      });

      if (response.ok) {
        // Reset form
        setTitle('');
        setContent('');
        setExcerpt('');
        setCategory('world');
        setImage('');
        setTags('');
        setFeatured(false);
        alert('Article published successfully!');
      } else {
        throw new Error('Failed to publish article');
      }
    } catch (error) {
      alert('Error publishing article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... Rest of the component code
}
```

### 2. API Route (app/api/articles/route.ts)
```typescript
import { NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  // Check authentication
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  if (token !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Create URL-friendly slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Create the article
    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        excerpt: data.excerpt,
        image: data.image,
        category: data.category,
        tags: data.tags.join(','),
        featured: data.featured,
        author: 'Admin',
        publishedAt: new Date(),
      },
    });

    // Revalidate the homepage and article page
    revalidatePath('/');
    revalidatePath(`/articles/${slug}`);

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
```

## Setup Instructions

1. Environment Variables
   Create a `.env.local` file in your project root:
   ```
   NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password_here
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

2. Deployment Steps:
   - Deploy your website to your hosting platform
   - Add the environment variable in your hosting platform:
     - Name: `NEXT_PUBLIC_ADMIN_PASSWORD`
     - Value: Your chosen secure password

3. Accessing the Admin Page:
   - Go to `your-website.com/admin`
   - Enter your admin password
   - Start creating articles!

## Security Best Practices

1. Password Requirements:
   - Minimum 12 characters
   - Mix of uppercase and lowercase letters
   - Include numbers
   - Include special characters
   - Avoid common words or patterns

2. Additional Security Measures to Consider:
   - Rate limiting login attempts
   - Two-factor authentication
   - IP whitelisting
   - Session management
   - Regular password rotation

3. Important Security Notes:
   - Never share your admin password
   - Keep your admin URL private
   - Regularly update your password
   - Monitor for suspicious login attempts
   - Don't store sensitive data in client-side code

## Troubleshooting

1. If you can't log in:
   - Check if the environment variable is set correctly
   - Verify the password matches exactly
   - Clear browser cache and try again

2. If articles aren't being created:
   - Check the browser console for errors
   - Verify database connection
   - Ensure all required fields are filled
   - Check API response in Network tab

## Maintenance

1. Regular Tasks:
   - Update admin password periodically
   - Monitor error logs
   - Back up article data
   - Check for security updates

2. Updates and Improvements:
   - Consider adding image upload functionality
   - Implement rich text editor
   - Add article preview
   - Include draft functionality

## Support

For any issues or questions:
1. Check the error messages
2. Review this documentation
3. Check the browser console
4. Verify environment variables
5. Contact the development team 