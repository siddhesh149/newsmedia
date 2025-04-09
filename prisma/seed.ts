import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Delete existing records
  await prisma.article.deleteMany({})

  // Create sample articles
  const articles = [
    {
      title: 'The Future of Technology',
      slug: 'the-future-of-technology',
      content: 'Artificial intelligence and machine learning are revolutionizing industries across the globe...',
      excerpt: 'Exploring how AI and ML are shaping our future',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
      category: 'technology',
      author: 'John Doe',
      tags: 'AI,Technology,Future',
      featured: true,
    },
    {
      title: 'Global Economic Trends',
      slug: 'global-economic-trends',
      content: 'The world economy is experiencing significant shifts as new markets emerge...',
      excerpt: 'Analysis of current global economic patterns',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
      category: 'business',
      author: 'Jane Smith',
      tags: 'Economy,Business,Global',
      featured: true,
    },
    {
      title: 'Climate Change Impact',
      slug: 'climate-change-impact',
      content: 'Recent studies show accelerating effects of climate change on global ecosystems...',
      excerpt: 'Understanding the environmental challenges ahead',
      image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000',
      category: 'world',
      author: 'Mike Johnson',
      tags: 'Climate,Environment,World',
      featured: false,
    }
  ]

  for (const article of articles) {
    await prisma.article.create({
      data: article
    })
  }

  console.log('Database has been seeded with sample articles')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 