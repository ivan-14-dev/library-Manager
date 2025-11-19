"""
Sérialiseurs pour la gestion des livres
"""
from rest_framework import serializers


from .models import (Book, Author, Category, 
                     PersonalBook, SubCategory , File, 
                     Article, Ebook, OpenSourceFiles, 
                     Thesis)

from users.serializers import UserProfileSerializer

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

class SubCategorySerializer(serializers.ModelSerializer):
    """ Serialiseur  de la sub categorie pour de  categorie interne """

    categories = CategorySerializer(many = False, read_only = True)
    class Meta:
        model = SubCategory
        fields = '__all__'


class BookSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les livres (liste)
    """
    authors = AuthorSerializer(many=True, read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    file_url = serializers.SerializerMethodField()             # Ajout du champ pour l'URL du fichier
   

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

class PersonalBookSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les livres personnels
    """
    reading_time = serializers.SerializerMethodField()
    user = UserProfileSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()          # champ pour l'URL du fichier
    
    class Meta: 
        model = PersonalBook
        fields = (
            'id', 'user', 'title', 'content', 'summary', 
            'cover_image', 'status', 'is_public', 'word_count',
            'character_count', 'reading_time', 'created_at',
            'updated_at', 'published_at'
        )
        read_only_fields = ('user', 'word_count', 'character_count', 
                           'created_at', 'updated_at', 'published_at')
    
    def get_reading_time(self, obj):
        return obj.get_reading_time()


class PersonalBookCreateSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour créer des livres personnels
    """
    class Meta:
        model = PersonalBook
        fields = ('title', 'content', 'summary', 'cover_image', 'status', 'is_public')
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class PersonalBookUpdateSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour modifier des livres personnels
    """
    class Meta:
        model = PersonalBook
        fields = ('title', 'content', 'summary', 'cover_image', 'status', 'is_public')

########################################################################################################
# Nouvelles classes pour la gestion de fichier (Upload et Download)


# Serializer pour les Articles
class ArticleSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True)
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = '__all__'
        read_only_fields = ['word_count', 'character_count', 'created_at', 'updated_at']


# Serializer pour les Ebooks
class EbookSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True)
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Ebook
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


# Serializer pour les fichiers Open Source
class OpenSourceFileSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True)
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = OpenSourceFiles
        fields = '__all__'
        read_only_fields = ['created_at']


# Serializer pour les Thèses
class ThesisSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True)
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Thesis
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


# Serializer pour les fichiers uploadés
class FileSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.email')

    class Meta:
        model = File
        fields = ['id', 'name', 'file', 'file_type', 'uploaded_by', 'uploaded_at']
        read_only_fields = ['uploaded_by', 'uploaded_at']

    def validate_file(self, value):
        max_size_mb = 20  # Limite de 20 Mo
        if value.size > max_size_mb * 1024 * 1024:
            raise serializers.ValidationError(f"Le fichier dépasse {max_size_mb} Mo.")
        return value