"""
Sérialiseurs pour la gestion des notifications
"""
from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les notifications
    """
    class Meta:
        model = Notification
        fields = '__all__'


class NotificationCreateSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour créer une notification
    """
    class Meta:
        model = Notification
        fields = ['user', 'title', 'message', 'notification_type', 'related_url']


class MarkAsReadSerializer(serializers.Serializer):
    """
    Sérialiseur pour marquer une notification comme lue
    """
    notification_id = serializers.IntegerField()
    
    def validate(self, data):
        try:
            notification = Notification.objects.get(id=data['notification_id'])
        except Notification.DoesNotExist:
            raise serializers.ValidationError("Notification non trouvée.")
        
        data['notification'] = notification
        return data