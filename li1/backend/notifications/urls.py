"""
URLs pour l'application notifications
"""
from django.urls import path
from .views import (
    NotificationListView, 
    UnreadNotificationListView, 
    MarkAsReadView, 
    MarkAllAsReadView,
    NotificationCreateView
)

urlpatterns = [
    path('my/', NotificationListView.as_view(), name='my-notifications'),
    path('my/unread/', UnreadNotificationListView.as_view(), name='unread-notifications'),
    path('mark-as-read/', MarkAsReadView.as_view(), name='mark-as-read'),
    path('mark-all-as-read/', MarkAllAsReadView.as_view(), name='mark-all-as-read'),
    path('send/', NotificationCreateView.as_view(), name='send-notification'),
]