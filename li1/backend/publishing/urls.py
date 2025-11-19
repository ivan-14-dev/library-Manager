"""
URLs pour l'application publishing
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'publication-requests', views.PublicationRequestViewSet, basename='publicationrequest')
router.register(r'reviews', views.ReviewViewSet, basename='review')
router.register(r'publication-status', views.PublicationStatusViewSet, basename='publicationstatus')
router.register(r'communities', views.CommunityViewSet, basename='community')
router.register(r'friend-circles', views.FriendCircleViewSet, basename='friendcircle')
router.register(r'circle-memberships', views.CircleMembershipViewSet, basename='circle-membership')

urlpatterns = [
    path('', include(router.urls)),
]