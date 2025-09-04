from django.shortcuts import render

# Create your views here.
"""
Vues pour la gestion des livres
"""
from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.translation import gettext_lazy as _
from .models import Book, Author, Category, PersonalBook
from .serializers import (
    BookSerializer, 
    BookDetailSerializer, 
    BookCreateUpdateSerializer,
    AuthorSerializer,
    CategorySerializer,
    PersonalBookCreateSerializer,
    PersonalBookSerializer,
    PersonalBookUpdateSerializer
)


class BookListView(generics.ListAPIView):
    """
    Vue pour lister les livres (accessible à tous)
    """
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categories', 'language', 'status']
    search_fields = ['title', 'isbn', 'authors__first_name', 'authors__last_name', 'publisher']
    ordering_fields = ['title', 'publication_date', 'created_at']
    ordering = ['title']


class BookDetailView(generics.RetrieveAPIView):
    """
    Vue pour les détails d'un livre (accessible à tous)
    """
    queryset = Book.objects.all()
    serializer_class = BookDetailSerializer
    permission_classes = [permissions.AllowAny]


class BookCreateView(generics.CreateAPIView):
    """
    Vue pour créer un livre (bibliothécaires et admins seulement)
    """
    queryset = Book.objects.all()
    serializer_class = BookCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class BookUpdateView(generics.UpdateAPIView):
    """
    Vue pour modifier un livre (bibliothécaires et admins seulement)
    """
    queryset = Book.objects.all()
    serializer_class = BookCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class BookDeleteView(generics.DestroyAPIView):
    """
    Vue pour supprimer un livre (admins seulement)
    """
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class AuthorListView(generics.ListAPIView):
    """
    Vue pour lister les auteurs (accessible à tous)
    """
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name']
    ordering_fields = ['last_name', 'first_name']
    ordering = ['last_name']


class CategoryListView(generics.ListAPIView):
    """
    Vue pour lister les catégories (accessible à tous)
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']
    ordering = ['name']


class PersonalBookListView(generics.ListCreateAPIView):
    """
    Vue pour lister et créer des livres personnels
    """
    serializer_class = PersonalBookSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'summary']
    ordering_fields = ['title', 'created_at', 'updated_at', 'word_count']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return PersonalBook.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PersonalBookCreateSerializer
        return PersonalBookSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PersonalBookDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour les détails d'un livre personnel
    """
    serializer_class = PersonalBookSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PersonalBook.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return PersonalBookUpdateSerializer
        return PersonalBookSerializer


class PublicPersonalBookListView(generics.ListAPIView):
    """
    Vue pour lister les livres personnels publics
    """
    serializer_class = PersonalBookSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'summary', 'user__username']
    ordering_fields = ['title', 'published_at', 'word_count']
    ordering = ['-published_at']
    
    def get_queryset(self):
        return PersonalBook.objects.filter(
            status=PersonalBook.Status.PUBLISHED,
            is_public=True
        )


class PublicPersonalBookDetailView(generics.RetrieveAPIView):
    """
    Vue pour les détails d'un livre personnel public
    """
    serializer_class = PersonalBookSerializer
    permission_classes = [permissions.AllowAny]
    queryset = PersonalBook.objects.filter(
        status=PersonalBook.Status.PUBLISHED,
        is_public=True
    )