"""
Sérialiseurs pour l'application groups
"""
from rest_framework import serializers
from .models import ReadingGroup, GroupMember, Club, ClubGroup, Message


class GroupMemberSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les membres de groupe"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = GroupMember
        fields = [
            'id', 'user', 'user_name', 'user_email', 'role',
            'joined_at', 'is_active'
        ]
        read_only_fields = ['id', 'joined_at']


class ReadingGroupSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les groupes de lecture"""
    creator_name = serializers.CharField(source='creator.get_full_name', read_only=True)
    member_count = serializers.SerializerMethodField()
    current_book_title = serializers.CharField(source='current_book.title', read_only=True)
    members = GroupMemberSerializer(many=True, read_only=True)

    class Meta:
        model = ReadingGroup
        fields = [
            'id', 'name', 'description', 'creator', 'creator_name',
            'current_book', 'current_book_title', 'max_members', 'member_count',
            'is_private', 'status', 'members', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_member_count(self, obj):
        return obj.members.filter(is_active=True).count()


class ClubGroupSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les groupes de club"""
    leader_name = serializers.CharField(source='leader.get_full_name', read_only=True)
    club_name = serializers.CharField(source='club.name', read_only=True)

    class Meta:
        model = ClubGroup
        fields = [
            'id', 'club', 'club_name', 'name', 'description',
            'leader', 'leader_name', 'max_members', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ClubSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les clubs"""
    founder_name = serializers.CharField(source='founder.get_full_name', read_only=True)
    member_count = serializers.SerializerMethodField()
    groups = ClubGroupSerializer(many=True, read_only=True)

    class Meta:
        model = Club
        fields = [
            'id', 'name', 'description', 'club_type', 'founder', 'founder_name',
            'max_members', 'member_count', 'is_private', 'meeting_schedule',
            'rules', 'tags', 'groups', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_member_count(self, obj):
        return obj.members.count()


class MessageSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les messages"""
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    recipient_name = serializers.CharField(source='recipient.get_full_name', read_only=True)
    reading_group_name = serializers.CharField(source='reading_group.name', read_only=True)
    club_name = serializers.CharField(source='club.name', read_only=True)
    club_group_name = serializers.CharField(source='club_group.name', read_only=True)

    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'sender_name', 'content', 'message_type',
            'reading_group', 'reading_group_name', 'club', 'club_name',
            'club_group', 'club_group_name', 'recipient', 'recipient_name',
            'is_edited', 'edited_at', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'edited_at']

    def validate(self, data):
        """Validation pour s'assurer qu'un message appartient à un contexte valide"""
        context_fields = ['reading_group', 'club', 'club_group', 'recipient']
        context_count = sum(1 for field in context_fields if data.get(field))

        if context_count == 0:
            raise serializers.ValidationError(
                "Un message doit appartenir à un groupe de lecture, un club, un groupe de club ou être un message direct."
            )

        if context_count > 1:
            raise serializers.ValidationError(
                "Un message ne peut appartenir qu'à un seul contexte."
            )

        return data