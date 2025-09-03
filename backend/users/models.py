"""
Modèles pour la gestion des utilisateurs et rôles
"""
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Modèle utilisateur personnalisé avec rôles
    """
    class Role(models.TextChoices):
        VISITOR = 'VISITOR', _('Visiteur')
        STUDENT = 'STUDENT', _('Étudiant')
        PROFESSOR = 'PROFESSOR', _('Professeur')
        LIBRARIAN = 'LIBRARIAN', _('Bibliothécaire')
        ADMIN = 'ADMIN', _('Administrateur')
    
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.VISITOR,
        verbose_name=_('Rôle')
    )
    
    # Informations supplémentaires
    phone = models.CharField(max_length=20, blank=True, verbose_name=_('Téléphone'))
    address = models.TextField(blank=True, verbose_name=_('Adresse'))
    date_of_birth = models.DateField(null=True, blank=True, verbose_name=_('Date de naissance'))
    student_id = models.CharField(max_length=20, blank=True, verbose_name=_('Numéro étudiant'))
    department = models.CharField(max_length=100, blank=True, verbose_name=_('Département'))
    
    # Préférences
    email_notifications = models.BooleanField(default=True, verbose_name=_('Notifications par email'))
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de création'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Date de modification'))
    
    class Meta:
        verbose_name = _('Utilisateur')
        verbose_name_plural = _('Utilisateurs')
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    def is_student(self):
        return self.role == self.Role.STUDENT
    
    def is_professor(self):
        return self.role == self.Role.PROFESSOR
    
    def is_librarian(self):
        return self.role in [self.Role.LIBRARIAN, self.Role.ADMIN]
    
    def is_admin(self):
        return self.role == self.Role.ADMIN