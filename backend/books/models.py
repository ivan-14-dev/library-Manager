"""
Modèles pour la gestion du catalogue de livres
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from pytz import timezone
from users.models import User


class Author(models.Model):
    """
    Modèle pour les auteurs de livres
    """
    first_name = models.CharField(max_length=100, verbose_name=_('Prénom'))
    last_name = models.CharField(max_length=100, verbose_name=_('Nom'))
    biography = models.TextField(blank=True, verbose_name=_('Biographie'))
    date_of_birth = models.DateField(null=True, blank=True, verbose_name=_('Date de naissance'))
    date_of_death = models.DateField(null=True, blank=True, verbose_name=_('Date de décès'))
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de création'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Date de modification'))
    
    class Meta:
        verbose_name = _('Auteur')
        verbose_name_plural = _('Auteurs')
        ordering = ['last_name', 'first_name']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Category(models.Model):
    """
    Modèle pour les catégories de livres
    """
    name = models.CharField(max_length=100, unique=True, verbose_name=_('Nom'))
    description = models.TextField(blank=True, verbose_name=_('Description'))
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de création'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Date de modification'))
    
    class Meta:
        verbose_name = _('Catégorie')
        verbose_name_plural = _('Catégories')
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Book(models.Model):
    """
    Modèle pour les livres
    """
    class Status(models.TextChoices):
        AVAILABLE = 'AVAILABLE', _('Disponible')
        BORROWED = 'BORROWED', _('Emprunté')
        RESERVED = 'RESERVED', _('Réservé')
        MAINTENANCE = 'MAINTENANCE', _('En maintenance')
    
    isbn = models.CharField(max_length=20, unique=True, verbose_name=_('ISBN'))
    title = models.CharField(max_length=200, verbose_name=_('Titre'))
    authors = models.ManyToManyField(Author, related_name='books', verbose_name=_('Auteurs'))
    categories = models.ManyToManyField(Category, related_name='books', verbose_name=_('Catégories'))
    publisher = models.CharField(max_length=200, blank=True, verbose_name=_('Éditeur'))
    publication_date = models.DateField(null=True, blank=True, verbose_name=_('Date de publication'))
    language = models.CharField(max_length=50, default='Français', verbose_name=_('Langue'))
    pages = models.PositiveIntegerField(null=True, blank=True, verbose_name=_('Nombre de pages'))
    description = models.TextField(blank=True, verbose_name=_('Description'))
    cover_image = models.ImageField(upload_to='book_covers/', null=True, blank=True, verbose_name=_('Image de couverture'))
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.AVAILABLE,
        verbose_name=_('Statut')
    )
    total_copies = models.PositiveIntegerField(default=1, verbose_name=_('Exemplaires totaux'))
    available_copies = models.PositiveIntegerField(default=1, verbose_name=_('Exemplaires disponibles'))
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de création'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Date de modification'))
    
    class Meta:
        verbose_name = _('Livre')
        verbose_name_plural = _('Livres')
        ordering = ['title']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Mettre à jour les copies disponibles si le total change
        if self.pk:
            original = Book.objects.get(pk=self.pk)
            if original.total_copies != self.total_copies:
                difference = self.total_copies - original.total_copies
                self.available_copies += difference
        
        super().save(*args, **kwargs)

class PersonalBook(models.Model):
    """
    Modèle pour les livres personnels rédigés par les utilisateurs
    """
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', _('Brouillon')
        PUBLISHED = 'PUBLISHED', _('Publié')
        ARCHIVED = 'ARCHIVED', _('Archivé')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='personal_books', verbose_name=_('Auteur'))
    title = models.CharField(max_length=200, verbose_name=_('Titre'))
    content = models.TextField(verbose_name=_('Contenu'))
    summary = models.TextField(blank=True, verbose_name=_('Résumé'))
    cover_image = models.ImageField(upload_to='personal_book_covers/', null=True, blank=True, verbose_name=_('Image de couverture'))
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        verbose_name=_('Statut')
    )
    is_public = models.BooleanField(default=False, verbose_name=_('Public'))
    word_count = models.PositiveIntegerField(default=0, verbose_name=_('Nombre de mots'))
    character_count = models.PositiveIntegerField(default=0, verbose_name=_('Nombre de caractères'))
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de création'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Date de modification'))
    published_at = models.DateTimeField(null=True, blank=True, verbose_name=_('Date de publication'))
    
    class Meta:
        verbose_name = _('Livre personnel')
        verbose_name_plural = _('Livres personnels')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"
    
    def save(self, *args, **kwargs):
        # Calculer les statistiques de texte
        self.word_count = len(self.content.split())
        self.character_count = len(self.content)
        
        # Mettre à jour la date de publication si le statut change en PUBLISHED
        if self.status == self.Status.PUBLISHED and not self.published_at:
            self.published_at = timezone.now()
        elif self.status != self.Status.PUBLISHED:
            self.published_at = None
            
        super().save(*args, **kwargs)
    
    def get_reading_time(self):
        """Estimer le temps de lecture en minutes"""
        words_per_minute = 200  # Vitesse de lecture moyenne
        return max(1, round(self.word_count / words_per_minute))