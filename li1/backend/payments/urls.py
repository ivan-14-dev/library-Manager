"""
URLs pour l'application payments
"""
from django.urls import path
from .views import (
    PaymentListView,
    AllPaymentsListView,
    PaymentCreateView,
    CreateStripePaymentIntentView,
    ConfirmStripePaymentView,
    PayPalPaymentView,
    OMMPaymentView,
    MoMoPaymentView,
    PaymentStatsView
)

urlpatterns = [
    path('my/', PaymentListView.as_view(), name='my-payments'),
    path('all/', AllPaymentsListView.as_view(), name='all-payments'),
    path('create/', PaymentCreateView.as_view(), name='create-payment'),
    path('stripe/create-intent/', CreateStripePaymentIntentView.as_view(), name='stripe-create-intent'),
    path('stripe/confirm/', ConfirmStripePaymentView.as_view(), name='stripe-confirm'),
    path('paypal/', PayPalPaymentView.as_view(), name='paypal-payment'),
    path('om/', OMMPaymentView.as_view(), name='om-payment'),
    path('momo/', MoMoPaymentView.as_view(), name='momo-payment'),
    path('stats/', PaymentStatsView.as_view(), name='payment-stats'),
]