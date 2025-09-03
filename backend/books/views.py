from django.shortcuts import render

# Create your views here.
"""
Vues pour la gestion des livres
"""
from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.translation import gettext_lazy as _
from .models import Book, Author, Category
from .serializers import (
    BookSerializer, 
    BookDetailSerializer, 
    BookCreateUpdateSerializer,
    AuthorSerializer,
    CategorySerializer
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