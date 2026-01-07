from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Tag'
        verbose_name_plural = 'Tags'

    def __str__(self):
        return self.name


class Article(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    image = models.ImageField(upload_to='articles/', blank=True, null=True)
    imageUrl = models.URLField(blank=True, null=True, help_text="External image URL")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articles')
    publish_date = models.DateTimeField(default=timezone.now)
    published = models.BooleanField(default=False, help_text="Whether the article is published")
    tags = models.ManyToManyField(Tag, related_name='articles', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-publish_date']
        verbose_name = 'Article'
        verbose_name_plural = 'Articles'

    def __str__(self):
        return self.title
