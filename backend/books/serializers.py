"""
Sérialiseurs pour la gestion des livres
"""
from rest_framework import serializers
from .models import Book, Author, Category


class AuthorSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les auteurs
    """
    class Meta:
        model = Author
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les catégories
    """
    class Meta:
        model = Category
        fields = '__all__'


class BookSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les livres (liste)
    """
    authors = AuthorSerializer(many=True, read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Book
        fields = (
            'id', 'isbn', 'title', 'authors', 'categories', 'publisher',
            'publication_date', 'language', 'pages', 'cover_image',
            'status', 'total_copies', 'available_copies', 'created_at'
        )


class BookDetailSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les détails d'un livre
    """
    authors = AuthorSerializer(many=True, read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Book
        fields = '__all__'


class BookCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour la création et modification des livres
    """
    class Meta:
        model = Book
        fields = (
            'isbn', 'title', 'authors', 'categories', 'publisher',
            'publication_date', 'language', 'pages', 'description',
            'cover_image', 'total_copies'
        )