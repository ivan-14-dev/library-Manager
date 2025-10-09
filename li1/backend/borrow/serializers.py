"""
Sérialiseurs pour la gestion des emprunts et réservations
"""
from rest_framework import serializers
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from .models import Borrow, Reservation
from books.serializers import BookSerializer
from users.serializers import UserProfileSerializer


class BorrowSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les emprunts
    """
    book = BookSerializer(read_only=True)
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Borrow
        fields = '__all__'


class BorrowCreateSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour créer un emprunt
    """
    class Meta:
        model = Borrow
        fields = ['book']
    
    def validate(self, data):
        user = self.context['request'].user
        book = data['book']
        
        # Vérifier si l'utilisateur a déjà emprunté ce livre
        if Borrow.objects.filter(user=user, book=book, status__in=[Borrow.Status.BORROWED, Borrow.Status.OVERDUE]).exists():
            raise serializers.ValidationError(
                _("Vous avez déjà emprunté ce livre.")
            )
        
        # Vérifier si le livre est disponible
        if book.available_copies <= 0:
            raise serializers.ValidationError(
                _("Ce livre n'est pas disponible pour l'emprunt.")
            )
        
        return data
    
    def create(self, validated_data):
        user = self.context['request'].user
        book = validated_data['book']
        
        # Calculer la date de retour (14 jours pour les étudiants, 28 pour les professeurs)
        borrow_date = timezone.now()
        if user.is_professor():
            due_date = borrow_date + timezone.timedelta(days=28)
        else:
            due_date = borrow_date + timezone.timedelta(days=14)
        
        # Créer l'emprunt
        borrow = Borrow.objects.create(
            user=user,
            book=book,
            borrow_date=borrow_date,
            due_date=due_date
        )
        
        return borrow


class ReservationSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les réservations
    """
    book = BookSerializer(read_only=True)
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Reservation
        fields = '__all__'


class ReservationCreateSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour créer une réservation
    """
    class Meta:
        model = Reservation
        fields = ['book']
    
    def validate(self, data):
        user = self.context['request'].user
        book = data['book']
        
        # Vérifier si l'utilisateur a déjà réservé ce livre
        if Reservation.objects.filter(user=user, book=book, status=Reservation.Status.PENDING).exists():
            raise serializers.ValidationError(
                _("Vous avez déjà réservé ce livre.")
            )
        
        # Vérifier si le livre est disponible pour réservation
        if book.available_copies > 0:
            raise serializers.ValidationError(
                _("Ce livre est disponible pour l'emprunt direct. Pas besoin de réservation.")
            )
        
        return data
    
    def create(self, validated_data):
        user = self.context['request'].user
        book = validated_data['book']
        
        # Calculer la date d'expiration (7 jours)
        reservation_date = timezone.now()
        expiry_date = reservation_date + timezone.timedelta(days=7)
        
        # Créer la réservation
        reservation = Reservation.objects.create(
            user=user,
            book=book,
            reservation_date=reservation_date,
            expiry_date=expiry_date
        )
        
        return reservation


class ReturnBookSerializer(serializers.Serializer):
    """
    Sérialiseur pour retourner un livre
    """
    borrow_id = serializers.IntegerField()
    
    def validate(self, data):
        try:
            borrow = Borrow.objects.get(id=data['borrow_id'])
        except Borrow.DoesNotExist:
            raise serializers.ValidationError(
                _("Emprunt non trouvé.")
            )
        
        # Vérifier si le livre a déjà été retourné
        if borrow.status == Borrow.Status.RETURNED:
            raise serializers.ValidationError(
                _("Ce livre a déjà été retourné.")
            )
        
        data['borrow'] = borrow
        return data