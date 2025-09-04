"""
Modèles pour la gestion des paiements d'amendes
"""
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from users.models import User


class Payment(models.Model):
    """
    Modèle pour les paiements d'amendes
    """
    class Status(models.TextChoices):
        PENDING = 'PENDING', _('En attente')
        COMPLETED = 'COMPLETED', _('Complété')
        FAILED = 'FAILED', _('Échoué')
        REFUNDED = 'REFUNDED', _('Remboursé')
    
    class Method(models.TextChoices):
        CARD = 'CARD', _('Carte bancaire')
        CASH = 'CASH', _('Espèces')
        TRANSFER = 'TRANSFER', _('Virement')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments', verbose_name=_('Utilisateur'))
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name=_('Montant'))
    description = models.TextField(verbose_name=_('Description'))
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        verbose_name=_('Statut')
    )
    payment_method = models.CharField(
        max_length=20,
        choices=Method.choices,
        default=Method.CARD,
        verbose_name=_('Méthode de paiement')
    )
    stripe_payment_intent_id = models.CharField(max_length=100, blank=True, verbose_name=_('ID de paiement Stripe'))
    paid_at = models.DateTimeField(null=True, blank=True, verbose_name=_('Payé à'))
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de création'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Date de modification'))
    
    class Meta:
        verbose_name = _('Paiement')
        verbose_name_plural = _('Paiements')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.amount}€"
    
    def mark_as_paid(self, payment_intent_id=None):
        """
        Marquer le paiement comme complété
        """
        if self.status != self.Status.COMPLETED:
            self.status = self.Status.COMPLETED
            self.paid_at = timezone.now()
            if payment_intent_id:
                self.stripe_payment_intent_id = payment_intent_id
            self.save()
    
    def mark_as_failed(self):
        """
        Marquer le paiement comme échoué
        """
        if self.status != self.Status.FAILED:
            self.status = self.Status.FAILED
            self.save()