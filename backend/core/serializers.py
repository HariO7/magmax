from rest_framework import serializers
from .models import Article
from django.contrib.auth.models import User


class ArticleSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'body', 'image', 'imageUrl', 'author', 'author_username', 
                  'publish_date', 'published', 'tags', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
        
    def validate_title(self, value):
        """Validate that title is not empty"""
        if not value or not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value.strip()
    
    def validate_body(self, value):
        """Validate that body is not empty"""
        if not value or not value.strip():
            raise serializers.ValidationError("Body cannot be empty.")
        return value.strip()
    
    def validate_imageUrl(self, value):
        """Validate imageUrl format if provided"""
        if value and not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("Image URL must start with http:// or https://")
        return value
    
    def validate_tags(self, value):
        """Validate tags is a list of strings"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Tags must be a list.")
        # Clean and validate each tag
        cleaned_tags = []
        for tag in value:
            if not isinstance(tag, str):
                raise serializers.ValidationError("Each tag must be a string.")
            cleaned_tag = tag.strip()
            if cleaned_tag:  # Only add non-empty tags
                cleaned_tags.append(cleaned_tag)
        return cleaned_tags

