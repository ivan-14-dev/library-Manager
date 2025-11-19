"""
Vues pour les analyses et tableaux de bord
"""
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from datetime import timedelta
from .models import AnalyticsEvent, UserActivity, BookAnalytics, SalesAnalytics
from .serializers import (
    AnalyticsEventSerializer, UserActivitySerializer,
    BookAnalyticsSerializer, SalesAnalyticsSerializer
)
from users.permissions import IsLibrarianOrAdmin, IsAdmin


class AnalyticsEventViewSet(viewsets.ModelViewSet):
    """
    API pour les événements d'analyse
    """
    queryset = AnalyticsEvent.objects.all()
    serializer_class = AnalyticsEventSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get_queryset(self):
        queryset = AnalyticsEvent.objects.all()

        # Filtres par paramètres
        event_type = self.request.query_params.get('event_type')
        if event_type:
            queryset = queryset.filter(event_type=event_type)

        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user_id=user_id)

        date_from = self.request.query_params.get('date_from')
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)

        date_to = self.request.query_params.get('date_to')
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)

        return queryset.order_by('-created_at')


class UserActivityViewSet(viewsets.ModelViewSet):
    """
    API pour les activités utilisateurs
    """
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get_queryset(self):
        queryset = UserActivity.objects.all()

        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user_id=user_id)

        activity_type = self.request.query_params.get('activity_type')
        if activity_type:
            queryset = queryset.filter(activity_type=activity_type)

        return queryset.order_by('-created_at')


class BookAnalyticsViewSet(viewsets.ModelViewSet):
    """
    API pour les analyses de livres
    """
    queryset = BookAnalytics.objects.all()
    serializer_class = BookAnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated, IsLibrarianOrAdmin]


class SalesAnalyticsViewSet(viewsets.ModelViewSet):
    """
    API pour les analyses de ventes
    """
    queryset = SalesAnalytics.objects.all()
    serializer_class = SalesAnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


class DashboardAnalyticsView(generics.GenericAPIView):
    """
    Vue pour les analyses du tableau de bord principal
    """
    permission_classes = [permissions.IsAuthenticated, IsLibrarianOrAdmin]

    def get(self, request):
        """Retourne les métriques principales du tableau de bord"""
        # Période d'analyse (30 derniers jours)
        end_date = timezone.now()
        start_date = end_date - timedelta(days=30)

        # Métriques utilisateurs
        total_users = self._get_total_users()
        active_users = self._get_active_users(start_date, end_date)
        new_users = self._get_new_users(start_date, end_date)

        # Métriques livres
        total_books = self._get_total_books()
        borrowed_books = self._get_borrowed_books()
        popular_books = self._get_popular_books()

        # Métriques emprunts
        total_borrows = self._get_total_borrows()
        overdue_borrows = self._get_overdue_borrows()
        borrow_trends = self._get_borrow_trends(start_date, end_date)

        # Métriques financières (si admin)
        financial_data = {}
        if request.user.is_admin:
            financial_data = self._get_financial_data(start_date, end_date)

        return Response({
            'users': {
                'total': total_users,
                'active': active_users,
                'new': new_users
            },
            'books': {
                'total': total_books,
                'borrowed': borrowed_books,
                'popular': popular_books
            },
            'borrows': {
                'total': total_borrows,
                'overdue': overdue_borrows,
                'trends': borrow_trends
            },
            'financial': financial_data,
            'period': {
                'start': start_date.isoformat(),
                'end': end_date.isoformat()
            }
        })

    def _get_total_users(self):
        from users.models import User
        return User.objects.count()

    def _get_active_users(self, start_date, end_date):
        return AnalyticsEvent.objects.filter(
            created_at__range=(start_date, end_date)
        ).values('user').distinct().count()

    def _get_new_users(self, start_date, end_date):
        from users.models import User
        return User.objects.filter(
            date_joined__range=(start_date, end_date)
        ).count()

    def _get_total_books(self):
        from books.models import Book
        return Book.objects.count()

    def _get_borrowed_books(self):
        from borrow.models import Borrow
        return Borrow.objects.filter(status='BORROWED').count()

    def _get_popular_books(self):
        from borrow.models import Borrow
        return Borrow.objects.values(
            'book__title', 'book__isbn'
        ).annotate(
            borrow_count=Count('book')
        ).order_by('-borrow_count')[:5]

    def _get_total_borrows(self):
        from borrow.models import Borrow
        return Borrow.objects.count()

    def _get_overdue_borrows(self):
        from borrow.models import Borrow
        return Borrow.objects.filter(status='OVERDUE').count()

    def _get_borrow_trends(self, start_date, end_date):
        from borrow.models import Borrow
        trends = []
        current_date = start_date

        while current_date <= end_date:
            day_end = current_date + timedelta(days=1)
            count = Borrow.objects.filter(
                borrow_date__range=(current_date, day_end)
            ).count()

            trends.append({
                'date': current_date.strftime('%Y-%m-%d'),
                'borrows': count
            })

            current_date += timedelta(days=1)

        return trends

    def _get_financial_data(self, start_date, end_date):
        from payments.models import Payment
        total_revenue = Payment.objects.filter(
            status='COMPLETED',
            paid_at__range=(start_date, end_date)
        ).aggregate(total=Sum('amount'))['total'] or 0

        monthly_revenue = Payment.objects.filter(
            status='COMPLETED',
            paid_at__gte=timezone.now().replace(day=1)
        ).aggregate(total=Sum('amount'))['total'] or 0

        return {
            'total_revenue': total_revenue,
            'monthly_revenue': monthly_revenue
        }


