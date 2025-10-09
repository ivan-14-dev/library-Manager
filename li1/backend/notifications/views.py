"""
Vues pour la gestion des notifications
"""
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.translation import gettext_lazy as _
from .models import Notification
from .serializers import NotificationSerializer, NotificationCreateSerializer, MarkAsReadSerializer


class NotificationListView(generics.ListAPIView):
    """
    Vue pour lister les notifications de l'utilisateur connecté
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class UnreadNotificationListView(generics.ListAPIView):
    """
    Vue pour lister les notifications non lues de l'utilisateur connecté
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user, 
            status=Notification.Status.UNREAD
        )


class MarkAsReadView(APIView):
    """
    Vue pour marquer une notification comme lue
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = MarkAsReadSerializer(data=request.data)
        
        if serializer.is_valid():
            notification = serializer.validated_data['notification']
            
            # Vérifier que l'utilisateur est propriétaire de la notification
            if notification.user != request.user:
                return Response(
                    {'error': _("Vous n'êtes pas autorisé à modifier cette notification.")},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Marquer comme lu
            notification.mark_as_read()
            
            return Response(
                {'message': _("Notification marquée comme lue.")},
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MarkAllAsReadView(APIView):
    """
    Vue pour marquer toutes les notifications comme lues
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        # Marquer toutes les notifications non lues de l'utilisateur comme lues
        notifications = Notification.objects.filter(
            user=request.user, 
            status=Notification.Status.UNREAD
        )
        
        for notification in notifications:
            notification.mark_as_read()
        
        return Response(
            {'message': _("Toutes les notifications ont été marquées comme lues.")},
            status=status.HTTP_200_OK
        )


class NotificationCreateView(generics.CreateAPIView):
    """
    Vue pour créer une notification (bibliothécaires et admins seulement)
    """
    serializer_class = NotificationCreateSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    
    def perform_create(self, serializer):
        serializer.save()