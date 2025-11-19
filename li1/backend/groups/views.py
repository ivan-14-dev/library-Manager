"""
Vues pour la gestion des groupes de lecture et clubs
"""
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.translation import gettext_lazy as _
from django.db.models import Q
from .models import ReadingGroup, GroupMember, Club, ClubGroup, Message
from .serializers import (
    ReadingGroupSerializer, GroupMemberSerializer, ClubSerializer,
    ClubGroupSerializer, MessageSerializer
)
from users.permissions import IsStudentOrHigher, IsProfessorOrAdmin


class ReadingGroupViewSet(viewsets.ModelViewSet):
    """
    API pour la gestion des groupes de lecture
    """
    queryset = ReadingGroup.objects.all()
    serializer_class = ReadingGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filtrage selon les permissions et l'utilisateur"""
        queryset = ReadingGroup.objects.all()

        # Filtre par statut
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # Pour les utilisateurs non-admin, seulement les groupes publics ou auxquels ils appartiennent
        if not self.request.user.is_staff:
            queryset = queryset.filter(
                Q(is_private=False) |
                Q(creator=self.request.user) |
                Q(members__user=self.request.user)
            ).distinct()

        return queryset

    def perform_create(self, serializer):
        """Création de groupe avec le créateur comme premier membre admin"""
        group = serializer.save(creator=self.request.user)

        # Ajouter le créateur comme membre admin
        GroupMember.objects.create(
            group=group,
            user=self.request.user,
            role='ADMIN'
        )

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Rejoindre un groupe de lecture"""
        group = self.get_object()

        # Vérifier si le groupe est privé
        if group.is_private and not request.user.is_staff:
            return Response(
                {'error': 'Ce groupe est privé'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Vérifier si l'utilisateur est déjà membre
        if GroupMember.objects.filter(group=group, user=request.user).exists():
            return Response(
                {'error': 'Vous êtes déjà membre de ce groupe'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Vérifier la limite de membres
        if group.members.count() >= group.max_members:
            return Response(
                {'error': 'Le groupe est complet'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Créer l'adhésion
        GroupMember.objects.create(
            group=group,
            user=request.user,
            role='MEMBER'
        )

        return Response({'message': 'Vous avez rejoint le groupe'})

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """Quitter un groupe de lecture"""
        group = self.get_object()

        try:
            membership = GroupMember.objects.get(group=group, user=request.user)
            membership.delete()
            return Response({'message': 'Vous avez quitté le groupe'})
        except GroupMember.DoesNotExist:
            return Response(
                {'error': 'Vous n\'êtes pas membre de ce groupe'},
                status=status.HTTP_400_BAD_REQUEST
            )


class ClubViewSet(viewsets.ModelViewSet):
    """
    API pour la gestion des clubs
    """
    queryset = Club.objects.all()
    serializer_class = ClubSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filtrage selon les permissions"""
        queryset = Club.objects.all()

        # Filtre par type de club
        club_type = self.request.query_params.get('type')
        if club_type:
            queryset = queryset.filter(club_type=club_type)

        # Pour les utilisateurs non-admin, seulement les clubs publics ou auxquels ils appartiennent
        if not self.request.user.is_staff:
            queryset = queryset.filter(
                Q(is_private=False) |
                Q(founder=self.request.user) |
                Q(members__user=self.request.user)
            ).distinct()

        return queryset

    def perform_create(self, serializer):
        """Création de club avec le fondateur"""
        serializer.save(founder=self.request.user)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Rejoindre un club"""
        club = self.get_object()

        if club.is_private and not request.user.is_staff:
            return Response(
                {'error': 'Ce club est privé'},
                status=status.HTTP_403_FORBIDDEN
            )

        if club.members.count() >= club.max_members:
            return Response(
                {'error': 'Le club est complet'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Créer l'adhésion (via le modèle through)
        club.members.add(request.user)

        return Response({'message': 'Vous avez rejoint le club'})

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """Quitter un club"""
        club = self.get_object()
        club.members.remove(request.user)
        return Response({'message': 'Vous avez quitté le club'})


class MessageViewSet(viewsets.ModelViewSet):
    """
    API pour la gestion des messages dans les groupes et clubs
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filtrage des messages selon l'appartenance aux groupes/clubs"""
        queryset = Message.objects.all()

        # Filtre par groupe de lecture
        reading_group_id = self.request.query_params.get('reading_group')
        if reading_group_id:
            queryset = queryset.filter(reading_group_id=reading_group_id)

        # Filtre par club
        club_id = self.request.query_params.get('club')
        if club_id:
            queryset = queryset.filter(club_id=club_id)

        # Filtre par groupe de club
        club_group_id = self.request.query_params.get('club_group')
        if club_group_id:
            queryset = queryset.filter(club_group_id=club_group_id)

        # Pour les utilisateurs non-admin, seulement les messages des groupes auxquels ils appartiennent
        if not self.request.user.is_staff:
            queryset = queryset.filter(
                Q(reading_group__members__user=self.request.user) |
                Q(club__members__user=self.request.user) |
                Q(club_group__club__members__user=self.request.user) |
                Q(recipient=self.request.user)
            ).distinct()

        return queryset

    def perform_create(self, serializer):
        """Création de message avec l'expéditeur"""
        serializer.save(sender=self.request.user)


# Vues individuelles pour compatibilité
class JoinReadingGroupView(generics.GenericAPIView):
    """Vue pour rejoindre un groupe de lecture"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, group_id):
        try:
            group = ReadingGroup.objects.get(id=group_id)
            viewset = ReadingGroupViewSet()
            viewset.request = request
            viewset.kwargs = {'pk': group_id}
            return viewset.join(request)
        except ReadingGroup.DoesNotExist:
            return Response(
                {'error': 'Groupe non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )


class LeaveReadingGroupView(generics.GenericAPIView):
    """Vue pour quitter un groupe de lecture"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, group_id):
        try:
            group = ReadingGroup.objects.get(id=group_id)
            viewset = ReadingGroupViewSet()
            viewset.request = request
            viewset.kwargs = {'pk': group_id}
            return viewset.leave(request)
        except ReadingGroup.DoesNotExist:
            return Response(
                {'error': 'Groupe non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )


class JoinClubView(generics.GenericAPIView):
    """Vue pour rejoindre un club"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, club_id):
        try:
            club = Club.objects.get(id=club_id)
            viewset = ClubViewSet()
            viewset.request = request
            viewset.kwargs = {'pk': club_id}
            return viewset.join(request)
        except Club.DoesNotExist:
            return Response(
                {'error': 'Club non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )


class LeaveClubView(generics.GenericAPIView):
    """Vue pour quitter un club"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, club_id):
        try:
            club = Club.objects.get(id=club_id)
            viewset = ClubViewSet()
            viewset.request = request
            viewset.kwargs = {'pk': club_id}
            return viewset.leave(request)
        except Club.DoesNotExist:
            return Response(
                {'error': 'Club non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )


class ClubGroupListView(generics.ListAPIView):
    """Vue pour lister les groupes d'un club"""
    serializer_class = ClubGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        club_id = self.kwargs.get('club_id')
        return ClubGroup.objects.filter(club_id=club_id)
