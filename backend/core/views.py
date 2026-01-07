

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action
from .models import Article
from .serializers import ArticleSerializer


class HealthCheckView(APIView):
    def get(self, request):
        return Response({"status": "ok"})


class ArticleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Article instances.
    Provides CRUD operations:
    - GET /api/articles/ - List all articles
    - POST /api/articles/ - Create new article
    - GET /api/articles/{id}/ - Retrieve article
    - PUT /api/articles/{id}/ - Update article (full update)
    - PATCH /api/articles/{id}/ - Partial update article
    - DELETE /api/articles/{id}/ - Delete article
    """
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    
    def perform_create(self, serializer):
        """Set the author to the current user if authenticated, otherwise use author from request"""
        if self.request.user.is_authenticated:
            serializer.save(author=self.request.user)
        else:
            # If not authenticated, author must be provided in the request data
            # The serializer will validate it
            serializer.save()