class UserAnalyticsView(generics.GenericAPIView):
    """
    Vue pour les analyses par utilisateur
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id=None):
        """Analyse détaillée d'un utilisateur"""
        target_user_id = user_id or request.user.id

        # Vérifier les permissions
        if str(target_user_id) != str(request.user.id) and not request.user.is_admin:
            return Response(
                {'error': 'Accès non autorisé'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Activités récentes
        recent_activities = UserActivity.objects.filter(
            user_id=target_user_id
        ).order_by('-created_at')[:10]

        # Statistiques d'emprunt
        borrow_stats = self._get_user_borrow_stats(target_user_id)

        # Statistiques de lecture
        reading_stats = self._get_user_reading_stats(target_user_id)

        return Response({
            'recent_activities': UserActivitySerializer(recent_activities, many=True).data,
            'borrow_stats': borrow_stats,
            'reading_stats': reading_stats
        })

    def _get_user_borrow_stats(self, user_id):
        from borrow.models import Borrow
        return {
            'total_borrows': Borrow.objects.filter(user_id=user_id).count(),
            'current_borrows': Borrow.objects.filter(
                user_id=user_id, status='BORROWED'
            ).count(),
            'overdue_borrows': Borrow.objects.filter(
                user_id=user_id, status='OVERDUE'
            ).count(),
            'returned_borrows': Borrow.objects.filter(
                user_id=user_id, status='RETURNED'
            ).count()
        }

    def _get_user_reading_stats(self, user_id):
        from books.models import PersonalBook
        return {
            'personal_books': PersonalBook.objects.filter(user_id=user_id).count(),
            'published_books': PersonalBook.objects.filter(
                user_id=user_id, status='PUBLISHED'
            ).count(),
            'total_words': PersonalBook.objects.filter(
                user_id=user_id
            ).aggregate(total=Sum('word_count'))['total'] or 0
        }


class BookAnalyticsView(generics.GenericAPIView):
    """
    Vue pour les analyses détaillées d'un livre
    """
    permission_classes = [permissions.IsAuthenticated, IsLibrarianOrAdmin]

    def get(self, request, book_id):
        """Analyse détaillée d'un livre"""
        try:
            analytics = BookAnalytics.objects.get(book_id=book_id)
            serializer = BookAnalyticsSerializer(analytics)
            return Response(serializer.data)
        except BookAnalytics.DoesNotExist:
            return Response(
                {'error': 'Analyses non trouvées pour ce livre'},
                status=status.HTTP_404_NOT_FOUND
            )
