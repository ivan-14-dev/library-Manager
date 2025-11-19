from django.http import FileResponse
from django.shortcuts import get_object_or_404, render
from django.utils import timezone

# Create your views here.
"""
Vues pour la gestion des livres
"""
from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.translation import gettext_lazy as _
from django.db.models import Q
from .models import (Book, Author, Category,
                     PersonalBook, SubCategory, File, Article,
                     Ebook, OpenSourceFiles, Thesis, Book)
from .serializers import (
    BookSerializer,
    BookDetailSerializer,
    BookCreateUpdateSerializer,
    AuthorSerializer,
    CategorySerializer,
    PersonalBookCreateSerializer,
    PersonalBookSerializer,
    PersonalBookUpdateSerializer,
    SubCategorySerializer,
    FileSerializer,
    ArticleSerializer,
    EbookSerializer,
    OpenSourceFileSerializer,
    ThesisSerializer
)
from users.permissions import (
    IsLibrarianOrAdmin, IsProfessorOrAdmin, IsStudentOrHigher,
    HasActiveSubscription, HasPremiumSubscription
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


class SubCategoryView(generics.CreateAPIView):
    """ Vue qui s'occupe de renvoyer les subcategories"""
    queryset = SubCategory
    serializer_class = SubCategorySerializer
    permission_classes = [permissions.AllowAny]


class BookCreateView(generics.CreateAPIView):
    """
    Vue pour créer un livre (bibliothécaires et admins seulement)
    """
    queryset = Book.objects.all()
    serializer_class = BookCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsLibrarianOrAdmin]


class BookUpdateView(generics.UpdateAPIView):
    """
    Vue pour modifier un livre (bibliothécaires et admins seulement)
    """
    queryset = Book.objects.all()
    serializer_class = BookCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsLibrarianOrAdmin]


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


class PersonalBookShareView(generics.GenericAPIView):
    """
    Vue pour partager/rendre public un livre personnel
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PersonalBookSerializer

    def post(self, request, pk):
        try:
            book = PersonalBook.objects.get(pk=pk, user=request.user)
        except PersonalBook.DoesNotExist:
            return Response(
                {'error': 'Livre non trouvé ou accès non autorisé'},
                status=status.HTTP_404_NOT_FOUND
            )

        is_public = request.data.get('is_public', False)
        book.is_public = is_public

        if is_public and book.status != PersonalBook.Status.PUBLISHED:
            book.status = PersonalBook.Status.PUBLISHED
            book.published_at = timezone.now()

        book.save()

        serializer = self.get_serializer(book)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PersonalBookCloneView(generics.GenericAPIView):
    """
    Vue pour cloner un livre personnel public
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PersonalBookSerializer

    def post(self, request, pk):
        try:
            original_book = PersonalBook.objects.get(
                pk=pk,
                is_public=True,
                status=PersonalBook.Status.PUBLISHED
            )
        except PersonalBook.DoesNotExist:
            return Response(
                {'error': 'Livre non trouvé ou non disponible pour clonage'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Créer une copie
        cloned_book = PersonalBook.objects.create(
            user=request.user,
            title=f"Copie de {original_book.title}",
            content=original_book.content,
            summary=original_book.summary,
            cover_image=original_book.cover_image,
            status=PersonalBook.Status.DRAFT,
            is_public=False,
            word_count=original_book.word_count,
            character_count=original_book.character_count
        )

        serializer = self.get_serializer(cloned_book)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


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
        return PersonalBook.objects.filter(                 # Permet de renvoyer uniquement les livres Personnel et publier
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


#  Permission personnalisée : seuls les auteurs ou admins peuvent modifier
class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff or request.user.is_superuser


# ViewSet pour les Articles
class ArticleViewSet(generics.ListAPIView):
    queryset = Article.objects.all().order_by('-created_at')
    serializer_class = ArticleSerializer
    permission_classes = [IsAdminOrReadOnly]


# ViewSet pour les Ebooks
class EbookViewSet(generics.ListAPIView):
    queryset = Ebook.objects.all().order_by('-created_at')
    serializer_class = EbookSerializer
    permission_classes = [IsAdminOrReadOnly]


# ViewSet pour les Open Source Files
class OpenSourceFilesViewSet(generics.ListAPIView):
    queryset = OpenSourceFiles.objects.all().order_by('-created_at')
    serializer_class = OpenSourceFileSerializer
    permission_classes = [IsAdminOrReadOnly]


# ViewSet pour les Thèses
class ThesisViewSet(generics.ListAPIView):
    queryset = Thesis.objects.all().order_by('-created_at')
    serializer_class = ThesisSerializer
    permission_classes = [IsAdminOrReadOnly]


# Vue securiser pour les telechargement de fichiers
class SecureDownloadView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FileSerializer

    def get_object(self, model_class, pk):
        """Récupère un objet d'un modèle donné par son ID"""
        return get_object_or_404(model_class, pk=pk)

    def get(self, request, model_name, pk, *args, **kwargs):
        """
        Endpoint : /api/files/<model_name>/<id>/download/
        model_name ∈ ['article', 'ebook', 'thesis', 'opensource', 'file']
        """
        model_map = {
            'article': Article,
            'ebook': Ebook,
            'thesis': Thesis,
            'opensource': OpenSourceFiles,
            'file': File,
            'book': Book
        }

        model_class = model_map.get(model_name)
        if not model_class:
            raise ValueError("Modèle inconnu.")

        obj = self.get_object(model_class, pk)

        # Vérification d'autorisation
        if hasattr(obj, "can_download") and not obj.can_download:
            return Response(
                {"error": "Le téléchargement n'est pas autorisé pour ce fichier."},
                status=403
            )

        if not hasattr(obj, "document") and not hasattr(obj, "file"):
            return Response(
                {"error": "Ce modèle ne contient pas de fichier téléchargeable."},
                status=400
            )

        file_field = getattr(obj, "document", None) or getattr(obj, "file", None)

        if not file_field:
            return Response({"error": "Fichier introuvable."}, status=404)

        return FileResponse(
            file_field.open("rb"),
            as_attachment=True,
            filename=file_field.name.split('/')[-1],
        )