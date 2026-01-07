

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils.dateparse import parse_datetime
from .models import Article
from .serializers import ArticleSerializer


class HealthCheckView(APIView):
    def get(self, request):
        return Response({"status": "ok"})


class ArticleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Article instances.
    Provides CRUD operations:
    - GET /api/articles/ - List all articles (with filtering)
    - POST /api/articles/ - Create new article
    - GET /api/articles/{id}/ - Retrieve article
    - PUT /api/articles/{id}/ - Update article (full update)
    - PATCH /api/articles/{id}/ - Partial update article
    - DELETE /api/articles/{id}/ - Delete article
    
    Filtering options (query parameters):
    - ?published=true/false - Filter by published status
    - ?author=1 - Filter by author ID
    - ?author_username=john - Filter by author username (partial match)
    - ?tag=django - Filter by tag name
    - ?publish_date_from=2024-01-01T00:00:00Z - Articles from this date
    - ?publish_date_to=2024-12-31T23:59:59Z - Articles until this date
    - ?search=django - Search in title and body
    - ?ordering=-publish_date - Order by publish_date (descending)
    - ?ordering=publish_date - Order by publish_date (ascending)
    """
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'body', 'author__username']
    ordering_fields = ['publish_date', 'created_at', 'title']
    ordering = ['-publish_date']  # Default ordering
    
    def get_queryset(self):
        """Apply custom filtering based on query parameters"""
        queryset = super().get_queryset()
        
        # Filter by published status
        published = self.request.query_params.get('published', None)
        if published is not None:
            published_bool = published.lower() in ('true', '1', 'yes')
            queryset = queryset.filter(published=published_bool)
        
        # Filter by author ID
        author_id = self.request.query_params.get('author', None)
        if author_id:
            try:
                queryset = queryset.filter(author__id=int(author_id))
            except ValueError:
                pass
        
        # Filter by author username (partial match)
        author_username = self.request.query_params.get('author_username', None)
        if author_username:
            queryset = queryset.filter(author__username__icontains=author_username)
        
        # Filter by tag
        tag = self.request.query_params.get('tag', None)
        if tag:
            queryset = queryset.filter(tags__contains=[tag])
        
        # Filter by publish date from
        publish_date_from = self.request.query_params.get('publish_date_from', None)
        if publish_date_from:
            try:
                date_from = parse_datetime(publish_date_from)
                if date_from:
                    queryset = queryset.filter(publish_date__gte=date_from)
            except (ValueError, TypeError):
                pass
        
        # Filter by publish date to
        publish_date_to = self.request.query_params.get('publish_date_to', None)
        if publish_date_to:
            try:
                date_to = parse_datetime(publish_date_to)
                if date_to:
                    queryset = queryset.filter(publish_date__lte=date_to)
            except (ValueError, TypeError):
                pass
        
        return queryset
    
    def perform_create(self, serializer):
        """Set the author to the current user if authenticated, otherwise use author from request"""
        if self.request.user.is_authenticated:
            serializer.save(author=self.request.user)
        else:
            # If not authenticated, author must be provided in the request data
            # The serializer will validate it
            serializer.save()
    
    def destroy(self, request, *args, **kwargs):
        """Delete an article"""
        instance = self.get_object()
        article_id = instance.id
        article_title = instance.title
        self.perform_destroy(instance)
        return Response(
            {
                "message": f"Article '{article_title}' (ID: {article_id}) has been deleted successfully."
            },
            status=status.HTTP_200_OK
        )

