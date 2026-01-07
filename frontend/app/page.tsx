import Link from 'next/link';
import { api } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import SearchBar from '@/components/SearchBar';
import { Article } from '@/types/article';
import { Suspense } from 'react';

// Disable static generation and caching
export const dynamic = 'force-dynamic';

interface HomeProps {
  searchParams: {
    published?: string;
    search?: string;
  };
}

function SearchBarWrapper() {
  return (
    <Suspense fallback={<div className="w-full max-w-2xl mx-auto mb-8 h-14" />}>
      <SearchBar />
    </Suspense>
  );
}

export default async function Home({ searchParams }: HomeProps) {
  let articles: Article[] = [];
  let error: string | null = null;
  
  // Parse published filter from query params
  const showPublished = searchParams.published === undefined 
    ? true 
    : searchParams.published === 'true';
  
  // Get search query
  const searchQuery = searchParams.search || undefined;

  try {
    const response = await api.getArticles(1, showPublished, searchQuery);
    articles = response.results;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load articles';
    console.error('Error fetching articles:', err);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to 7
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover and read amazing articles
          </p>
          <div className="flex justify-center gap-4 mb-6">
            <Link
              href={searchQuery ? `/?search=${encodeURIComponent(searchQuery)}` : '/'}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                showPublished
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Published Articles
            </Link>
            <Link
              href={searchQuery ? `/?published=false&search=${encodeURIComponent(searchQuery)}` : '/?published=false'}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                !showPublished
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Unpublished Articles
            </Link>
          </div>
        </header>

        <SearchBarWrapper />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Error loading articles</p>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-2">
              Make sure your Django backend is running at{' '}
              <code className="bg-red-100 px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}
              </code>
            </p>
          </div>
        )}

        {!error && articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery
                ? `No ${showPublished ? 'published' : 'unpublished'} articles found matching "${searchQuery}".`
                : `No ${showPublished ? 'published' : 'unpublished'} articles found.`}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {searchQuery
                ? 'Try a different search term or clear the search.'
                : showPublished
                ? 'Create some articles in the Django admin panel.'
                : 'All articles are currently published.'}
            </p>
          </div>
        )}

        {articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

