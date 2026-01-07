'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Article } from '@/types/article';

interface PublishButtonProps {
  article: Article;
}

export default function PublishButton({ article }: PublishButtonProps) {
  const [isPublished, setIsPublished] = useState(article.published);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleToggle = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedArticle = await api.updateArticle(article.id, {
        published: !isPublished,
      });
      setIsPublished(updatedArticle.published);
      // Refresh the page to show updated state
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update article');
      console.error('Error updating article:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
          isPublished
            ? 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400'
            : 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400'
        } disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {isPublished ? 'Unpublishing...' : 'Publishing...'}
          </span>
        ) : isPublished ? (
          'Unpublish Article'
        ) : (
          'Publish Article'
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      {isPublished && (
        <p className="mt-2 text-sm text-green-600 font-medium">
          ✓ This article is published
        </p>
      )}
      {!isPublished && (
        <p className="mt-2 text-sm text-gray-600">
          This article is not published
        </p>
      )}
    </div>
  );
}

