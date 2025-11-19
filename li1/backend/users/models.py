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
        VISITOR = 'VISITOR', _('Visitor')
        STUDENT = 'STUDENT', _('Student')
        PROFESSOR = 'PROFESSOR', _('Professor')
        LIBRARIAN = 'LIBRARIAN', _('Librarian')
        ADMIN = 'ADMIN', _('Administrator')
    
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.VISITOR,
        verbose_name=_('Role')
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
        ordering = ['last_name', 'first_name']
    
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
    
    def is_visitor(self):
        return self.role == self.Role.VISITOR

    @property
    def subscription(self):
        """Retourne l'abonnement actif de l'utilisateur"""
        try:
            return self.user_subscription
        except:
            return None

    def has_active_subscription(self):
        """Vérifie si l'utilisateur a un abonnement actif"""
        subscription = self.subscription
        return subscription and subscription.is_active

    def has_premium_access(self):
        """Vérifie si l'utilisateur a accès aux fonctionnalités premium"""
        subscription = self.subscription
        return subscription and subscription.is_active and subscription.plan_type in ['professor', 'premium']

    def can_access_ai_features(self):
        """Vérifie si l'utilisateur peut accéder aux fonctionnalités IA"""
        if self.has_premium_access():
            return True

        try:
            ai_config = self.ai_configurations.first()
            return ai_config and ai_config.is_active
        except:
            return False

    def get_borrow_limit(self):
        """Retourne la limite d'emprunt selon le rôle"""
        limits = {
            self.Role.VISITOR: 0,
            self.Role.STUDENT: 5,
            self.Role.PROFESSOR: 10,
            self.Role.LIBRARIAN: 15,
            self.Role.ADMIN: 20,
        }
        return limits.get(self.role, 0)

    def get_reservation_limit(self):
        """Retourne la limite de réservation selon le rôle"""
        limits = {
            self.Role.VISITOR: 0,
            self.Role.STUDENT: 3,
            self.Role.PROFESSOR: 5,
            self.Role.LIBRARIAN: 8,
            self.Role.ADMIN: 10,
        }
        return limits.get(self.role, 0)

    def can_publish_books(self):
        """Vérifie si l'utilisateur peut publier des livres"""
        return self.role in [self.Role.PROFESSOR, self.Role.ADMIN] or self.has_premium_access()

    def can_manage_library(self):
        """Vérifie si l'utilisateur peut gérer la bibliothèque"""
        return self.is_librarian()

    def can_manage_users(self):
        """Vérifie si l'utilisateur peut gérer les utilisateurs"""
        return self.is_admin()
    



import uuid

# from django_cryptography.fields import encrypt  # Temporairement désactivé

class UserSubscription(models.Model):
    """
    Gestion des abonnements utilisateurs avec Stripe (chiffré)
    """
    SUBSCRIPTION_PLANS = [
        ('free', 'Gratuit'),
        ('student', 'Étudiant'),
        ('professor', 'Professeur'),
        ('premium', 'Premium'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription')
    plan_type = models.CharField(max_length=20, choices=SUBSCRIPTION_PLANS, default='free')
    stripe_subscription_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True)
    features = models.JSONField(default=dict, help_text="Fonctionnalités activées: {'ai_access': true, 'export_pdf': true}")
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_subscriptions'
        verbose_name = 'Abonnement Utilisateur'
        verbose_name_plural = 'Abonnements Utilisateurs'

    def __str__(self):
        return f"{self.user.username} - {self.plan_type}"

class AIConfiguration(models.Model):
    """
    Configuration de l'IA par utilisateur avec limites d'usage
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_configurations')
    is_active = models.BooleanField(default=False, help_text="Activer/désactiver l'IA pour cet utilisateur")
    allowed_features = models.JSONField(default=list, help_text="Liste des fonctionnalités IA autorisées")
    usage_limits = models.JSONField(default=dict, help_text="Limites d'usage: {'requests_per_day': 100}")
    current_usage = models.JSONField(default=dict, help_text="Usage actuel: {'today_requests': 10}")
    last_reset_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ai_configurations'
        verbose_name = 'Configuration IA'
        verbose_name_plural = 'Configurations IA'
        unique_together = ['user']

    def __str__(self):
        return f"IA Config - {self.user.username}"

class DocumentVersion(models.Model):
    """
    Système de versionning des documents avec historique des modifications
    """
    document = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='versions')
    version_number = models.IntegerField(default=1)
    content = models.TextField(help_text="Contenu de cette version")
    changes = models.TextField(blank=True, help_text="Description des changements depuis la version précédente")
    word_count = models.IntegerField(default=0)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_auto_save = models.BooleanField(default=False, help_text="Version de sauvegarde automatique")

    class Meta:
        db_table = 'document_versions'
        verbose_name = 'Version de Document'
        verbose_name_plural = 'Versions de Documents'
        ordering = ['-version_number']

    def __str__(self):
        return f"v{self.version_number} - {self.document.title}"

class CollaborationSession(models.Model):
    """
    Session de collaboration en temps réel avec WebSocket
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='collaboration_sessions')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_sessions')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'collaboration_sessions'
        verbose_name = 'Session de Collaboration'
        verbose_name_plural = 'Sessions de Collaboration'

    def __str__(self):
        return f"Session - {self.document.title}"

class SessionParticipant(models.Model):
    """
    Participants à une session de collaboration
    """
    ROLE_CHOICES = [
        ('viewer', 'Lecteur'),
        ('commenter', 'Commentateur'),
        ('editor', 'Éditeur'),
    ]

    session = models.ForeignKey(CollaborationSession, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='viewer')
    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)
    cursor_position = models.JSONField(null=True, blank=True, help_text="Position actuelle du curseur")

    class Meta:
        db_table = 'session_participants'
        verbose_name = 'Participant Session'
        verbose_name_plural = 'Participants Sessions'
        unique_together = ['session', 'user']

    def __str__(self):
        return f"{self.user.username} - {self.session}"

class ExportJob(models.Model):
    """
    Gestion des jobs d'exportation asynchrones (legacy - use export.ExportJob instead)
    """
    FORMAT_CHOICES = [
        ('pdf', 'PDF'),
        ('docx', 'DOCX'),
        ('html', 'HTML'),
        ('markdown', 'Markdown'),
    ]

    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('processing', 'En traitement'),
        ('completed', 'Terminé'),
        ('failed', 'Échec'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='legacy_export_jobs')
    document = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='legacy_export_jobs')
    export_format = models.CharField(max_length=10, choices=FORMAT_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    file_path = models.CharField(max_length=500, blank=True, null=True)
    options = models.JSONField(default=dict, help_text="Options d'exportation")
    progress = models.IntegerField(default=0, help_text="Progression en pourcentage")
    error_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'export_jobs_legacy'
        verbose_name = 'Job d\'Export (Legacy)'
        verbose_name_plural = 'Jobs d\'Export (Legacy)'
        ordering = ['-created_at']

    def __str__(self):
        return f"Export {self.export_format} - {self.document.title}"