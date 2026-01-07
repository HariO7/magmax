from rest_framework import serializers
from .models import Article, Tag
from django.contrib.auth.models import User


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class ArticleSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        source='tags',
        write_only=True,
        required=False
    )
    tag_names = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False,
        help_text="List of tag names. Tags will be created if they don't exist."
    )
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'body', 'image', 'imageUrl', 'author', 'author_username', 
                  'publish_date', 'published', 'tags', 'tag_ids', 'tag_names', 'created_at', 'updated_at']
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
    
    def create(self, validated_data):
        """Handle tag creation from tag_names"""
        tag_names = validated_data.pop('tag_names', [])
        tag_ids = validated_data.pop('tags', [])
        
        article = super().create(validated_data)
        
        # Add tags by IDs if provided
        if tag_ids:
            article.tags.set(tag_ids)
        
        # Create and add tags by names
        if tag_names:
            tag_objects = []
            for tag_name in tag_names:
                tag, created = Tag.objects.get_or_create(name=tag_name.strip())
                tag_objects.append(tag)
            article.tags.add(*tag_objects)
        
        return article
    
    def update(self, instance, validated_data):
        """Handle tag updates from tag_names"""
        tag_names = validated_data.pop('tag_names', None)
        tag_ids = validated_data.pop('tags', None)
        
        article = super().update(instance, validated_data)
        
        # Update tags by IDs if provided
        if tag_ids is not None:
            article.tags.set(tag_ids)
        
        # Update tags by names if provided
        if tag_names is not None:
            tag_objects = []
            for tag_name in tag_names:
                tag, created = Tag.objects.get_or_create(name=tag_name.strip())
                tag_objects.append(tag)
            article.tags.set(tag_objects)
        
        return article

