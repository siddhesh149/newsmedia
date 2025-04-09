# NewsMedia

A modern news media platform built with Next.js 14, React, TypeScript, Tailwind CSS, Prisma, and CockroachDB.

## Features

- Dynamic article management
- Category-based navigation
- Search functionality
- Social sharing
- Admin dashboard
- Responsive design

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Prisma
- CockroachDB

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - `DATABASE_URL`: Your CockroachDB connection string
   - `NEXT_PUBLIC_API_URL`: Your application URL
   - `ADMIN_SECRET`: Secret for admin routes

4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This project is deployed on Vercel. The build process includes:
- Prisma client generation
- Database schema push
- Next.js build

## Author

- [Siddhesh Ghargane](https://github.com/siddhesh149)

## SEO Optimization

To make your website discoverable on Google:

1. Create a Google Search Console account at [search.google.com/search-console](https://search.google.com/search-console)
2. Add your website to Search Console
3. Submit your sitemap.xml
4. Create a robots.txt file in your public folder
5. Add meta tags to your pages for better SEO

## Project Structure

- `app/` - Contains the main application code
  - `layout.tsx` - Root layout component
  - `page.tsx` - Homepage component
  - `globals.css` - Global styles and Tailwind imports

## Development

To start developing:

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Make your changes
5. Build for production with `npm run build`

## License

MIT 