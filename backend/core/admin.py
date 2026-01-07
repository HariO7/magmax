from django.contrib import admin
from .models import Article


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'published', 'publish_date', 'created_at']
    list_filter = ['published', 'publish_date', 'created_at', 'author']
    search_fields = ['title', 'body', 'author__username']
    date_hierarchy = 'publish_date'
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Content', {
            'fields': ('title', 'body', 'image', 'imageUrl')
        }),
        ('Metadata', {
            'fields': ('author', 'published', 'publish_date', 'tags')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
