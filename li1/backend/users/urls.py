"""
URLs pour l'application users
"""
from django.urls import path,include
from .views import (
    RegisterView, LoginView, ProfileView, ProfileUpdateView, LogoutView,
    UserListView, UserDetailView, RoleBasedDashboardView,
    UserSubscriptionViewSet, AIConfigurationViewSet, DocumentVersionViewSet,
    CollaborationSessionViewSet, ExportJobViewSet
)

from rest_framework.routers import DefaultRouter    
from notifications.consumers import CollaborationConsumer
router = DefaultRouter()

router.register(r'subscriptions', UserSubscriptionViewSet, basename='subscription')
router.register(r'ai-configurations', AIConfigurationViewSet, basename='aiconfiguration')
router.register(r'document-versions', DocumentVersionViewSet, basename='documentversion')
router.register(r'collaboration-sessions', CollaborationSessionViewSet, basename='collaborationsession')
router.register(r'export-jobs', ExportJobViewSet, basename='exportjob')

# URLs pour les services IA
# ai_patterns = [
#     path('grammar-check/', AIGrammarCheckView.as_view(), name='ai-grammar-check'),
#     path('generate-content/', AIGenerateContentView.as_view(), name='ai-generate-content'),
#     path('analyze-sentiment/', AIAnalyzeSentimentView.as_view(), name='ai-analyze-sentiment'),
# ]

# # URLs pour les exports
# export_patterns = [
#     path('quick-export/', QuickExportView.as_view(), name='quick-export'),
#     path('bulk-export/', BulkExportView.as_view(), name='bulk-export'),
# ]

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', ProfileView.as_view(), name='profile'),
    path('me/update/', ProfileUpdateView.as_view(), name='profile-update'),
    path('dashboard/', RoleBasedDashboardView.as_view(), name='role-dashboard'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:user_id>/', UserDetailView.as_view(), name='user-detail'),
    path('', include(router.urls)),
    # path('ai/', include(ai_patterns)),
    # path('export/', include(export_patterns)),
]


# URLs WebSocket (pour Channels)
websocket_urlpatterns = [
    path('ws/collaboration/<int:document_id>/', CollaborationConsumer.as_asgi()),
]