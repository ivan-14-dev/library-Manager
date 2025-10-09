"""
Sérialiseurs pour la gestion des paiements
"""
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les paiements
    """
    class Meta:
        model = Payment
        fields = '__all__'


class PaymentCreateSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour créer un paiement
    """
    class Meta:
        model = Payment
        fields = ['amount', 'description', 'payment_method']
    
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                _("Le montant doit être supérieur à zéro.")
            )
        return value


class StripePaymentIntentSerializer(serializers.Serializer):
    """
    Sérialiseur pour créer un intent de paiement Stripe
    """
    payment_id = serializers.IntegerField()
    
    def validate(self, data):
        try:
            payment = Payment.objects.get(id=data['payment_id'])
        except Payment.DoesNotExist:
            raise serializers.ValidationError(
                _("Paiement non trouvé.")
            )
        
        # Vérifier que le paiement n'a pas déjà été effectué
        if payment.status != Payment.Status.PENDING:
            raise serializers.ValidationError(
                _("Ce paiement a déjà été traité.")
            )
        
        data['payment'] = payment
        return data