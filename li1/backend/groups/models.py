"""
Models for groups, clubs, and messaging functionality
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator


class ReadingGroup(models.Model):
    """
    Reading groups for collaborative book discussions
    """
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', _('Active')
        INACTIVE = 'INACTIVE', _('Inactive')
        ARCHIVED = 'ARCHIVED', _('Archived')

    name = models.CharField(max_length=200, verbose_name=_('Group Name'))
    description = models.TextField(blank=True, verbose_name=_('Description'))
    creator = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='created_groups')
    current_book = models.ForeignKey('books.Book', on_delete=models.SET_NULL, null=True, blank=True, related_name='reading_groups')
    max_members = models.PositiveIntegerField(default=50, verbose_name=_('Max Members'))
    is_private = models.BooleanField(default=False, verbose_name=_('Private Group'))
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Reading Group')
        verbose_name_plural = _('Reading Groups')
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class GroupMember(models.Model):
    """
    Membership in reading groups with roles
    """
    class Role(models.TextChoices):
        MEMBER = 'MEMBER', _('Member')
        MODERATOR = 'MODERATOR', _('Moderator')
        ADMIN = 'ADMIN', _('Admin')

    group = models.ForeignKey(ReadingGroup, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='group_memberships')
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.MEMBER)
    joined_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ['group', 'user']
        verbose_name = _('Group Member')
        verbose_name_plural = _('Group Members')
        ordering = ['joined_at']

    def __str__(self):
        return f"{self.user.username} - {self.group.name}"


class Club(models.Model):
    """
    Literary clubs with broader scope than reading groups
    """
    class ClubType(models.TextChoices):
        LITERARY = 'LITERARY', _('Literary Club')
        WRITING = 'WRITING', _('Writing Club')
        BOOK_CLUB = 'BOOK_CLUB', _('Book Club')
        STUDY_GROUP = 'STUDY_GROUP', _('Study Group')

    name = models.CharField(max_length=200, verbose_name=_('Club Name'))
    description = models.TextField(blank=True, verbose_name=_('Description'))
    club_type = models.CharField(max_length=20, choices=ClubType.choices, default=ClubType.BOOK_CLUB)
    founder = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='founded_clubs')
    max_members = models.PositiveIntegerField(default=100, verbose_name=_('Max Members'))
    is_private = models.BooleanField(default=False, verbose_name=_('Private Club'))
    meeting_schedule = models.JSONField(default=dict, help_text="Meeting schedule information")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Club')
        verbose_name_plural = _('Clubs')
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class ClubGroup(models.Model):
    """
    Sub-groups within clubs for specific activities
    """
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='groups')
    name = models.CharField(max_length=200, verbose_name=_('Group Name'))
    description = models.TextField(blank=True, verbose_name=_('Description'))
    leader = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='led_groups')
    max_members = models.PositiveIntegerField(default=20, verbose_name=_('Max Members'))

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Club Group')
        verbose_name_plural = _('Club Groups')
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {self.club.name}"


class Message(models.Model):
    """
    Messages for groups, clubs, and direct messaging
    """
    class MessageType(models.TextChoices):
        TEXT = 'TEXT', _('Text')
        IMAGE = 'IMAGE', _('Image')
        FILE = 'FILE', _('File')
        SYSTEM = 'SYSTEM', _('System')

    sender = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='sent_group_messages')
    content = models.TextField(verbose_name=_('Content'))
    message_type = models.CharField(max_length=20, choices=MessageType.choices, default=MessageType.TEXT)

    # Polymorphic relationships
    reading_group = models.ForeignKey(ReadingGroup, on_delete=models.CASCADE, null=True, blank=True, related_name='messages')
    club = models.ForeignKey(Club, on_delete=models.CASCADE, null=True, blank=True, related_name='messages')
    club_group = models.ForeignKey(ClubGroup, on_delete=models.CASCADE, null=True, blank=True, related_name='messages')

    # For direct messages
    recipient = models.ForeignKey('users.User', on_delete=models.CASCADE, null=True, blank=True, related_name='received_group_messages')

    is_edited = models.BooleanField(default=False)
    edited_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Message')
        verbose_name_plural = _('Messages')
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['reading_group', 'created_at']),
            models.Index(fields=['club', 'created_at']),
            models.Index(fields=['club_group', 'created_at']),
            models.Index(fields=['sender', 'recipient', 'created_at']),
        ]

    def __str__(self):
        if self.reading_group:
            return f"Group: {self.reading_group.name} - {self.sender.username}"
        elif self.club:
            return f"Club: {self.club.name} - {self.sender.username}"
        elif self.recipient:
            return f"DM: {self.sender.username} -> {self.recipient.username}"
        return f"Message by {self.sender.username}"
