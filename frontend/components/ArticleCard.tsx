import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types/article';
import { getImageUrl } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const imageUrl = getImageUrl(article.image, article.imageUrl);

  return (
    <Link href={`/articles/${article.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        {imageUrl && (
          <div className="relative w-full h-48 bg-gray-200">
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="p-6 flex-1 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {article.title}
          </h2>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
            {article.body.replace(/<[^>]*>/g, '').substring(0, 150)}...
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
            <span>{article.author_username}</span>
            <time dateTime={article.publish_date}>
              {new Date(article.publish_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>
          
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {article.tags.length > 3 && (
                <span className="px-2 py-1 text-gray-500 text-xs">
                  +{article.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

