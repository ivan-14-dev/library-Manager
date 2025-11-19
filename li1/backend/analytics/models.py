"""
Models for analytics and tracking functionality
"""
from django.db import models
from django.utils.translation import gettext_lazy as _


class AnalyticsEvent(models.Model):
    """
    Generic analytics event tracking
    """
    class EventType(models.TextChoices):
        PAGE_VIEW = 'PAGE_VIEW', _('Page View')
        BOOK_VIEW = 'BOOK_VIEW', _('Book View')
        DOWNLOAD = 'DOWNLOAD', _('Download')
        SEARCH = 'SEARCH', _('Search')
        USER_ACTION = 'USER_ACTION', _('User Action')
        SYSTEM_EVENT = 'SYSTEM_EVENT', _('System Event')

    user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='analytics_events')
    event_type = models.CharField(max_length=20, choices=EventType.choices)
    event_name = models.CharField(max_length=100, verbose_name=_('Event Name'))
    event_data = models.JSONField(default=dict, help_text="Additional event data")

    # Context
    session_id = models.CharField(max_length=100, blank=True)
    user_agent = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Analytics Event')
        verbose_name_plural = _('Analytics Events')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['event_type', 'created_at']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return f"{self.event_type}: {self.event_name}"


class UserActivity(models.Model):
    """
    Detailed user activity tracking
    """
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=50, verbose_name=_('Activity Type'))
    description = models.TextField(verbose_name=_('Description'))

    # Related objects (polymorphic)
    book = models.ForeignKey('books.Book', on_delete=models.SET_NULL, null=True, blank=True)
    personal_book = models.ForeignKey('books.PersonalBook', on_delete=models.SET_NULL, null=True, blank=True)
    reading_group = models.ForeignKey('groups.ReadingGroup', on_delete=models.SET_NULL, null=True, blank=True)

    metadata = models.JSONField(default=dict, help_text="Additional activity metadata")
    duration = models.DurationField(null=True, blank=True, help_text="Activity duration")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('User Activity')
        verbose_name_plural = _('User Activities')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'activity_type', 'created_at']),
        ]

    def __str__(self):
        return f"{self.user.username}: {self.activity_type}"


class BookAnalytics(models.Model):
    """
    Analytics specific to books
    """
    book = models.OneToOneField('books.Book', on_delete=models.CASCADE, related_name='analytics')

    # View metrics
    total_views = models.PositiveIntegerField(default=0)
    unique_views = models.PositiveIntegerField(default=0)

    # Engagement metrics
    total_downloads = models.PositiveIntegerField(default=0)
    total_borrows = models.PositiveIntegerField(default=0)
    total_reservations = models.PositiveIntegerField(default=0)

    # Rating metrics
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_ratings = models.PositiveIntegerField(default=0)

    # Reading metrics
    average_reading_time = models.DurationField(null=True, blank=True)
    completion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    # Time-based data
    daily_stats = models.JSONField(default=dict, help_text="Daily statistics")
    monthly_stats = models.JSONField(default=dict, help_text="Monthly statistics")

    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Book Analytics')
        verbose_name_plural = _('Book Analytics')

    def __str__(self):
        return f"Analytics for {self.book.title}"


class SalesAnalytics(models.Model):
    """
    Sales and revenue analytics for published books
    """
    personal_book = models.OneToOneField('books.PersonalBook', on_delete=models.CASCADE, related_name='sales_analytics')

    # Sales metrics
    total_sales = models.PositiveIntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    # Pricing
    current_price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    price_history = models.JSONField(default=list, help_text="Price change history")

    # Geographic data
    sales_by_country = models.JSONField(default=dict)
    sales_by_region = models.JSONField(default=dict)

    # Time-based sales
    daily_sales = models.JSONField(default=dict)
    monthly_sales = models.JSONField(default=dict)

    # Performance metrics
    conversion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    average_order_value = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)

    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Sales Analytics')
        verbose_name_plural = _('Sales Analytics')

    def __str__(self):
        return f"Sales Analytics for {self.personal_book.title}"
