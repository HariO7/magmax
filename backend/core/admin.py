from django.contrib import admin
from .models import Article, Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'published', 'publish_date', 'created_at']
    list_filter = ['published', 'publish_date', 'created_at', 'author', 'tags']
    search_fields = ['title', 'body', 'author__username']
    date_hierarchy = 'publish_date'
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['tags']  # Better UI for many-to-many field
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
