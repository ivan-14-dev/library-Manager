"""
URLs pour l'application borrow
"""
from django.urls import path
from .views import (
    BorrowListView, AllBorrowsListView, BorrowCreateView, ReturnBookView,
    ReservationListView, AllReservationsListView, ReservationCreateView, CancelReservationView,
    RenewBorrowView, BorrowStatsView
)

urlpatterns = [
    # Emprunts
    path('my/', BorrowListView.as_view(), name='my-borrows'),
    path('all/', AllBorrowsListView.as_view(), name='all-borrows'),
    path('borrow/', BorrowCreateView.as_view(), name='borrow-book'),
    path('return/', ReturnBookView.as_view(), name='return-book'),
    path('<int:borrow_id>/renew/', RenewBorrowView.as_view(), name='renew-borrow'),
    path('stats/', BorrowStatsView.as_view(), name='borrow-stats'),

    # Réservations
    path('reservations/my/', ReservationListView.as_view(), name='my-reservations'),
    path('reservations/all/', AllReservationsListView.as_view(), name='all-reservations'),
    path('reserve/', ReservationCreateView.as_view(), name='reserve-book'),
    path('reservations/<int:reservation_id>/cancel/', CancelReservationView.as_view(), name='cancel-reservation'),
]