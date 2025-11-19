from rest_framework import serializers
from .models import ExportJob


class ExportJobSerializer(serializers.ModelSerializer):
    """Serializer pour les jobs d'export"""

    class Meta:
        model = ExportJob
        fields = [
            'id', 'user', 'document', 'export_format', 'status',
            'file_path', 'options', 'progress', 'error_message',
            'created_at', 'completed_at', 'filename'
        ]
        read_only_fields = ['id', 'created_at', 'completed_at', 'file_path']

    def create(self, validated_data):
        # Ajouter l'utilisateur connecté
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)