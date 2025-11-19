"""
Vues pour la gestion des utilisateurs et l'authentification
"""
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.translation import gettext_lazy as _
from .models import User
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    UserUpdateSerializer
)
from .permissions import (
    IsVisitor, IsStudent, IsProfessor, IsLibrarian, IsAdmin,
    IsLibrarianOrAdmin, IsProfessorOrAdmin, IsStudentOrHigher,
    HasActiveSubscription, HasPremiumSubscription
)


class RegisterView(APIView):
    """
    Vue pour l'inscription des utilisateurs
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Générer les tokens JWT
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserProfileSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    Vue pour la connexion des utilisateurs
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Générer les tokens JWT
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserProfileSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    """
    Vue pour récupérer le profil de l'utilisateur connecté
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProfileUpdateView(APIView):
    """
    Vue pour mettre à jour le profil de l'utilisateur connecté
    """
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        serializer = UserUpdateSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(APIView):
    """
    Vue pour lister les utilisateurs (admin seulement)
    """
    permission_classes = [IsAdmin]

    def get(self, request):
        users = User.objects.all()
        serializer = UserProfileSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserDetailView(APIView):
    """
    Vue pour récupérer/modifier un utilisateur spécifique (admin seulement)
    """
    permission_classes = [IsAdmin]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            serializer = UserProfileSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {'error': 'Utilisateur non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            serializer = UserUpdateSerializer(user, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response(
                {'error': 'Utilisateur non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )


class RoleBasedDashboardView(APIView):
    """
    Vue pour le tableau de bord basé sur le rôle
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        dashboard_data = {
            'user': UserProfileSerializer(user).data,
            'role': user.get_role_display(),
            'permissions': self._get_user_permissions(user),
            'stats': self._get_role_based_stats(user)
        }
        return Response(dashboard_data, status=status.HTTP_200_OK)

    def _get_user_permissions(self, user):
        """Retourne les permissions de l'utilisateur"""
        return {
            'is_visitor': user.is_visitor(),
            'is_student': user.is_student(),
            'is_professor': user.is_professor(),
            'is_librarian': user.is_librarian(),
            'is_admin': user.is_admin(),
            'can_borrow_books': user.role in ['STUDENT', 'PROFESSOR', 'LIBRARIAN', 'ADMIN'],
            'can_manage_books': user.is_librarian(),
            'can_manage_users': user.is_admin(),
            'can_publish': user.role in ['PROFESSOR', 'ADMIN'],
        }

    def _get_role_based_stats(self, user):
        """Retourne les statistiques basées sur le rôle"""
        stats = {}

        if user.is_student():
            # Statistiques pour étudiants
            stats.update({
                'borrowed_books': user.borrows.filter(status='BORROWED').count(),
                'overdue_books': user.borrows.filter(status='OVERDUE').count(),
                'personal_books': user.personal_books.count(),
            })
        elif user.is_professor():
            # Statistiques pour professeurs
            stats.update({
                'published_books': user.personal_books.filter(status='PUBLISHED').count(),
                'borrowed_books': user.borrows.filter(status='BORROWED').count(),
                'teaching_groups': 0,  # À implémenter
            })
        elif user.is_librarian():
            # Statistiques pour bibliothécaires
            from books.models import Book
            stats.update({
                'total_books': Book.objects.count(),
                'available_books': Book.objects.filter(status='AVAILABLE').count(),
                'borrowed_books': Book.objects.filter(status='BORROWED').count(),
                'active_reservations': 0,  # À implémenter
            })
        elif user.is_admin():
            # Statistiques pour administrateurs
            from books.models import Book
            stats.update({
                'total_users': User.objects.count(),
                'total_books': Book.objects.count(),
                'active_sessions': 0,  # À implémenter
                'system_health': 'OK',  # À implémenter
            })

        return stats


class LogoutView(APIView):
    """
    Vue pour la déconnexion des utilisateurs (blacklist du refresh token)
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response(
                {'message': _('Déconnexion réussie.')},
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        











# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils import timezone
from .models import UserSubscription, AIConfiguration, DocumentVersion, CollaborationSession, SessionParticipant, ExportJob
from .serializers import (
    UserSubscriptionSerializer, AIConfigurationSerializer, DocumentVersionSerializer,
    CollaborationSessionSerializer, SessionParticipantSerializer, ExportJobSerializer
)

class UserSubscriptionViewSet(viewsets.ModelViewSet):
    """
    API pour la gestion des abonnements utilisateurs
    Permet aux admins de gérer tous les abonnements et aux utilisateurs de voir le leur
    """
    queryset = UserSubscription.objects.all()
    serializer_class = UserSubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filtrage selon les permissions"""
        if self.request.user.is_staff:
            return UserSubscription.objects.all()
        return UserSubscription.objects.filter(user=self.request.user)

    def get_permissions(self):
        """Seuls les admins peuvent créer/modifier/supprimer"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'])
    def my_subscription(self, request):
        """Récupérer l'abonnement de l'utilisateur connecté"""
        try:
            subscription = UserSubscription.objects.get(user=request.user)
            serializer = self.get_serializer(subscription)
            return Response(serializer.data)
        except UserSubscription.DoesNotExist:
            return Response(
                {'detail': 'Aucun abonnement trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def activate(self, request, pk=None):
        """Activer un abonnement (admin seulement)"""
        subscription = self.get_object()
        subscription.is_active = True
        subscription.save()
        return Response({'status': 'Abonnement activé'})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def deactivate(self, request, pk=None):
        """Désactiver un abonnement (admin seulement)"""
        subscription = self.get_object()
        subscription.is_active = False
        subscription.save()
        return Response({'status': 'Abonnement désactivé'})

class AIConfigurationViewSet(viewsets.ModelViewSet):
    """
    API pour la configuration de l'IA par utilisateur
    Les admins peuvent gérer toutes les configs, les users voient seulement la leur
    """
    queryset = AIConfiguration.objects.all()
    serializer_class = AIConfigurationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filtrage selon les permissions"""
        if self.request.user.is_staff:
            return AIConfiguration.objects.all()
        return AIConfiguration.objects.filter(user=self.request.user)

    def get_permissions(self):
        """Seuls les admins peuvent créer/modifier/supprimer"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'])
    def my_config(self, request):
        """Récupérer la configuration IA de l'utilisateur connecté"""
        try:
            config = AIConfiguration.objects.get(user=request.user)
            serializer = self.get_serializer(config)
            return Response(serializer.data)
        except AIConfiguration.DoesNotExist:
            return Response(
                {'detail': 'Aucune configuration IA trouvée'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def reset_usage(self, request, pk=None):
        """Réinitialiser l'usage IA d'un utilisateur (admin seulement)"""
        config = self.get_object()
        config.current_usage = {}
        config.last_reset_date = timezone.now().date()
        config.save()
        return Response({'status': 'Usage réinitialisé'})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def toggle_active(self, request, pk=None):
        """Activer/désactiver l'IA pour un utilisateur (admin seulement)"""
        config = self.get_object()
        config.is_active = not config.is_active
        config.save()
        action = "activée" if config.is_active else "désactivée"
        return Response({'status': f'IA {action}', 'is_active': config.is_active})

class DocumentVersionViewSet(viewsets.ModelViewSet):
    """
    API pour le système de versionning des documents
    """
    queryset = DocumentVersion.objects.all()
    serializer_class = DocumentVersionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filtrage selon les permissions et le document"""
        queryset = DocumentVersion.objects.all()
        
        # Filtre par document si spécifié
        document_id = self.request.query_params.get('document_id')
        if document_id:
            queryset = queryset.filter(document_id=document_id)
        
        # Pour les non-admins, seulement leurs documents ou ceux qu'ils peuvent voir
        if not self.request.user.is_staff:
            queryset = queryset.filter(
                models.Q(created_by=self.request.user) |
                models.Q(document__created_by=self.request.user)
            )
        
        return queryset.order_by('-version_number')

    def perform_create(self, serializer):
        """Création automatique du numéro de version"""
        document = serializer.validated_data['document']
        last_version = DocumentVersion.objects.filter(document=document).order_by('-version_number').first()
        next_version = (last_version.version_number + 1) if last_version else 1
        
        serializer.save(
            version_number=next_version,
            created_by=self.request.user,
            word_count=self._count_words(serializer.validated_data['content'])
        )

    def _count_words(self, content):
        """Compter les mots dans le contenu"""
        import re
        text = re.sub('<[^<]+?>', '', content)  # Supprimer le HTML
        words = text.split()
        return len(words)

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        """Restaurer cette version comme version actuelle"""
        version = self.get_object()
        
        # Créer une nouvelle version avec le contenu restauré
        new_version = DocumentVersion.objects.create(
            document=version.document,
            content=version.content,
            changes=f"Restauration de la version {version.version_number}",
            created_by=request.user
        )
        
        return Response({
            'status': 'Version restaurée',
            'new_version_id': new_version.id,
            'version_number': new_version.version_number
        })

class CollaborationSessionViewSet(viewsets.ModelViewSet):
    """
    API pour les sessions de collaboration en temps réel
    """
    queryset = CollaborationSession.objects.all()
    serializer_class = CollaborationSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filtrage des sessions accessibles"""
        queryset = CollaborationSession.objects.filter(is_active=True)
        
        if not self.request.user.is_staff:
            # Sessions où l'utilisateur est participant ou créateur
            queryset = queryset.filter(
                models.Q(created_by=self.request.user) |
                models.Q(participants__user=self.request.user)
            ).distinct()
        
        return queryset

    def perform_create(self, serializer):
        """Création de session avec le créateur comme premier participant"""
        session = serializer.save(created_by=self.request.user)
        
        # Ajouter le créateur comme participant éditeur
        SessionParticipant.objects.create(
            session=session,
            user=self.request.user,
            role='editor'
        )

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Rejoindre une session de collaboration"""
        session = self.get_object()
        
        # Vérifier si l'utilisateur peut accéder au document
        if not self._can_access_document(request.user, session.document):
            return Response(
                {'detail': 'Accès non autorisé à ce document'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        participant, created = SessionParticipant.objects.get_or_create(
            session=session,
            user=request.user,
            defaults={'role': 'viewer'}
        )
        
        if not created and participant.left_at:
            participant.left_at = None
            participant.save()
        
        return Response({'status': 'Session rejointe', 'role': participant.role})

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """Quitter une session de collaboration"""
        session = self.get_object()
        
        try:
            participant = SessionParticipant.objects.get(session=session, user=request.user)
            participant.left_at = timezone.now()
            participant.save()
            return Response({'status': 'Session quittée'})
        except SessionParticipant.DoesNotExist:
            return Response(
                {'detail': 'Vous ne participez pas à cette session'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def update_cursor(self, request, pk=None):
        """Mettre à jour la position du curseur dans la session"""
        session = self.get_object()
        position = request.data.get('position')
        
        if not position:
            return Response(
                {'detail': 'Position du curseur requise'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            participant = SessionParticipant.objects.get(
                session=session, 
                user=request.user, 
                left_at__isnull=True
            )
            participant.cursor_position = position
            participant.save()
            
            # Ici, vous enverriez la mise à jour via WebSocket aux autres participants
            self._broadcast_cursor_update(session, request.user, position)
            
            return Response({'status': 'Curseur mis à jour'})
        except SessionParticipant.DoesNotExist:
            return Response(
                {'detail': 'Vous ne participez pas activement à cette session'},
                status=status.HTTP_400_BAD_REQUEST
            )

    def _can_access_document(self, user, document):
        """Vérifier si l'utilisateur peut accéder au document"""
        # Implémentez votre logique d'autorisation de document ici
        return document.is_accessible_by(user)

    def _broadcast_cursor_update(self, session, user, position):
        """Diffuser la mise à jour du curseur (à implémenter avec WebSocket)"""
        # Cette méthode sera connectée à votre système WebSocket
        pass

class ExportJobViewSet(viewsets.ModelViewSet):
    """
    API pour la gestion des jobs d'exportation asynchrones
    """
    queryset = ExportJob.objects.all()
    serializer_class = ExportJobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filtrage des jobs selon les permissions"""
        if self.request.user.is_staff:
            return ExportJob.objects.all()
        return ExportJob.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Création d'un job d'exportation"""
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        """Récupérer le statut d'un job d'exportation"""
        job = self.get_object()
        return Response({
            'status': job.status,
            'progress': job.progress,
            'download_url': self._get_download_url(job) if job.status == 'completed' else None,
            'error_message': job.error_message
        })

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Télécharger le fichier exporté"""
        job = self.get_object()
        
        if job.status != 'completed' or not job.file_path:
            return Response(
                {'detail': 'Export non disponible'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Vérifier les permissions
        if not request.user.is_staff and job.user != request.user:
            return Response(
                {'detail': 'Accès non autorisé'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Servir le fichier (à adapter selon votre configuration de stockage)
        from django.http import FileResponse
        import os
        return FileResponse(open(job.file_path, 'rb'), as_attachment=True, filename=os.path.basename(job.file_path))

    def _get_download_url(self, job):
        """Générer l'URL de téléchargement"""
        return f"/api/exports/jobs/{job.id}/download/"