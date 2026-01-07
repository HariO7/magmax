# Frontend

A modern Next.js client-side application for the article platform.

## Features

- 🚀 Next.js 14 with App Router
- ⚡ TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 📱 Responsive design
- 🔗 Integration with Django REST API backend

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Django backend running (see backend README)

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── articles/          # Article detail pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ArticleCard.tsx    # Article card component
├── lib/                   # Utilities and API client
│   └── api.ts             # API client functions
├── types/                 # TypeScript type definitions
│   └── article.ts         # Article types
└── ...config files
```

## API Integration

The frontend communicates with the Django backend through the API client in `lib/api.ts`. The API URL is configured via the `NEXT_PUBLIC_API_URL` environment variable.

### Available API Methods

- `api.healthCheck()` - Check API health
- `api.getArticles(page)` - Get paginated articles
- `api.getArticle(id)` - Get a single article
- `api.createArticle(data)` - Create a new article
- `api.updateArticle(id, data)` - Update an article
- `api.deleteArticle(id)` - Delete an article

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Base URL for the Django API (default: `http://localhost:8000/api`)

## Notes

- The application uses server-side rendering (SSR) for better SEO and performance
- Images are optimized using Next.js Image component
- The design is fully responsive and works on mobile, tablet, and desktop

