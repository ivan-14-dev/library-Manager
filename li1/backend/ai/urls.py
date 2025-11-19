"""
URLs pour l'application AI
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'conversations', views.AIConversationViewSet, basename='aiconversation')
router.register(r'messages', views.AIMessageViewSet, basename='aimessage')
router.register(r'usage-tracking', views.AIUsageTrackingViewSet, basename='aiusagetracking')

urlpatterns = [
    path('', include(router.urls)),
    path('help/', views.AIHelpView.as_view(), name='ai-help'),
    path('writing-assistant/', views.AIWritingAssistantView.as_view(), name='ai-writing-assistant'),
]