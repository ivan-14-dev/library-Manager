"""
Models for AI functionality
"""
from django.db import models
from django.utils.translation import gettext_lazy as _


class AIMessage(models.Model):
    """
    Messages exchanged with AI assistant
    """
    class MessageRole(models.TextChoices):
        USER = 'USER', _('User')
        ASSISTANT = 'ASSISTANT', _('Assistant')
        SYSTEM = 'SYSTEM', _('System')

    conversation = models.ForeignKey('AIConversation', on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=20, choices=MessageRole.choices)
    content = models.TextField(verbose_name=_('Content'))

    # AI-specific metadata
    tokens_used = models.PositiveIntegerField(default=0)
    model_used = models.CharField(max_length=50, default='gpt-3.5-turbo')
    confidence_score = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('AI Message')
        verbose_name_plural = _('AI Messages')
        ordering = ['created_at']

    def __str__(self):
        return f"{self.role}: {self.content[:50]}"


class AIConversation(models.Model):
    """
    Conversations with AI assistant
    """
    class ConversationType(models.TextChoices):
        GENERAL = 'GENERAL', _('General Chat')
        WRITING = 'WRITING', _('Writing Assistance')
        EDITING = 'EDITING', _('Editing Help')
        RESEARCH = 'RESEARCH', _('Research Help')

    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='ai_conversations')
    title = models.CharField(max_length=200, blank=True, verbose_name=_('Conversation Title'))
    conversation_type = models.CharField(max_length=20, choices=ConversationType.choices, default=ConversationType.GENERAL)

    # Context
    related_book = models.ForeignKey('books.PersonalBook', on_delete=models.SET_NULL, null=True, blank=True)
    context_data = models.JSONField(default=dict, help_text="Additional context information")

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_message_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('AI Conversation')
        verbose_name_plural = _('AI Conversations')
        ordering = ['-last_message_at']

    def __str__(self):
        return f"{self.user.username}: {self.title or 'Untitled'}"


class AIUsageTracking(models.Model):
    """
    Tracks AI usage for billing and limits
    """
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='ai_usage')
    date = models.DateField(auto_now_add=True)

    # Usage metrics
    total_tokens = models.PositiveIntegerField(default=0)
    total_requests = models.PositiveIntegerField(default=0)
    total_conversations = models.PositiveIntegerField(default=0)

    # Cost tracking
    estimated_cost = models.DecimalField(max_digits=8, decimal_places=4, default=0.0000)

    # Feature usage
    features_used = models.JSONField(default=dict, help_text="Usage by feature type")

    class Meta:
        verbose_name = _('AI Usage Tracking')
        verbose_name_plural = _('AI Usage Tracking')
        unique_together = ['user', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"AI Usage: {self.user.username} - {self.date}"
