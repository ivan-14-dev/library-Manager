"""
Vues pour l'assistant IA et les fonctionnalités d'aide
"""
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.translation import gettext_lazy as _
from .models import AIMessage, AIConversation, AIUsageTracking
from .serializers import (
    AIMessageSerializer, AIConversationSerializer, AIUsageTrackingSerializer
)
from users.permissions import HasActiveSubscription, HasPremiumSubscription


class AIConversationViewSet(viewsets.ModelViewSet):
    """
    API pour la gestion des conversations IA
    """
    queryset = AIConversation.objects.all()
    serializer_class = AIConversationSerializer
    permission_classes = [permissions.IsAuthenticated, HasActiveSubscription]

    def get_queryset(self):
        """Filtrage par utilisateur"""
        return AIConversation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Création de conversation avec l'utilisateur"""
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """Envoyer un message dans la conversation"""
        conversation = self.get_object()
        content = request.data.get('content')

        if not content:
            return Response(
                {'error': 'Le contenu du message est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Créer le message utilisateur
        user_message = AIMessage.objects.create(
            conversation=conversation,
            role=AIMessage.MessageRole.USER,
            content=content
        )

        # Simuler une réponse IA (à remplacer par un vrai appel IA)
        ai_response = self._generate_ai_response(content, conversation.conversation_type)

        ai_message = AIMessage.objects.create(
            conversation=conversation,
            role=AIMessage.MessageRole.ASSISTANT,
            content=ai_response,
            tokens_used=len(content.split()) + len(ai_response.split())  # Estimation simple
        )

        # Mettre à jour la conversation
        conversation.last_message_at = ai_message.created_at
        conversation.save()

        # Mettre à jour le suivi d'usage
        self._update_usage_tracking(request.user, ai_message.tokens_used)

        return Response({
            'user_message': AIMessageSerializer(user_message).data,
            'ai_message': AIMessageSerializer(ai_message).data
        })

    def _generate_ai_response(self, user_message, conversation_type):
        """Génère une réponse IA simulée basée sur le type de conversation"""
        responses = {
            AIConversation.ConversationType.GENERAL: [
                "Je suis là pour vous aider ! Comment puis-je vous assister avec la bibliothèque ?",
                "Pouvez-vous me donner plus de détails sur ce que vous recherchez ?",
                "Je peux vous aider avec des recommandations de livres, des informations sur les emprunts, ou des conseils de lecture."
            ],
            AIConversation.ConversationType.WRITING: [
                "Pour améliorer votre texte, concentrez-vous sur la clarté et la structure. Avez-vous une section spécifique à retravailler ?",
                "Voici quelques conseils d'écriture : utilisez des phrases variées, soyez concis, et assurez-vous que chaque paragraphe a un objectif clair.",
                "Votre style d'écriture semble déjà très élaboré. Souhaitez-vous des suggestions spécifiques pour tel ou tel aspect ?"
            ],
            AIConversation.ConversationType.RESEARCH: [
                "Pour votre recherche, je recommande de commencer par les ouvrages de référence dans notre catalogue. Quel est le sujet principal ?",
                "Voici une stratégie de recherche efficace : commencez par des sources générales, puis approfondissez avec des études spécialisées.",
                "Je peux vous aider à identifier des sources pertinentes et à organiser votre recherche académique."
            ]
        }

        import random
        type_responses = responses.get(conversation_type, responses[AIConversation.ConversationType.GENERAL])
        return random.choice(type_responses)

    def _update_usage_tracking(self, user, tokens_used):
        """Met à jour le suivi d'usage IA"""
        today = timezone.now().date()
        tracking, created = AIUsageTracking.objects.get_or_create(
            user=user,
            date=today,
            defaults={'total_tokens': 0, 'total_requests': 0, 'total_conversations': 0}
        )

        tracking.total_tokens += tokens_used
        tracking.total_requests += 1
        tracking.save()


class AIMessageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API pour lire les messages IA (lecture seule)
    """
    serializer_class = AIMessageSerializer
    permission_classes = [permissions.IsAuthenticated, HasActiveSubscription]

    def get_queryset(self):
        """Filtrage par conversation de l'utilisateur"""
        conversation_id = self.request.query_params.get('conversation')
        if conversation_id:
            return AIMessage.objects.filter(
                conversation__user=self.request.user,
                conversation_id=conversation_id
            )
        return AIMessage.objects.filter(conversation__user=self.request.user)


class AIUsageTrackingViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API pour consulter l'usage IA
    """
    serializer_class = AIUsageTrackingSerializer
    permission_classes = [permissions.IsAuthenticated, HasActiveSubscription]

    def get_queryset(self):
        """Seulement l'usage de l'utilisateur connecté"""
        return AIUsageTracking.objects.filter(user=self.request.user)


class AIHelpView(generics.GenericAPIView):
    """
    Vue pour l'aide générale IA
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Retourne des informations sur les fonctionnalités IA disponibles"""
        user = request.user
        available_features = []

        # Vérifier l'abonnement
        has_subscription = user.has_active_subscription()
        has_premium = user.has_premium_access()

        if has_subscription:
            available_features.extend([
                {
                    'id': 'chat',
                    'name': 'Assistant conversationnel',
                    'description': 'Discutez avec l\'IA pour obtenir de l\'aide générale',
                    'available': True
                },
                {
                    'id': 'writing',
                    'name': 'Aide à la rédaction',
                    'description': 'Obtenez des suggestions pour améliorer vos textes',
                    'available': True
                }
            ])

        if has_premium:
            available_features.extend([
                {
                    'id': 'research',
                    'name': 'Recherche assistée',
                    'description': 'Aide pour la recherche académique et documentaire',
                    'available': True
                },
                {
                    'id': 'advanced_writing',
                    'name': 'Rédaction avancée',
                    'description': 'Outils avancés d\'analyse et de génération de texte',
                    'available': True
                }
            ])

        return Response({
            'features': available_features,
            'subscription': {
                'has_active': has_subscription,
                'has_premium': has_premium,
                'plan_type': user.subscription.plan_type if user.subscription else None
            },
            'usage_limits': self._get_usage_limits(user)
        })

    def _get_usage_limits(self, user):
        """Retourne les limites d'usage selon l'abonnement"""
        if user.has_premium_access():
            return {
                'daily_requests': 1000,
                'monthly_tokens': 50000,
                'conversations_per_day': 50
            }
        elif user.has_active_subscription():
            return {
                'daily_requests': 100,
                'monthly_tokens': 5000,
                'conversations_per_day': 10
            }
        else:
            return {
                'daily_requests': 0,
                'monthly_tokens': 0,
                'conversations_per_day': 0
            }


class AIWritingAssistantView(generics.GenericAPIView):
    """
    Vue spécialisée pour l'assistant d'écriture IA
    """
    permission_classes = [permissions.IsAuthenticated, HasActiveSubscription]

    def post(self, request):
        """Traite une demande d'aide à l'écriture"""
        text = request.data.get('text')
        help_type = request.data.get('help_type', 'general')

        if not text:
            return Response(
                {'error': 'Le texte est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Générer des suggestions d'écriture
        suggestions = self._generate_writing_suggestions(text, help_type)

        # Mettre à jour le suivi d'usage
        self._update_usage_tracking(request.user, len(text.split()))

        return Response({
            'suggestions': suggestions,
            'help_type': help_type,
            'text_length': len(text)
        })

    def _generate_writing_suggestions(self, text, help_type):
        """Génère des suggestions d'écriture simulées"""
        suggestions = []

        if help_type == 'grammar':
            suggestions = [
                "Vérifiez l'accord des participes passés",
                "Assurez-vous de la concordance des temps verbaux",
                "Contrôlez la ponctuation des phrases complexes"
            ]
        elif help_type == 'style':
            suggestions = [
                "Utilisez des phrases de longueur variée pour plus de dynamisme",
                "Remplacez les mots répétitifs par des synonymes",
                "Adoptez un ton plus formel pour ce type de document"
            ]
        elif help_type == 'structure':
            suggestions = [
                "Commencez par une introduction claire et engageante",
                "Organisez vos idées en paragraphes logiques",
                "Terminez par une conclusion qui résume vos points principaux"
            ]
        else:
            suggestions = [
                "Votre texte est bien structuré",
                "Considérez ajouter des exemples concrets",
                "La clarté de votre propos est appréciable"
            ]

        return suggestions

    def _update_usage_tracking(self, user, tokens_used):
        """Met à jour le suivi d'usage IA"""
        from django.utils import timezone
        today = timezone.now().date()
        tracking, created = AIUsageTracking.objects.get_or_create(
            user=user,
            date=today,
            defaults={'total_tokens': 0, 'total_requests': 0, 'total_conversations': 0}
        )

        tracking.total_tokens += tokens_used
        tracking.total_requests += 1
        tracking.save()
