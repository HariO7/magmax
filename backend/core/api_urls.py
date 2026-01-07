from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HealthCheckView, ArticleViewSet

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'articles', ArticleViewSet, basename='article')

urlpatterns = [
    path('health/', HealthCheckView.as_view()),
    path('', include(router.urls)),
]
