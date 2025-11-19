"""
URLs pour l'application books
"""
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from .views import (
    BookListView, BookDetailView, BookCreateView,
    BookUpdateView, BookDeleteView, AuthorListView, CategoryListView,
    PersonalBookListView, PersonalBookDetailView, PersonalBookShareView, PersonalBookCloneView,
    PublicPersonalBookListView, PublicPersonalBookDetailView, SecureDownloadView, SubCategoryView,
    ArticleViewSet, EbookViewSet, OpenSourceFilesViewSet, ThesisViewSet,
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'articles', ArticleViewSet)
router.register(r'ebooks', EbookViewSet)
router.register(r'opensources', OpenSourceFilesViewSet)
router.register(r'theses', ThesisViewSet)


urlpatterns = [
    path('', BookListView.as_view(), name='book-list'),
    path('<int:pk>/', BookDetailView.as_view(), name='book-detail'),
    path('create/', BookCreateView.as_view(), name='book-create'),
    path('<int:pk>/update/', BookUpdateView.as_view(), name='book-update'),
    path('<int:pk>/delete/', BookDeleteView.as_view(), name='book-delete'),
    path('authors/', AuthorListView.as_view(), name='author-list'),
    path('categories/', CategoryListView.as_view(), name='category-list'),

    path('subcategories/',SubCategoryView.as_view(),name = 'sub-category-list'),

    # Livres personnels
    path('personal/', PersonalBookListView.as_view(), name='personal-books'),
    path('personal/<int:pk>/', PersonalBookDetailView.as_view(), name='personal-book-detail'),
    path('personal/<int:pk>/share/', PersonalBookShareView.as_view(), name='personal-book-share'),
    path('personal/<int:pk>/clone/', PersonalBookCloneView.as_view(), name='personal-book-clone'),
    path('personal/public/', PublicPersonalBookListView.as_view(), name='public-personal-books'),
    path('personal/public/<int:pk>/', PublicPersonalBookDetailView.as_view(), name='public-personal-book-detail'),

    path('files/<str:model_name>/<int:pk>/download/', SecureDownloadView.as_view(), name='secure-download'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
