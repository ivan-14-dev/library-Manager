from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Notification, Message, ReadingReport, BookRating
from .serializers import (
    NotificationSerializer, MessageSerializer,
    ReadingReportSerializer, BookRatingSerializer
)


class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion des notifications
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['notification_type', 'is_read']
    search_fields = ['title', 'message']
    ordering_fields = ['created_at', 'is_read']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Retourne uniquement les notifications de l'utilisateur connecté
        """
        return Notification.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """
        Associe automatiquement l'utilisateur connecté
        """
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """
        Marquer une notification comme lue
        """
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'notification marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """
        Marquer toutes les notifications comme lues
        """
        self.get_queryset().update(is_read=True)
        return Response({'status': 'all notifications marked as read'})


class MessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la messagerie instantanée
    """
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_read']
    search_fields = ['content']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']
    
    def get_queryset(self):
        """
        Retourne uniquement les messages envoyés ou reçus par l'utilisateur connecté
        """
        return Message.objects.filter(
            Q(sender=self.request.user) | Q(receiver=self.request.user)
        )
    
    def perform_create(self, serializer):
        """
        Associe automatiquement l'expéditeur
        """
        serializer.save(sender=self.request.user)
    
    @action(detail=False, methods=['get'])
    def conversations(self, request):
        """
        Lister toutes les conversations de l'utilisateur
        """
        # Récupérer tous les utilisateurs avec qui l'utilisateur a échangé
        sent_to = Message.objects.filter(
            sender=request.user
        ).values_list('receiver', flat=True).distinct()
        
        received_from = Message.objects.filter(
            receiver=request.user
        ).values_list('sender', flat=True).distinct()
        
        user_ids = set(list(sent_to) + list(received_from))
        from django.contrib.auth import get_user_model
        User = get_user_model()
        users = User.objects.filter(id__in=user_ids)
        
        from .serializers import UserSerializer
        return Response(UserSerializer(users, many=True).data)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """
        Marquer un message comme lu
        """
        message = self.get_object()
        if message.receiver == request.user:
            message.is_read = True
            message.save()
            return Response({'status': 'message marked as read'})
        return Response(
            {'error': 'Unauthorized'},
            status=status.HTTP_403_FORBIDDEN
        )


class ReadingReportViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour les rapports de lecture
    """
    serializer_class = ReadingReportSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['book']
    search_fields = ['content', 'book__title']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Retourne tous les rapports (peut être filtré par utilisateur)
        """
        queryset = ReadingReport.objects.all()
        
        # Filtrer par utilisateur si spécifié
        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
            
        return queryset
    
    def perform_create(self, serializer):
        """
        Associe automatiquement l'utilisateur connecté
        """
        serializer.save(user=self.request.user)


class BookRatingViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la notation des livres
    """
    serializer_class = BookRatingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['book', 'rating']
    search_fields = ['comment', 'book__title']
    ordering_fields = ['created_at', 'rating']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Retourne toutes les notations (peut être filtré par utilisateur)
        """
        queryset = BookRating.objects.all()
        
        # Filtrer par utilisateur si spécifié
        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
            
        return queryset
    
    def perform_create(self, serializer):
        """
        Associe automatiquement l'utilisateur connecté
        """
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """
        Surcharge pour gérer la création/mise à jour
        """
        book_id = request.data.get('book')
        
        # Vérifier si une notation existe déjà
        existing_rating = BookRating.objects.filter(
            user=request.user,
            book_id=book_id
        ).first()
        
        if existing_rating:
            # Mettre à jour la notation existante
            serializer = self.get_serializer(existing_rating, data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
            # Créer une nouvelle notation
            return super().create(request, *args, **kwargs)