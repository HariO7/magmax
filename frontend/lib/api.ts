import { Article, ArticleListResponse } from '@/types/article';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(
      response.status,
      errorText || `API Error: ${response.statusText}`
    );
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return {} as T;
}

export const api = {
  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return fetchApi<{ status: string }>('/health/');
  },

  // Articles
  async getArticles(page: number = 1): Promise<ArticleListResponse> {
    return fetchApi<ArticleListResponse>(`/articles/?page=${page}`);
  },

  async getArticle(id: number): Promise<Article> {
    return fetchApi<Article>(`/articles/${id}/`);
  },

  async createArticle(data: Partial<Article>): Promise<Article> {
    return fetchApi<Article>('/articles/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateArticle(id: number, data: Partial<Article>): Promise<Article> {
    return fetchApi<Article>(`/articles/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteArticle(id: number): Promise<void> {
    return fetchApi<void>(`/articles/${id}/`, {
      method: 'DELETE',
    });
  },
};

export { ApiError };

