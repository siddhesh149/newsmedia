import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the article'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug for the article'],
    unique: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category for the article'],
    enum: ['Politics', 'Technology', 'Business', 'World', 'Sports', 'Entertainment'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content for the article'],
  },
  excerpt: {
    type: String,
    required: [true, 'Please provide an excerpt for the article'],
    maxlength: [200, 'Excerpt cannot be more than 200 characters'],
  },
  image: {
    type: String,
    required: [true, 'Please provide an image for the article'],
  },
  author: {
    type: String,
    required: [true, 'Please provide an author for the article'],
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
});

// Create indexes for search functionality
ArticleSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ publishedAt: -1 });

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema); 