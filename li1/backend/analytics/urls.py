"""
URLs pour l'application analytics
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'events', views.AnalyticsEventViewSet, basename='analyticsevent')
router.register(r'user-activities', views.UserActivityViewSet, basename='useractivity')
router.register(r'book-analytics', views.BookAnalyticsViewSet, basename='bookanalytics')
router.register(r'sales-analytics', views.SalesAnalyticsViewSet, basename='salesanalytics')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', views.DashboardAnalyticsView.as_view(), name='dashboard-analytics'),
    path('users/<int:user_id>/', views.UserAnalyticsView.as_view(), name='user-analytics'),
    path('books/<int:book_id>/', views.BookAnalyticsView.as_view(), name='book-analytics-detail'),
]