from django.contrib import admin
from .models import Notification, Message, ReadingReport, BookRating


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['title', 'message', 'user__username']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['sender', 'receiver', 'content_preview', 'timestamp', 'is_read']
    list_filter = ['is_read', 'timestamp']
    search_fields = ['content', 'sender__username', 'receiver__username']
    readonly_fields = ['timestamp']
    date_hierarchy = 'timestamp'
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content'


@admin.register(ReadingReport)
class ReadingReportAdmin(admin.ModelAdmin):
    list_display = ['user', 'book', 'content_preview', 'created_at']
    list_filter = ['created_at', 'book']
    search_fields = ['content', 'user__username', 'book__title']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content'


@admin.register(BookRating)
class BookRatingAdmin(admin.ModelAdmin):
    list_display = ['user', 'book', 'rating', 'created_at']
    list_filter = ['rating', 'created_at', 'book']
    search_fields = ['comment', 'user__username', 'book__title']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'