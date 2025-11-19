from django.shortcuts import render

# Create your views here.
"""
Vues pour les rapports et dashboards
"""
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.translation import gettext_lazy as _
from django.db.models import Count, Q, F, Sum
from django.utils import timezone
from datetime import timedelta

from books.models import Book
from borrow.models import Borrow, Reservation
from users.models import User


class StudentDashboardView(APIView):
    """
    Vue pour le dashboard étudiant
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Vérifier que l'utilisateur est un étudiant
        if not user.is_student():
            return Response(
                {'error': _("Accès réservé aux étudiants.")},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Statistiques de l'étudiant
        current_borrows = Borrow.objects.filter(
            user=user, 
            status__in=[Borrow.Status.BORROWED, Borrow.Status.OVERDUE]
        ).count()
        
        overdue_borrows = Borrow.objects.filter(
            user=user, 
            status=Borrow.Status.OVERDUE
        ).count()
        
        reservations = Reservation.objects.filter(
            user=user, 
            status=Reservation.Status.PENDING
        ).count()
        
        borrow_history = Borrow.objects.filter(user=user).count()
        
        # Livres populaires parmi les étudiants
        popular_books = Book.objects.annotate(
            borrow_count=Count('borrows', filter=Q(borrows__user__role=User.Role.STUDENT))
        ).order_by('-borrow_count')[:5]
        
        popular_books_data = [
            {
                'title': book.title,
                'borrow_count': book.borrow_count
            }
            for book in popular_books
        ]
        
        return Response({
            'stats': {
                'current_borrows': current_borrows,
                'overdue_borrows': overdue_borrows,
                'reservations': reservations,
                'borrow_history': borrow_history,
            },
            'popular_books': popular_books_data
        })


class ProfessorDashboardView(APIView):
    """
    Vue pour le dashboard professeur
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Vérifier que l'utilisateur est un professeur
        if not user.is_professor():
            return Response(
                {'error': _("Accès réservé aux professeurs.")},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Statistiques du professeur
        current_borrows = Borrow.objects.filter(
            user=user, 
            status__in=[Borrow.Status.BORROWED, Borrow.Status.OVERDUE]
        ).count()
        
        overdue_borrows = Borrow.objects.filter(
            user=user, 
            status=Borrow.Status.OVERDUE
        ).count()
        
        reservations = Reservation.objects.filter(
            user=user, 
            status=Reservation.Status.PENDING
        ).count()
        
        borrow_history = Borrow.objects.filter(user=user).count()
        
        # Livres récemment ajoutés dans les catégories préférées du professeur
        # (simplifié - dans une vraie application, on aurait des préférences utilisateur)
        recent_books = Book.objects.order_by('-created_at')[:5]
        
        recent_books_data = [
            {
                'title': book.title,
                'authors': [f"{author.first_name} {author.last_name}" for author in book.authors.all()],
                'publication_date': book.publication_date,
            }
            for book in recent_books
        ]
        
        return Response({
            'stats': {
                'current_borrows': current_borrows,
                'overdue_borrows': overdue_borrows,
                'reservations': reservations,
                'borrow_history': borrow_history,
            },
            'recent_books': recent_books_data
        })


class LibrarianDashboardView(APIView):
    """
    Vue pour le dashboard bibliothécaire
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Vérifier que l'utilisateur est un bibliothécaire ou admin
        if not user.is_librarian():
            return Response(
                {'error': _("Accès réservé au personnel de la bibliothèque.")},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Statistiques générales de la bibliothèque
        total_books = Book.objects.count()
        available_books = Book.objects.filter(status=Book.Status.AVAILABLE).count()
        borrowed_books = Book.objects.filter(status=Book.Status.BORROWED).count()
        reserved_books = Book.objects.filter(status=Book.Status.RESERVED).count()
        
        # Emprunts en cours et en retard
        current_borrows = Borrow.objects.filter(status=Borrow.Status.BORROWED).count()
        overdue_borrows = Borrow.objects.filter(status=Borrow.Status.OVERDUE).count()
        
        # Réservations en attente
        pending_reservations = Reservation.objects.filter(status=Reservation.Status.PENDING).count()
        
        # Utilisateurs actifs ce mois-ci
        month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        active_users = Borrow.objects.filter(
            borrow_date__gte=month_start
        ).values('user').distinct().count()
        
        # Livres les plus populaires ce mois-ci
        popular_books = Book.objects.annotate(
            borrow_count=Count('borrows', filter=Q(borrows__borrow_date__gte=month_start))
        ).order_by('-borrow_count')[:5]
        
        popular_books_data = [
            {
                'title': book.title,
                'borrow_count': book.borrow_count
            }
            for book in popular_books
        ]
        
        return Response({
            'stats': {
                'total_books': total_books,
                'available_books': available_books,
                'borrowed_books': borrowed_books,
                'reserved_books': reserved_books,
                'current_borrows': current_borrows,
                'overdue_borrows': overdue_borrows,
                'pending_reservations': pending_reservations,
                'active_users': active_users,
            },
            'popular_books': popular_books_data
        })


class AdminDashboardView(APIView):
    """
    Vue pour le dashboard administrateur
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Vérifier que l'utilisateur est un admin
        if not user.is_admin():
            return Response(
                {'error': _("Accès réservé aux administrateurs.")},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Toutes les statistiques du dashboard bibliothécaire
        librarian_data = LibrarianDashboardView().get(request).data
        
        # Statistiques supplémentaires pour l'admin
        total_users = User.objects.count()
        new_users_this_month = User.objects.filter(
            date_joined__gte=timezone.now().replace(day=1)
        ).count()
        
        users_by_role = User.objects.values('role').annotate(count=Count('id'))
        
        # Revenus des amendes ce mois-ci (simplifié)
        # Dans une vraie application, on utiliserait le modèle Payment
        fine_revenue = 0
        
        return Response({
            **librarian_data,
            'admin_stats': {
                'total_users': total_users,
                'new_users_this_month': new_users_this_month,
                'users_by_role': list(users_by_role),
                'fine_revenue': fine_revenue,
            }
        })