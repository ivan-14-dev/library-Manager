"""
Modèles pour la gestion du catalogue de livres et des livres personnels des utilisateurs
Ce fichier contient les modèles Django pour les livres, les auteurs, les catégories,
et les livres personnels rédigés par les utilisateurs.

Chaque modèle inclut des champs pertinents, des relations, et des méthodes pour gérer
les données associées.

Les modèles sont conçus pour être extensibles et maintenables, avec une attention particulière
à la localisation et à la gestion des statuts.

Les modeles inclus sont :
- Author : Représente un auteur de livre.
    Prend en charge les informations biographiques de l'auteur.
    nom, prénom, biographie, dates de naissance et de décès.
- Category : Représente une catégorie de livre.
    Prend en charge le nom et la description de la catégorie.
    nom, description.
- Book : Représente un livre dans le catalogue.
    Prend en charge les informations bibliographiques du livre.
    ISBN, titre, auteurs, catégories, éditeur, date de publication, langue, nombre de pages, description, image de couverture, statut.
- PersonalBook : Représente un livre personnel rédigé par un utilisateur.
    Prend en charge les informations sur le livre personnel.
    auteur (utilisateur), titre, contenu, résumé, image de couverture, statut, public/privé, statistiques de texte, fichier PDF.

"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from pytz import timezone
from django.conf import settings
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
    

class SubCategory(models.Model):
    """ Modelel qui gere les sub categorie"""
    name = models.CharField(max_length=100, unique=True,verbose_name=_('Nom'))
    description = models.TextField(blank=True,verbose_name=_('Description'))
    categories = models.ForeignKey(Category,on_delete= models.CASCADE ,related_name=_("subCategorie"), verbose_name=_("subCategorie"))
    created_at = models.DateTimeField(auto_now_add=True,verbose_name=_("Date de creation"))
    updated_at = models.DateTimeField(auto_now_add = True, verbose_name=_("Date de modification"))

    class Meta : 
        verbose_name = _('Subcategories')
        verbose_name_plural = _('SubCategories')
        ordering = ['name']

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
    document = models.FileField(upload_to='books_files/', null=True, blank=True, verbose_name=_('PDF_files'))
    total_copies = models.PositiveIntegerField(default=1, verbose_name=_('Exemplaires totaux'))
    available_copies = models.PositiveIntegerField(default=1, verbose_name=_('Exemplaires disponibles'))
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de création'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Date de modification'))

    can_download = models.BooleanField(default=False, verbose_name=_('Peut télécharger')) # Ajout du champ pour gérer les permissions de téléchargement
    
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
        DELETED = 'DELETED', _('Supprimé')
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='personal_books', verbose_name=_('Auteur'))
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
    document = models.FileField(upload_to='personal_book_files/', null=True, blank=True, verbose_name=_('Fichier PDF'))
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de création'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Date de modification'))
    published_at = models.DateTimeField(null=True, blank=True, verbose_name=_('Date de publication'))

    can_download = models.BooleanField(default=False, verbose_name=_('Peut télécharger')) # Ajout du champ pour gérer les permissions de téléchargement
    
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
    


##############################################################
# Classe des Articles


class Article(models.Model):
    class Status(models.TextChoices):
        AVAILABLE = 'AVAILABLE', _('Disponible')
        BORROWED = 'BORROWED', _('Emprunté')
        RESERVED = 'RESERVED', _('Réservé')
        MAINTENANCE = 'MAINTENANCE', _('En maintenance')

    title = models.CharField(max_length=200, verbose_name=_('Titre'))
    authors = models.ManyToManyField(Author, related_name='articles', verbose_name=_('Auteurs'))
    categories = models.ManyToManyField(Category, related_name='articles', verbose_name=_('Catégories'))
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
    is_public = models.BooleanField(default=False, verbose_name=_('Public'))
    word_count = models.PositiveIntegerField(default=0, verbose_name=_('Nombre de mots'))
    character_count = models.PositiveIntegerField(default=0, verbose_name=_('Nombre de caractères'))
    document = models.FileField(upload_to='books_files/articles/', null=True, blank=True, verbose_name=_('PDF_files'))
    content = models.TextField(verbose_name=_('Contenu'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de création'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Date de modification'))

    can_download = models.BooleanField(default=False, verbose_name=_('Peut télécharger')) # Ajout du champ pour gérer les permissions de téléchargement
    
    class Meta:
        verbose_name = _('Article')
        verbose_name_plural = _('Articles')
        ordering = ['title','-created_at']
    
    def __str__(self):
        return self.title
    
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
        words_per_minute = 200  # Vitesse de lecture moyenne, juste une estimation pour les articles 
        return max(1, round(self.word_count / words_per_minute))
        



# Classe de creation des Ebooks 
class Ebook (models.Model):
    class Status(models.TextChoices):
        AVAILABLE = 'AVAILABLE', _('Disponible')
        BORROWED = 'BORROWED', _('Emprunté')
        RESERVED = 'RESERVED', _('Réservé')
        MAINTENANCE = 'MAINTENANCE', _('En maintenance')

    title = models.CharField(max_length=200, verbose_name=_('Ebook'))
    authors = models.ManyToManyField(Author, related_name='ebooks', verbose_name=_('Auteurs'))
    categories = models.ManyToManyField(Category, related_name='ebooks', verbose_name=_('Catégories'))
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
    document = models.FileField(upload_to='books_files/ebooks/', null=True, blank=True, verbose_name=_('PDF_files'))
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de création'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Date de modification'))

    can_download = models.BooleanField(default=False, verbose_name=_('Peut télécharger')) # Ajout du champ pour gérer les permissions de téléchargement
    
    class Meta:
        verbose_name = _('Article')
        verbose_name_plural = _('Articles')
        ordering = ['title']
    
    def __str__(self):
        return self.title
    

# Ajout des models Open Sources 
class OpenSourceFiles(models.Model):
    title = models.CharField(max_length=200, verbose_name=_('OpenSource'))
    authors = models.ManyToManyField(Author, related_name='open_sources', verbose_name=_('Auteurs'))
    categories = models.ManyToManyField(Category, related_name='open_sources', verbose_name=_('Catégories'))
    publication_date = models.DateField(null=True, blank=True, verbose_name=_('Date de publication'))
    language = models.CharField(max_length=50, default='Français', verbose_name=_('Langue'))
    pages = models.PositiveIntegerField(null=True, blank=True, verbose_name=_('Nombre de pages'))
    description = models.TextField(blank=True, verbose_name=_('Description'))
    cover_image = models.ImageField(upload_to='book_covers/', null=True, blank=True, verbose_name=_('Image de couverture'))
    document = models.FileField(upload_to='books_files/opensources/', null=True, blank=True, verbose_name=_('PDF_files'))
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de création'))
    can_download = models.BooleanField(default=True, verbose_name=_('Peut télécharger')) # Ajout du champ pour gérer les permissions de téléchargement

    class Meta:
        verbose_name = _('Article')
        verbose_name_plural = _('Articles')
        ordering = ['title']
    
    def __str__(self):
        return self.title
    

# Classe de gestion des thèses et mémoires
class Thesis(models.Model):
    class Status(models.TextChoices): # classe de gestions des statuts
        AVAILABLE = 'AVAILABLE', _('Disponible')  # These disponible
        BORROWED = 'BORROWED', _('Emprunté')      # These empruntee
        RESERVED = 'RESERVED', _('Réservé')       # These reserver
        MAINTENANCE = 'MAINTENANCE', _('En maintenance') # En cours de modification

    title = models.CharField(max_length=200, verbose_name=_('Thèse'))   # Titre de la these 
    authors = models.ManyToManyField(Author, related_name='theses', verbose_name=_('Auteurs'))  # Auteur de la these
    categories = models.ManyToManyField(Category, related_name='theses', verbose_name=_('Catégories')) # Categories 
    publication_date = models.DateField(null=True, blank=True, verbose_name=_('Date de publication'))  # Date de publication 
    language = models.CharField(max_length=50, default='Français', verbose_name=_('Langue')) # langue utilisee
    pages = models.PositiveIntegerField(null=True, blank=True, verbose_name=_('Nombre de pages')) # nombre de page
    description = models.TextField(blank=True, verbose_name=_('Description')) # description sur les theses 
    cover_image = models.ImageField(upload_to='book_covers/', null=True, blank=True, verbose_name=_('Image de couverture')) # pages de couverture
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.AVAILABLE,
        verbose_name=_('Statut')
    )
    document = models.FileField(upload_to='books_files/theses/', null=True, blank=True, verbose_name=_('PDF_files')) # document en question renger dans les theses
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de création')) # date de creations
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Date de modification')) # date de mise a jour
    
    can_download = models.BooleanField(default=False, verbose_name=_('Peut télécharger')) # Ajout du champ pour gérer les permissions de téléchargement
    
    class Meta:
        verbose_name = _('Thèse')
        verbose_name_plural = _('Thèses')
        ordering = ['title']
    
    def __str__(self):
        return self.title
    

class File(models.Model):
    FILE_TYPES = (
        ('PDF', 'PDF Document'),
        ('IMAGE', 'Image File'),
        ('OTHER', 'Other'),
    )

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='files' # Utilisateur qui a téléversé le fichier dans la base de données
    )                                                                                # Utilisateur qui a téléversé le fichier dans la base de données
    file = models.FileField(upload_to='uploads/uploaded_files/')  # Fichier téléversé ou stocké
    name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=10, choices=FILE_TYPES, default='OTHER')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    if file_type == 'OTHER':
        category = models.ForeignKey(Category, related_name='category',verbose_name=_('Category'))
    

    def __str__(self):
        return self.name