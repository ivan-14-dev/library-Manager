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
        if role == User.Role.STUDENT and not data.get('student_id'):
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
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            
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
            _("Le nom d'utilisateur et le mot de passe sont requis.")
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