"""
Sérialiseurs pour la gestion des utilisateurs,

Ce serialiseur geres l'inscription avec UserRegisterationSerializer,
prends les donnees suivantes: username, email, password, password_confirmation,
first_name, last_name, role, phone, address, date_of_birth, student_id (optionnel), department.

Il y a aussi UserLoginSerializer pour la connexion et la mise à jour des utilisateurs.



la connexion et la mise à jour des utilisateurs.
"""
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from .models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour l'inscription des utilisateurs
    """
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirmation = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password', 'password_confirmation',
            'first_name', 'last_name', 'role', 'phone', 'address',
            'date_of_birth', 'student_id', 'department'
        )
        extra_kwargs = {
            'role': {'required': True},
            'student_id': {'required': False},
        }
    
    def validate(self, data):
        # Vérifier que les mots de passe correspondent
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError({
                'password_confirmation': _("Les mots de passe ne correspondent pas.")
            })
        
        # Validation spécifique selon le rôle
        role = data.get('role')
        if role == User.Role.STUDENT and not data.get('student_id'):  # Si le rôle est étudiant, student_id est requis
            raise serializers.ValidationError({
                'student_id': _("Le numéro étudiant est requis pour les étudiants.")
            })
        
        return data
    
    def create(self, validated_data):
        # Retirer le champ de confirmation du mot de passe
        validated_data.pop('password_confirmation')
        
        # Créer l'utilisateur
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Sérialiseur pour la connexion des utilisateurs
    """
    email = serializers.EmailField()  # Changé de CharField à EmailField
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        print(f"Tentative de connexion avec email: {email}")
        
        if email and password:
            # Méthode 1: Rechercher l'utilisateur par email d'abord
            try:
                user = User.objects.get(email=email)
                print(f"Utilisateur trouvé: {user.username}")
                
                # Puis authentifier avec le username
                user = authenticate(username=user.username, password=password)
                print(f"Résultat authenticate: {user}")
                
            except User.DoesNotExist:
                user = None
                print("Aucun utilisateur trouvé avec cet email")
            
            # Méthode alternative: Authentification directe avec email
            # Si votre backend d'authentification supporte l'email
            if not user:
                user = authenticate(email=email, password=password)
                print(f"Résultat authenticate avec email: {user}")

            if not user:
                raise serializers.ValidationError(
                    _("Identifiants invalides. Veuillez réessayer.")
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    _("Ce compte a été désactivé.")
                )
            
            data['user'] = user
            return data
        
        raise serializers.ValidationError(
            _("L'email et le mot de passe sont requis.")
        )


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour le profil utilisateur
    """
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone', 'address', 'date_of_birth',
            'student_id', 'department', 'email_notifications',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'username', 'role', 'created_at', 'updated_at')


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour la mise à jour du profil utilisateur
    """
    class Meta:
        model = User
        fields = (
            'first_name', 'last_name', 'email', 'phone', 
            'address', 'date_of_birth', 'email_notifications'
        )










        # serializers.py
from rest_framework import serializers
from .models import UserSubscription, AIConfiguration, DocumentVersion, CollaborationSession, SessionParticipant, ExportJob

class UserSubscriptionSerializer(serializers.ModelSerializer):
    """Serializer pour la gestion des abonnements utilisateurs"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    days_remaining = serializers.SerializerMethodField()

    class Meta:
        model = UserSubscription
        fields = [
            'id', 'user', 'user_email', 'user_name', 'plan_type', 'stripe_subscription_id',
            'features', 'expires_at', 'is_active', 'days_remaining', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_days_remaining(self, obj):
        """Calcul du nombre de jours restants dans l'abonnement"""
        if obj.expires_at:
            from django.utils import timezone
            remaining = obj.expires_at - timezone.now()
            return max(0, remaining.days)
        return None

class AIConfigurationSerializer(serializers.ModelSerializer):
    """Serializer pour la configuration IA"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    usage_percentage = serializers.SerializerMethodField()

    class Meta:
        model = AIConfiguration
        fields = [
            'id', 'user', 'user_email', 'is_active', 'allowed_features',
            'usage_limits', 'current_usage', 'usage_percentage', 'last_reset_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_usage_percentage(self, obj):
        """Calcul du pourcentage d'utilisation des limites IA"""
        if not obj.usage_limits or not obj.current_usage:
            return 0
        
        total_used = 0
        total_limit = 0
        
        for feature, limit in obj.usage_limits.items():
            if feature in obj.current_usage:
                used = obj.current_usage[feature]
                total_used += used
                total_limit += limit
        
        if total_limit == 0:
            return 0
        
        return min(100, int((total_used / total_limit) * 100))

class DocumentVersionSerializer(serializers.ModelSerializer):
    """Serializer pour le versionning des documents"""
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    document_title = serializers.CharField(source='document.title', read_only=True)

    class Meta:
        model = DocumentVersion
        fields = [
            'id', 'document', 'document_title', 'version_number', 'content',
            'changes', 'word_count', 'created_by', 'created_by_name',
            'created_at', 'is_auto_save'
        ]
        read_only_fields = ['id', 'created_at']

class CollaborationSessionSerializer(serializers.ModelSerializer):
    """Serializer pour les sessions de collaboration"""
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    document_title = serializers.CharField(source='document.title', read_only=True)
    active_participants_count = serializers.SerializerMethodField()

    class Meta:
        model = CollaborationSession
        fields = [
            'id', 'document', 'document_title', 'created_by', 'created_by_name',
            'is_active', 'created_at', 'ended_at', 'active_participants_count'
        ]
        read_only_fields = ['id', 'created_at']

    def get_active_participants_count(self, obj):
        """Nombre de participants actifs dans la session"""
        return obj.participants.filter(left_at__isnull=True).count()

class SessionParticipantSerializer(serializers.ModelSerializer):
    """Serializer pour les participants aux sessions"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = SessionParticipant
        fields = [
            'id', 'session', 'user', 'user_name', 'user_email', 'role',
            'joined_at', 'left_at', 'cursor_position'
        ]
        read_only_fields = ['id', 'joined_at']

class ExportJobSerializer(serializers.ModelSerializer):
    """Serializer pour les jobs d'exportation"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    document_title = serializers.CharField(source='document.title', read_only=True)
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = ExportJob
        fields = [
            'id', 'user', 'user_name', 'document', 'document_title',
            'export_format', 'status', 'file_path', 'download_url',
            'progress', 'error_message', 'created_at', 'completed_at'
        ]
        read_only_fields = ['id', 'created_at', 'completed_at']

    def get_download_url(self, obj):
        """URL de téléchargement si l'export est terminé"""
        if obj.status == 'completed' and obj.file_path:
            return f"/api/exports/download/{obj.id}/"
        return None