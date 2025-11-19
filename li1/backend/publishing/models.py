"""
Models for publishing system functionality
"""
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator


class PublicationRequest(models.Model):
    """
    Requests for publishing personal books
    """
    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending Review')
        UNDER_REVIEW = 'UNDER_REVIEW', _('Under Review')
        APPROVED = 'APPROVED', _('Approved')
        REJECTED = 'REJECTED', _('Rejected')
        PUBLISHED = 'PUBLISHED', _('Published')

    personal_book = models.OneToOneField('books.PersonalBook', on_delete=models.CASCADE, related_name='publication_request')
    requested_by = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='publication_requests')
    submission_notes = models.TextField(blank=True, verbose_name=_('Submission Notes'))
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    # Review information
    reviewed_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_requests')
    review_notes = models.TextField(blank=True, verbose_name=_('Review Notes'))
    reviewed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Publication Request')
        verbose_name_plural = _('Publication Requests')
        ordering = ['-created_at']

    def __str__(self):
        return f"Publication Request: {self.personal_book.title}"


class Review(models.Model):
    """
    Detailed reviews for publication requests
    """
    class ReviewType(models.TextChoices):
        EDITORIAL = 'EDITORIAL', _('Editorial Review')
        PEER = 'PEER', _('Peer Review')
        COMMUNITY = 'COMMUNITY', _('Community Review')

    publication_request = models.ForeignKey(PublicationRequest, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='given_reviews')
    review_type = models.CharField(max_length=20, choices=ReviewType.choices, default=ReviewType.EDITORIAL)

    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], verbose_name=_('Rating'))
    content = models.TextField(verbose_name=_('Review Content'))
    recommendations = models.TextField(blank=True, verbose_name=_('Recommendations'))

    is_public = models.BooleanField(default=False, verbose_name=_('Public Review'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Review')
        verbose_name_plural = _('Reviews')
        ordering = ['-created_at']
        unique_together = ['publication_request', 'reviewer']

    def __str__(self):
        return f"Review by {self.reviewer.username} for {self.publication_request.personal_book.title}"


class PublicationStatus(models.Model):
    """
    Tracks publication workflow status
    """
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', _('Draft')
        SUBMITTED = 'SUBMITTED', _('Submitted')
        REVIEWING = 'REVIEWING', _('Reviewing')
        EDITING = 'EDITING', _('Editing')
        FORMATTING = 'FORMATTING', _('Formatting')
        APPROVED = 'APPROVED', _('Approved')
        PUBLISHED = 'PUBLISHED', _('Published')
        REJECTED = 'REJECTED', _('Rejected')

    publication_request = models.OneToOneField(PublicationRequest, on_delete=models.CASCADE, related_name='status_tracking')
    current_status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    status_history = models.JSONField(default=list, help_text="History of status changes")

    # Assignment information
    assigned_editor = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_publications')
    target_publish_date = models.DateField(null=True, blank=True)
    actual_publish_date = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Publication Status')
        verbose_name_plural = _('Publication Statuses')

    def __str__(self):
        return f"Status: {self.current_status} for {self.publication_request.personal_book.title}"


class Community(models.Model):
    """
    Online communities for writers and readers
    """
    name = models.CharField(max_length=200, verbose_name=_('Community Name'))
    description = models.TextField(blank=True, verbose_name=_('Description'))
    creator = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='created_communities')
    is_private = models.BooleanField(default=False, verbose_name=_('Private Community'))
    max_members = models.PositiveIntegerField(default=1000, verbose_name=_('Max Members'))

    rules = models.TextField(blank=True, verbose_name=_('Community Rules'))
    tags = models.JSONField(default=list, help_text="Community tags/categories")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Community')
        verbose_name_plural = _('Communities')
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class FriendCircle(models.Model):
    """
    Private sharing circles for close friends
    """
    name = models.CharField(max_length=200, verbose_name=_('Circle Name'))
    description = models.TextField(blank=True, verbose_name=_('Description'))
    creator = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='created_circles')
    is_private = models.BooleanField(default=True, verbose_name=_('Private Circle'))

    # Members
    members = models.ManyToManyField('users.User', related_name='friend_circles', through='CircleMembership', through_fields=('circle', 'user'))

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Friend Circle')
        verbose_name_plural = _('Friend Circles')
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class CircleMembership(models.Model):
    """
    Membership in friend circles
    """
    circle = models.ForeignKey(FriendCircle, on_delete=models.CASCADE)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    invited_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='circle_invitations')

    class Meta:
        unique_together = ['circle', 'user']
        verbose_name = _('Circle Membership')
        verbose_name_plural = _('Circle Memberships')

    def __str__(self):
        return f"{self.user.username} in {self.circle.name}"
