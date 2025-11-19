"""
Sérialiseurs pour l'application AI
"""
from rest_framework import serializers
from .models import AIMessage, AIConversation, AIUsageTracking


class AIMessageSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les messages IA"""
    class Meta:
        model = AIMessage
        fields = [
            'id', 'conversation', 'role', 'content', 'tokens_used',
            'model_used', 'confidence_score', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class AIConversationSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les conversations IA"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    message_count = serializers.SerializerMethodField()
    last_message_preview = serializers.SerializerMethodField()

    class Meta:
        model = AIConversation
        fields = [
            'id', 'user', 'user_name', 'title', 'conversation_type',
            'related_book', 'context_data', 'is_active', 'message_count',
            'last_message_preview', 'created_at', 'last_message_at'
        ]
        read_only_fields = ['id', 'created_at', 'last_message_at']

    def get_message_count(self, obj):
        return obj.messages.count()

    def get_last_message_preview(self, obj):
        last_message = obj.messages.order_by('-created_at').first()
        if last_message:
            preview = last_message.content[:100]
            return preview + '...' if len(last_message.content) > 100 else preview
        return None


class AIUsageTrackingSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le suivi d'usage IA"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    estimated_cost_display = serializers.SerializerMethodField()

    class Meta:
        model = AIUsageTracking
        fields = [
            'id', 'user', 'user_name', 'date', 'total_tokens',
            'total_requests', 'total_conversations', 'estimated_cost',
            'estimated_cost_display', 'features_used'
        ]
        read_only_fields = ['id']

    def get_estimated_cost_display(self, obj):
        """Retourne le coût estimé formaté"""
        return f"{obj.estimated_cost:.4f}€"