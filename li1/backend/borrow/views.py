"""
Vues pour la gestion des emprunts et réservations
"""
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from .models import Borrow, Reservation
from .serializers import (
    BorrowSerializer,
    BorrowCreateSerializer,
    ReservationSerializer,
    ReservationCreateSerializer,
    ReturnBookSerializer
)
from users.permissions import (
    IsStudentOrHigher, IsLibrarianOrAdmin, IsAdmin
)


class BorrowListView(generics.ListAPIView):
    """
    Vue pour lister les emprunts de l'utilisateur connecté
    """
    serializer_class = BorrowSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Borrow.objects.filter(user=self.request.user)


class AllBorrowsListView(generics.ListAPIView):
    """
    Vue pour lister tous les emprunts (bibliothécaires et admins seulement)
    """
    serializer_class = BorrowSerializer
    permission_classes = [permissions.IsAuthenticated, IsLibrarianOrAdmin]
    queryset = Borrow.objects.all()


class BorrowCreateView(generics.CreateAPIView):
    """
    Vue pour créer un emprunt
    """
    serializer_class = BorrowCreateSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudentOrHigher]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReturnBookView(APIView):
    """
    Vue pour retourner un livre
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ReturnBookSerializer(data=request.data)
        
        if serializer.is_valid():
            borrow = serializer.validated_data['borrow']
            
            # Vérifier que l'utilisateur est propriétaire de l'emprunt ou admin/bibliothécaire
            if borrow.user != request.user and not request.user.is_librarian():
                return Response(
                    {'error': _("Vous n'êtes pas autorisé à retourner ce livre.")},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Marquer le livre comme retourné
            borrow.return_date = timezone.now()
            borrow.status = Borrow.Status.RETURNED
            borrow.save()
            
            return Response(
                {'message': _("Livre retourné avec succès.")},
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReservationListView(generics.ListAPIView):
    """
    Vue pour lister les réservations de l'utilisateur connecté
    """
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Reservation.objects.filter(user=self.request.user)


class AllReservationsListView(generics.ListAPIView):
    """
    Vue pour lister toutes les réservations (bibliothécaires et admins seulement)
    """
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated, IsLibrarianOrAdmin]
    queryset = Reservation.objects.all()


class ReservationCreateView(generics.CreateAPIView):
    """
    Vue pour créer une réservation
    """
    serializer_class = ReservationCreateSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudentOrHigher]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CancelReservationView(APIView):
    """
    Vue pour annuler une réservation
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, reservation_id):
        try:
            reservation = Reservation.objects.get(id=reservation_id)
        except Reservation.DoesNotExist:
            return Response(
                {'error': _("Réservation non trouvée.")},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Vérifier que l'utilisateur est propriétaire de la réservation ou admin/bibliothécaire
        if reservation.user != request.user and not request.user.is_librarian():
            return Response(
                {'error': _("Vous n'êtes pas autorisé à annuler cette réservation.")},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Annuler la réservation
        reservation.status = Reservation.Status.CANCELLED
        reservation.save()
        
        return Response(
            {'message': _("Réservation annulée avec succès.")},
            status=status.HTTP_200_OK
        )


class RenewBorrowView(APIView):
    """
    Vue pour renouveler un emprunt
    """
    permission_classes = [permissions.IsAuthenticated, IsStudentOrHigher]

    def post(self, request, borrow_id):
        try:
            borrow = Borrow.objects.get(id=borrow_id, user=request.user)
        except Borrow.DoesNotExist:
            return Response(
                {'error': _("Emprunt non trouvé.")},
                status=status.HTTP_404_NOT_FOUND
            )

        # Vérifier que l'emprunt n'est pas déjà retourné ou en retard
        if borrow.status != Borrow.Status.BORROWED:
            return Response(
                {'error': _("Cet emprunt ne peut pas être renouvelé.")},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Vérifier que l'emprunt n'a pas déjà été renouvelé
        if borrow.renewed:
            return Response(
                {'error': _("Cet emprunt a déjà été renouvelé.")},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculer la nouvelle date de retour (extension de 14 jours)
        from datetime import timedelta
        borrow.due_date = borrow.due_date + timedelta(days=14)
        borrow.renewed = True
        borrow.save()

        return Response(
            {
                'message': _("Emprunt renouvelé avec succès."),
                'new_due_date': borrow.due_date
            },
            status=status.HTTP_200_OK
        )


class BorrowStatsView(APIView):
    """
    Vue pour les statistiques d'emprunt (bibliothécaires et admins)
    """
    permission_classes = [permissions.IsAuthenticated, IsLibrarianOrAdmin]

    def get(self, request):
        from django.db.models import Count, Q
        from django.utils import timezone

        # Statistiques générales
        total_borrows = Borrow.objects.count()
        active_borrows = Borrow.objects.filter(status=Borrow.Status.BORROWED).count()
        overdue_borrows = Borrow.objects.filter(
            status=Borrow.Status.OVERDUE
        ).count()

        # Statistiques par statut
        status_stats = Borrow.objects.values('status').annotate(
            count=Count('status')
        )

        # Livres les plus empruntés
        popular_books = Borrow.objects.values(
            'book__title', 'book__isbn'
        ).annotate(
            borrow_count=Count('book')
        ).order_by('-borrow_count')[:10]

        return Response({
            'total_borrows': total_borrows,
            'active_borrows': active_borrows,
            'overdue_borrows': overdue_borrows,
            'status_stats': status_stats,
            'popular_books': popular_books
        }, status=status.HTTP_200_OK)