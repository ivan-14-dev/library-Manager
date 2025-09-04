"""
URLs pour l'application books
"""
from django.urls import path
from .views import (
    BookListView, BookDetailView, BookCreateView, 
    BookUpdateView, BookDeleteView, AuthorListView, CategoryListView,
    PersonalBookListView, PersonalBookDetailView,
    PublicPersonalBookListView, PublicPersonalBookDetailView
)

urlpatterns = [
    path('', BookListView.as_view(), name='book-list'),
    path('<int:pk>/', BookDetailView.as_view(), name='book-detail'),
    path('create/', BookCreateView.as_view(), name='book-create'),
    path('<int:pk>/update/', BookUpdateView.as_view(), name='book-update'),
    path('<int:pk>/delete/', BookDeleteView.as_view(), name='book-delete'),
    path('authors/', AuthorListView.as_view(), name='author-list'),
    path('categories/', CategoryListView.as_view(), name='category-list'),

    # Livres personnels
    path('personal/', PersonalBookListView.as_view(), name='personal-books'),
   path('personal/<int:pk>/', PersonalBookDetailView.as_view(), name='personal-book-detail'),
    path('personal/public/', PublicPersonalBookListView.as_view(), name='public-personal-books'),
    path('personal/public/<int:pk>/', PublicPersonalBookDetailView.as_view(), name='public-personal-book-detail'),
]