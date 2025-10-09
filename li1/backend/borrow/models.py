from django.db import models

# Create your models here.
"""
Modèles pour la gestion des emprunts et réservations
"""
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from users.models import User
from books.models import Book


class Borrow(models.Model):
    """
    Modèle pour les emprunts de livres
    """
    class Status(models.TextChoices):
        BORROWED = 'BORROWED', _('Emprunté')
        RETURNED = 'RETURNED', _('Retourné')
        OVERDUE = 'OVERDUE', _('En retard')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='borrows', verbose_name=_('Utilisateur'))
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='borrows', verbose_name=_('Livre'))
    borrow_date = models.DateTimeField(default=timezone.now, verbose_name=_("Date d'emprunt"))
    due_date = models.DateTimeField(verbose_name=_('Date de retour prévue'))
    return_date = models.DateTimeField(null=True, blank=True, verbose_name=_('Date de retour effective'))
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.BORROWED,
        verbose_name=_('Statut')
    )
    renewed = models.BooleanField(default=False, verbose_name=_('Renouvelé'))
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de création'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Date de modification'))
    
    class Meta:
        verbose_name = _('Emprunt')
        verbose_name_plural = _('Emprunts')
        ordering = ['-borrow_date']
    
    def __str__(self):
        return f"{self.user.username} - {self.book.title}"
    
    def save(self, *args, **kwargs):
        # Mettre à jour le statut si le livre est retourné
        if self.return_date and self.status != self.Status.RETURNED:
            self.status = self.Status.RETURNED
        
        # Vérifier si l'emprunt est en retard
        elif not self.return_date and timezone.now() > self.due_date and self.status != self.Status.OVERDUE:
            self.status = self.Status.OVERDUE
        
        super().save(*args, **kwargs)
        
        # Mettre à jour le statut du livre
        if self.status == self.Status.BORROWED and self.book.status != Book.Status.BORROWED:
            self.book.status = Book.Status.BORROWED
            self.book.available_copies -= 1
            self.book.save()
        elif self.status == self.Status.RETURNED and self.book.available_copies < self.book.total_copies:
            self.book.status = Book.Status.AVAILABLE if self.book.available_copies > 0 else Book.Status.BORROWED
            self.book.available_copies += 1
            self.book.save()


class Reservation(models.Model):
    """
    Modèle pour les réservations de livres
    """
    class Status(models.TextChoices):
        PENDING = 'PENDING', _('En attente')
        READY = 'READY', _('Prêt à être récupéré')
        CANCELLED = 'CANCELLED', _('Annulé')
        COMPLETED = 'COMPLETED', _('Complété')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations', verbose_name=_('Utilisateur'))
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reservations', verbose_name=_('Livre'))
    reservation_date = models.DateTimeField(default=timezone.now, verbose_name=_('Date de réservation'))
    expiry_date = models.DateTimeField(verbose_name=_("Date d'expiration"))
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        verbose_name=_('Statut')
    )
    notification_sent = models.BooleanField(default=False, verbose_name=_('Notification envoyée'))
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de création'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Date de modification'))
    
    class Meta:
        verbose_name = _('Réservation')
        verbose_name_plural = _('Réservations')
        ordering = ['reservation_date']
        unique_together = ['user', 'book']
    
    def __str__(self):
        return f"{self.user.username} - {self.book.title}"
    
    def save(self, *args, **kwargs):
        # Mettre à jour le statut du livre si nécessaire
        if self.status == self.Status.PENDING and self.book.status != Book.Status.RESERVED:
            self.book.status = Book.Status.RESERVED
            self.book.save()
        
        super().save(*args, **kwargs)