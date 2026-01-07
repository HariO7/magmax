export interface Article {
  id: number;
  title: string;
  body: string;
  image: string | null;
  imageUrl: string | null;
  author: number;
  author_username: string;
  publish_date: string;
  published: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ArticleListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Article[];
}

