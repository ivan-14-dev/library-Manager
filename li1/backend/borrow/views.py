"""
Vues pour la gestion des emprunts et réservations
"""
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.translation import gettext_lazy as _
from .models import Borrow, Reservation
from .serializers import (
    BorrowSerializer, 
    BorrowCreateSerializer, 
    ReservationSerializer, 
    ReservationCreateSerializer,
    ReturnBookSerializer
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
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = Borrow.objects.all()


class BorrowCreateView(generics.CreateAPIView):
    """
    Vue pour créer un emprunt
    """
    serializer_class = BorrowCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save()


class ReturnBookView(APIView):
    """
    Vue pour retourner un livre
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ReturnBookSerializer(data=request.data)
        
        if serializer.is_valid():
            borrow = serializer.validated_data['borrow']
            
            # Vérifier que l'utilisateur est propriétaire de l'emprunt ou admin
            if borrow.user != request.user and not request.user.is_admin():
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
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = Reservation.objects.all()


class ReservationCreateView(generics.CreateAPIView):
    """
    Vue pour créer une réservation
    """
    serializer_class = ReservationCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save()


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
        
        # Vérifier que l'utilisateur est propriétaire de la réservation ou admin
        if reservation.user != request.user and not request.user.is_admin():
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