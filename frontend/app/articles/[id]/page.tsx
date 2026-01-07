import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { Article } from '@/types/article';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface ArticlePageProps {
  params: {
    id: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  let article: Article | null = null;
  let error: string | null = null;

  try {
    article = await api.getArticle(parseInt(params.id));
  } catch (err) {
    if (err instanceof Error && 'status' in err && (err as any).status === 404) {
      notFound();
    }
    error = err instanceof Error ? err.message : 'Failed to load article';
    console.error('Error fetching article:', err);
  }

  if (error || !article) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">{error || 'Article not found'}</p>
          <Link
            href="/"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            ← Back to home
          </Link>
        </div>
      </main>
    );
  }

  const imageUrl = getImageUrl(article.image, article.imageUrl);

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          ← Back to articles
        </Link>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {imageUrl && (
            <div className="relative w-full h-96 bg-gray-200">
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-8">
            <div className="mb-4">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>By {article.author_username}</span>
                <span>•</span>
                <time dateTime={article.publish_date}>
                  {new Date(article.publish_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <div
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: article.body }}
              />
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}

