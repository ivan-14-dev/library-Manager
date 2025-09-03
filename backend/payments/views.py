"""
Vues pour la gestion des paiements
"""
import stripe
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from .models import Payment
from .serializers import PaymentSerializer, PaymentCreateSerializer, StripePaymentIntentSerializer


class PaymentListView(generics.ListAPIView):
    """
    Vue pour lister les paiements de l'utilisateur connecté
    """
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class AllPaymentsListView(generics.ListAPIView):
    """
    Vue pour lister tous les paiements (admins seulement)
    """
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = Payment.objects.all()


class PaymentCreateView(generics.CreateAPIView):
    """
    Vue pour créer un paiement
    """
    serializer_class = PaymentCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CreateStripePaymentIntentView(APIView):
    """
    Vue pour créer un intent de paiement Stripe
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = StripePaymentIntentSerializer(data=request.data)
        
        if serializer.is_valid():
            payment = serializer.validated_data['payment']
            
            # Vérifier que l'utilisateur est propriétaire du paiement
            if payment.user != request.user:
                return Response(
                    {'error': _("Vous n'êtes pas autorisé à effectuer ce paiement.")},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Configurer Stripe
            stripe.api_key = settings.STRIPE_SECRET_KEY
            
            try:
                # Créer un PaymentIntent avec Stripe
                intent = stripe.PaymentIntent.create(
                    amount=int(payment.amount * 100),  # Convertir en centimes
                    currency='eur',
                    metadata={
                        'payment_id': payment.id,
                        'user_id': request.user.id
                    },
                    automatic_payment_methods={
                        'enabled': True,
                    },
                )
                
                return Response({
                    'clientSecret': intent.client_secret,
                    'payment_id': payment.id
                }, status=status.HTTP_200_OK)
                
            except stripe.error.StripeError as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConfirmStripePaymentView(APIView):
    """
    Vue pour confirmer un paiement Stripe réussi
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        payment_id = request.data.get('payment_id')
        payment_intent_id = request.data.get('payment_intent_id')
        
        try:
            payment = Payment.objects.get(id=payment_id, user=request.user)
        except Payment.DoesNotExist:
            return Response(
                {'error': _("Paiement non trouvé.")},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Marquer le paiement comme complété
        payment.mark_as_paid(payment_intent_id)
        
        return Response(
            {'message': _("Paiement confirmé avec succès.")},
            status=status.HTTP_200_OK
        )