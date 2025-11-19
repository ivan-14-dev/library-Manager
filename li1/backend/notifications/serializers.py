from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Notification, Message, ReadingReport, BookRating

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer basique pour l'affichage des utilisateurs
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer pour les notifications
    """
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'title', 'message', 'notification_type',
            'is_read', 'created_at', 'related_object_id', 'related_content_type'
        ]
        read_only_fields = ['user', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    """
    Serializer pour les messages
    """
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    sender_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        source='sender'
    )
    receiver_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        source='receiver'
    )
    
    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'receiver', 'sender_id', 'receiver_id',
            'content', 'timestamp', 'is_read'
        ]
        read_only_fields = ['sender', 'timestamp']


class ReadingReportSerializer(serializers.ModelSerializer):
    """
    Serializer pour les rapports de lecture
    """
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        source='user'
    )
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),  # À adapter selon votre modèle Book
        write_only=True,
        source='book'
    )
    
    class Meta:
        model = ReadingReport
        fields = [
            'id', 'user', 'user_id', 'book', 'book_id', 'book_title',
            'content', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']


class BookRatingSerializer(serializers.ModelSerializer):
    """
    Serializer pour la notation des livres
    """
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        source='user'
    )
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),  # À adapter selon votre modèle Book
        write_only=True,
        source='book'
    )
    
    class Meta:
        model = BookRating
        fields = [
            'id', 'user', 'user_id', 'book', 'book_id', 'book_title',
            'rating', 'comment', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def validate_rating(self, value):
        """
        Validation personnalisée pour la note
        """
        if not 1 <= value <= 5:
            raise serializers.ValidationError("La note doit être entre 1 et 5.")
        return value