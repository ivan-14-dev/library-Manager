"""
URLs pour l'application export
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'jobs', views.ExportJobViewSet, basename='exportjob')

urlpatterns = [
    path('', include(router.urls)),
    path('download/<int:job_id>/', views.ExportDownloadView.as_view({'get': 'retrieve'}), name='export-download'),
    path('progress/<int:job_id>/', views.ExportProgressView.as_view({'get': 'retrieve'}), name='export-progress'),
]