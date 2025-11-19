"""
Sérialiseurs pour l'application publishing
"""
from rest_framework import serializers
from .models import (
    PublicationRequest, Review, PublicationStatus,
    Community, FriendCircle, CircleMembership
)


class PublicationRequestSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les demandes de publication"""
    requested_by_name = serializers.CharField(source='requested_by.get_full_name', read_only=True)
    personal_book_title = serializers.CharField(source='personal_book.title', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = PublicationRequest
        fields = [
            'id', 'personal_book', 'personal_book_title', 'requested_by',
            'requested_by_name', 'submission_notes', 'status', 'status_display',
            'reviewed_by', 'reviewed_by_name', 'review_notes', 'reviewed_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'reviewed_at']


class ReviewSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les revues"""
    reviewer_name = serializers.CharField(source='reviewer.get_full_name', read_only=True)
    publication_request_title = serializers.CharField(
        source='publication_request.personal_book.title',
        read_only=True
    )
    review_type_display = serializers.CharField(source='get_review_type_display', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'publication_request', 'publication_request_title',
            'reviewer', 'reviewer_name', 'review_type', 'review_type_display',
            'rating', 'content', 'recommendations', 'is_public',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PublicationStatusSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le statut de publication"""
    publication_request_title = serializers.CharField(
        source='publication_request.personal_book.title',
        read_only=True
    )
    current_status_display = serializers.CharField(source='get_current_status_display', read_only=True)
    assigned_editor_name = serializers.CharField(source='assigned_editor.get_full_name', read_only=True)

    class Meta:
        model = PublicationStatus
        fields = [
            'id', 'publication_request', 'publication_request_title',
            'current_status', 'current_status_display', 'status_history',
            'assigned_editor', 'assigned_editor_name', 'target_publish_date',
            'actual_publish_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CommunitySerializer(serializers.ModelSerializer):
    """Sérialiseur pour les communautés"""
    creator_name = serializers.CharField(source='creator.get_full_name', read_only=True)
    member_count = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = [
            'id', 'name', 'description', 'creator', 'creator_name',
            'is_private', 'max_members', 'member_count', 'is_member',
            'rules', 'tags', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_member_count(self, obj):
        return obj.members.count()

    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.members.filter(id=request.user.id).exists()
        return False


class FriendCircleSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les cercles d'amis"""
    creator_name = serializers.CharField(source='creator.get_full_name', read_only=True)
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = FriendCircle
        fields = [
            'id', 'name', 'description', 'creator', 'creator_name',
            'is_private', 'member_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_member_count(self, obj):
        return obj.members.count()


class CircleMembershipSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les adhésions aux cercles"""
    circle_name = serializers.CharField(source='circle.name', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    invited_by_name = serializers.CharField(source='invited_by.get_full_name', read_only=True)

    class Meta:
        model = CircleMembership
        fields = [
            'id', 'circle', 'circle_name', 'user', 'user_name',
            'joined_at', 'invited_by', 'invited_by_name'
        ]
        read_only_fields = ['id', 'joined_at']