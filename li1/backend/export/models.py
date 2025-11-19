"""
Models for export functionality
"""
from django.db import models
from django.utils.translation import gettext_lazy as _


class ExportJob(models.Model):
    """
    Gestion des jobs d'exportation asynchrones
    """
    FORMAT_CHOICES = [
        ('pdf', 'PDF'),
        ('docx', 'DOCX'),
        ('html', 'HTML'),
        ('markdown', 'Markdown'),
        ('epub', 'EPUB'),
        ('txt', 'Plain Text'),
    ]

    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('processing', 'En traitement'),
        ('completed', 'Terminé'),
        ('failed', 'Échec'),
    ]

    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='export_jobs')
    document = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='export_jobs')
    export_format = models.CharField(max_length=10, choices=FORMAT_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    file_path = models.CharField(max_length=500, blank=True, null=True)
    options = models.JSONField(default=dict, help_text="Options d'exportation")
    progress = models.IntegerField(default=0, help_text="Progression en pourcentage")
    error_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'export_jobs_new'
        verbose_name = 'Job d\'Export'
        verbose_name_plural = 'Jobs d\'Export'
        ordering = ['-created_at']

    def __str__(self):
        return f"Export {self.export_format} - {self.document.title}"


class ExportFormat(models.Model):
    """
    Available export formats with their configurations
    """
    name = models.CharField(max_length=50, unique=True, verbose_name=_('Format Name'))
    display_name = models.CharField(max_length=100, verbose_name=_('Display Name'))
    file_extension = models.CharField(max_length=10, verbose_name=_('File Extension'))
    description = models.TextField(blank=True, verbose_name=_('Description'))

    # Configuration
    is_active = models.BooleanField(default=True, verbose_name=_('Is Active'))
    requires_premium = models.BooleanField(default=False, verbose_name=_('Requires Premium'))
    max_file_size_mb = models.PositiveIntegerField(default=50, verbose_name=_('Max File Size (MB)'))

    # Template and styling options
    default_template = models.CharField(max_length=100, blank=True, verbose_name=_('Default Template'))
    supported_features = models.JSONField(default=list, help_text="Supported features for this format")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Export Format')
        verbose_name_plural = _('Export Formats')
        ordering = ['name']

    def __str__(self):
        return self.display_name
