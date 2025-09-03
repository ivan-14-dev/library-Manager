"""
URLs pour l'application users
"""
from django.urls import path
from .views import RegisterView, LoginView, ProfileView, ProfileUpdateView, LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', ProfileView.as_view(), name='profile'),
    path('me/update/', ProfileUpdateView.as_view(), name='profile-update'),
]