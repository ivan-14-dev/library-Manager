"""
Modèles pour la gestion du catalogue de livres
"""
from django.db import models
from django.utils.translation import gettext_lazy as _


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