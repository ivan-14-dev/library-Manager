from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'notifications', views.NotificationViewSet, basename='notification')
router.register(r'messages', views.MessageViewSet, basename='message')
router.register(r'reading-reports', views.ReadingReportViewSet, basename='readingreport')
router.register(r'book-ratings', views.BookRatingViewSet, basename='bookrating')

urlpatterns = [
    path('', include(router.urls)),
]

# URLs pour les actions personnalisées
urlpatterns += [
    path('notifications/mark_all_as_read/', 
         views.NotificationViewSet.as_view({'post': 'mark_all_as_read'}), 
         name='notifications-mark-all-read'),

    path('messages/conversations/', 
         views.MessageViewSet.as_view({'get': 'conversations'}), 
         name='messages-conversations'),
]