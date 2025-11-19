"""
Vues pour le système de publication
"""
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from .models import (
    PublicationRequest, Review, PublicationStatus,
    Community, FriendCircle, CircleMembership
)
from .serializers import (
    PublicationRequestSerializer, ReviewSerializer, PublicationStatusSerializer,
    CommunitySerializer, FriendCircleSerializer, CircleMembershipSerializer
)
from users.permissions import IsProfessorOrAdmin, HasPremiumSubscription, IsAdmin


class PublicationRequestViewSet(viewsets.ModelViewSet):
    """
    API pour les demandes de publication
    """
    queryset = PublicationRequest.objects.all()
    serializer_class = PublicationRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filtrage selon les permissions et l'utilisateur"""
        queryset = PublicationRequest.objects.all()

        # Filtre par statut
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # Pour les utilisateurs non-admin, seulement leurs propres demandes
        if not self.request.user.is_admin:
            queryset = queryset.filter(
                Q(requested_by=self.request.user) |
                Q(personal_book__user=self.request.user)
            )

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        """Création de demande de publication"""
        serializer.save(requested_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def approve(self, request, pk=None):
        """Approuver une demande de publication"""
        pub_request = self.get_object()

        if pub_request.status != PublicationRequest.Status.PENDING:
            return Response(
                {'error': 'Cette demande a déjà été traitée'},
                status=status.HTTP_400_BAD_REQUEST
            )

        pub_request.status = PublicationRequest.Status.APPROVED
        pub_request.reviewed_by = request.user
        pub_request.reviewed_at = timezone.now()
        pub_request.save()

        # Créer le statut de publication
        PublicationStatus.objects.create(
            publication_request=pub_request,
            current_status=PublicationStatus.Status.APPROVED
        )

        return Response({'message': 'Demande approuvée'})

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def reject(self, request, pk=None):
        """Rejeter une demande de publication"""
        pub_request = self.get_object()
        review_notes = request.data.get('review_notes', '')

        if pub_request.status != PublicationRequest.Status.PENDING:
            return Response(
                {'error': 'Cette demande a déjà été traitée'},
                status=status.HTTP_400_BAD_REQUEST
            )

        pub_request.status = PublicationRequest.Status.REJECTED
        pub_request.reviewed_by = request.user
        pub_request.reviewed_at = timezone.now()
        pub_request.review_notes = review_notes
        pub_request.save()

        return Response({'message': 'Demande rejetée'})


class ReviewViewSet(viewsets.ModelViewSet):
    """
    API pour les revues de publication
    """
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filtrage des revues"""
        queryset = Review.objects.all()

        # Filtre par demande de publication
        pub_request_id = self.request.query_params.get('publication_request')
        if pub_request_id:
            queryset = queryset.filter(publication_request_id=pub_request_id)

        # Pour les utilisateurs non-admin, seulement leurs propres revues
        if not self.request.user.is_admin:
            queryset = queryset.filter(reviewer=self.request.user)

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        """Création de revue"""
        serializer.save(reviewer=self.request.user)


class PublicationStatusViewSet(viewsets.ModelViewSet):
    """
    API pour le suivi du statut de publication
    """
    queryset = PublicationStatus.objects.all()
    serializer_class = PublicationStatusSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


class CommunityViewSet(viewsets.ModelViewSet):
    """
    API pour les communautés
    """
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filtrage des communautés"""
        queryset = Community.objects.all()

        # Filtre par tag
        tag = self.request.query_params.get('tag')
        if tag:
            queryset = queryset.filter(tags__contains=[tag])

        # Pour les utilisateurs non-admin, seulement les communautés publiques ou auxquelles ils appartiennent
        if not self.request.user.is_admin:
            queryset = queryset.filter(
                Q(is_private=False) |
                Q(creator=self.request.user) |
                Q(members=self.request.user)
            ).distinct()

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        """Création de communauté"""
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Rejoindre une communauté"""
        community = self.get_object()

        if community.is_private and not request.user.is_admin:
            return Response(
                {'error': 'Cette communauté est privée'},
                status=status.HTTP_403_FORBIDDEN
            )

        if community.members.count() >= community.max_members:
            return Response(
                {'error': 'La communauté est complète'},
                status=status.HTTP_400_BAD_REQUEST
            )

        community.members.add(request.user)
        return Response({'message': 'Vous avez rejoint la communauté'})

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """Quitter une communauté"""
        community = self.get_object()
        community.members.remove(request.user)
        return Response({'message': 'Vous avez quitté la communauté'})


class FriendCircleViewSet(viewsets.ModelViewSet):
    """
    API pour les cercles d'amis
    """
    queryset = FriendCircle.objects.all()
    serializer_class = FriendCircleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filtrage des cercles d'amis"""
        if self.request.user.is_admin:
            return FriendCircle.objects.all()

        # Seulement les cercles créés par l'utilisateur ou auxquels il appartient
        return FriendCircle.objects.filter(
            Q(creator=self.request.user) |
            Q(members=self.request.user)
        ).distinct()

    def perform_create(self, serializer):
        """Création de cercle d'amis"""
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=['post'])
    def invite(self, request, pk=None):
        """Inviter un utilisateur dans le cercle"""
        circle = self.get_object()
        email = request.data.get('email')

        if not email:
            return Response(
                {'error': 'Email requis'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Vérifier que l'utilisateur est le créateur
        if circle.creator != request.user:
            return Response(
                {'error': 'Seul le créateur peut inviter des membres'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Ici, vous enverriez une invitation par email
        # Pour l'instant, on simule
        return Response({
            'message': f'Invitation envoyée à {email}',
            'status': 'pending'
        })


class CircleMembershipViewSet(viewsets.ModelViewSet):
    """
    API pour les adhésions aux cercles
    """
    queryset = CircleMembership.objects.all()
    serializer_class = CircleMembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filtrage des adhésions"""
        if self.request.user.is_admin:
            return CircleMembership.objects.all()

        # Seulement les adhésions de l'utilisateur
        return CircleMembership.objects.filter(user=self.request.user)
