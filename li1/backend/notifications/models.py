"""
Modèles pour la gestion des notifications
"""
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from users.models import User


class Notification(models.Model):
    """
    Modèle pour les notifications
    """
    class Type(models.TextChoices):
        INFO = 'INFO', _('Information')
        WARNING = 'WARNING', _('Avertissement')
        ALERT = 'ALERT', _('Alerte')
        SUCCESS = 'SUCCESS', _('Succès')
    
    class Status(models.TextChoices):
        UNREAD = 'UNREAD', _('Non lu')
        READ = 'READ', _('Lu')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications', verbose_name=_('Utilisateur'))
    title = models.CharField(max_length=200, verbose_name=_('Titre'))
    message = models.TextField(verbose_name=_('Message'))
    notification_type = models.CharField(
        max_length=20,
        choices=Type.choices,
        default=Type.INFO,
        verbose_name=_('Type de notification')
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.UNREAD,
        verbose_name=_('Statut')
    )
    related_url = models.URLField(blank=True, verbose_name=_('URL liée'))
    sent_at = models.DateTimeField(default=timezone.now, verbose_name=_('Envoyé à'))
    read_at = models.DateTimeField(null=True, blank=True, verbose_name=_('Lu à'))
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de création'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Date de modification'))
    
    class Meta:
        verbose_name = _('Notification')
        verbose_name_plural = _('Notifications')
        ordering = ['-sent_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"
    
    def mark_as_read(self):
        """
        Marquer la notification comme lue
        """
        if self.status != self.Status.READ:
            self.status = self.Status.READ
            self.read_at = timezone.now()
            self.save()