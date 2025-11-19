"""
URLs pour l'application groups
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'reading-groups', views.ReadingGroupViewSet, basename='readinggroup')
router.register(r'clubs', views.ClubViewSet, basename='club')
router.register(r'messages', views.MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
    path('reading-groups/<int:group_id>/join/', views.JoinReadingGroupView.as_view(), name='join-reading-group'),
    path('reading-groups/<int:group_id>/leave/', views.LeaveReadingGroupView.as_view(), name='leave-reading-group'),
    path('clubs/<int:club_id>/join/', views.JoinClubView.as_view(), name='join-club'),
    path('clubs/<int:club_id>/leave/', views.LeaveClubView.as_view(), name='leave-club'),
    path('clubs/<int:club_id>/groups/', views.ClubGroupListView.as_view(), name='club-groups'),
]