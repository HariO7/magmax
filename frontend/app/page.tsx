import Link from 'next/link';
import { api } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import { Article } from '@/types/article';

export default async function Home() {
  let articles: Article[] = [];
  let error: string | null = null;

  try {
    const response = await api.getArticles(1);
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
            Welcome to Teest
          </h1>
          <p className="text-xl text-gray-600">
            Discover and read amazing articles
          </p>
        </header>

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
            <p className="text-gray-500 text-lg">No articles found.</p>
            <p className="text-gray-400 text-sm mt-2">
              Create some articles in the Django admin panel.
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

