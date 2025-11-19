"""
URLs pour l'application reports
"""
from django.urls import path
from .views import StudentDashboardView, ProfessorDashboardView, LibrarianDashboardView, AdminDashboardView

urlpatterns = [
    path('student/', StudentDashboardView.as_view(), name='student-dashboard'),
    path('professor/', ProfessorDashboardView.as_view(), name='professor-dashboard'),
    path('librarian/', LibrarianDashboardView.as_view(), name='librarian-dashboard'),
    path('admin/', AdminDashboardView.as_view(), name='admin-dashboard'),
]