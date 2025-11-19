import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Message, ReadingReport

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    """
    Consumer WebSocket pour la messagerie en temps réel
    """
    
    async def connect(self):
        """
        Gestion de la connexion WebSocket
        """
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        
        # Rejoindre le groupe de room
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Envoyer un message de connexion
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'system_message',
                'message': f"User joined chat room {self.room_name}",
                'username': 'System'
            }
        )
    
    async def disconnect(self, close_code):
        """
        Gestion de la déconnexion WebSocket
        """
        # Quitter le groupe de room
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
        # Envoyer un message de déconnexion
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'system_message',
                'message': f"User left chat room {self.room_name}",
                'username': 'System'
            }
        )
    
    async def receive(self, text_data):
        """
        Réception d'un message du WebSocket
        """
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type', 'chat_message')
        
        if message_type == 'chat_message':
            message = text_data_json['message']
            sender_id = text_data_json['sender_id']
            receiver_id = text_data_json['receiver_id']
            
            # Sauvegarder le message en base de données
            saved_message = await self.save_message(
                sender_id, receiver_id, message
            )
            
            # Envoyer le message au groupe
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender_id': sender_id,
                    'receiver_id': receiver_id,
                    'timestamp': saved_message.timestamp.isoformat(),
                    'message_id': saved_message.id
                }
            )
    
    async def chat_message(self, event):
        """
        Envoi d'un message de chat au WebSocket
        """
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message'],
            'sender_id': event['sender_id'],
            'receiver_id': event['receiver_id'],
            'timestamp': event['timestamp'],
            'message_id': event['message_id']
        }))
    
    async def system_message(self, event):
        """
        Envoi d'un message système au WebSocket
        """
        await self.send(text_data=json.dumps({
            'type': 'system_message',
            'message': event['message'],
            'username': event['username']
        }))
    
    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, content):
        """
        Sauvegarder un message en base de données (synchrone)
        """
        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)
        
        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            content=content,
            timestamp=timezone.now()
        )
        
        return message


class ReportConsumer(AsyncWebsocketConsumer):
    """
    Consumer WebSocket pour les rapports de lecture en temps réel
    """
    
    async def connect(self):
        """
        Gestion de la connexion WebSocket
        """
        self.book_id = self.scope['url_route']['kwargs']['book_id']
        self.room_group_name = f'reports_{self.book_id}'
        
        # Rejoindre le groupe de room
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        """
        Gestion de la déconnexion WebSocket
        """
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        """
        Réception d'un rapport du WebSocket
        """
        text_data_json = json.loads(text_data)
        report_type = text_data_json.get('type', 'report_message')
        
        if report_type == 'report_message':
            content = text_data_json['content']
            user_id = text_data_json['user_id']
            book_id = text_data_json['book_id']
            
            # Sauvegarder le rapport en base de données
            saved_report = await self.save_report(user_id, book_id, content)
            
            # Envoyer le rapport au groupe
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'report_message',
                    'content': content,
                    'user_id': user_id,
                    'book_id': book_id,
                    'username': saved_report.user.username,
                    'created_at': saved_report.created_at.isoformat(),
                    'report_id': saved_report.id
                }
            )
    
    async def report_message(self, event):
        """
        Envoi d'un rapport au WebSocket
        """
        await self.send(text_data=json.dumps({
            'type': 'report_message',
            'content': event['content'],
            'user_id': event['user_id'],
            'book_id': event['book_id'],
            'username': event['username'],
            'created_at': event['created_at'],
            'report_id': event['report_id']
        }))
    
    @database_sync_to_async
    def save_report(self, user_id, book_id, content):
        """
        Sauvegarder un rapport en base de données (synchrone)
        """
        from books.models import Book  # Assurez-vous que l'app books existe
        
        user = User.objects.get(id=user_id)
        book = Book.objects.get(id=book_id)
        
        # Créer ou mettre à jour le rapport
        report, created = ReadingReport.objects.update_or_create(
            user=user,
            book=book,
            defaults={'content': content}
        )
        
        return report
    



# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from users.models import CollaborationSession, SessionParticipant

class CollaborationConsumer(AsyncWebsocketConsumer):
    """
    Consommateur WebSocket pour la collaboration en temps réel
    Gère les curseurs, la présence et les messages de collaboration
    """
    
    async def connect(self):
        """Connexion WebSocket pour la collaboration"""
        self.document_id = self.scope['url_route']['kwargs']['document_id']
        self.session_group_name = f'collaboration_{self.document_id}'
        
        # Vérifier l'authentification
        if self.scope["user"] == AnonymousUser():
            await self.close()
            return
        
        # Vérifier les permissions
        if not await self._can_access_document():
            await self.close()
            return
        
        # Rejoindre le groupe
        await self.channel_layer.group_add(
            self.session_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Notifier les autres de la nouvelle connexion
        await self.channel_layer.group_send(
            self.session_group_name,
            {
                'type': 'user_joined',
                'user_id': self.scope["user"].id,
                'username': self.scope["user"].username,
            }
        )
    
    async def disconnect(self, close_code):
        """Déconnexion WebSocket"""
        # Quitter le groupe
        await self.channel_layer.group_discard(
            self.session_group_name,
            self.channel_name
        )
        
        # Notifier les autres de la déconnexion
        await self.channel_layer.group_send(
            self.session_group_name,
            {
                'type': 'user_left',
                'user_id': self.scope["user"].id,
                'username': self.scope["user"].username,
            }
        )
    
    async def receive(self, text_data):
        """Réception des messages WebSocket"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'cursor_update':
                await self.handle_cursor_update(data)
            elif message_type == 'text_change':
                await self.handle_text_change(data)
            elif message_type == 'selection_update':
                await self.handle_selection_update(data)
            elif message_type == 'chat_message':
                await self.handle_chat_message(data)
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Message JSON invalide'
            }))
    
    async def handle_cursor_update(self, data):
        """Gérer la mise à jour de position du curseur"""
        position = data.get('position')
        
        # Sauvegarder en base (asynchrone)
        await self._update_cursor_position(position)
        
        # Diffuser aux autres participants
        await self.channel_layer.group_send(
            self.session_group_name,
            {
                'type': 'cursor_updated',
                'user_id': self.scope["user"].id,
                'username': self.scope["user"].username,
                'position': position,
                'timestamp': data.get('timestamp')
            }
        )
    
    async def handle_text_change(self, data):
        """Gérer les changements de texte en temps réel"""
        # Diffuser les changements aux autres participants
        await self.channel_layer.group_send(
            self.session_group_name,
            {
                'type': 'text_changed',
                'user_id': self.scope["user"].id,
                'changes': data.get('changes'),
                'version': data.get('version')
            }
        )
    
    async def handle_selection_update(self, data):
        """Gérer les mises à jour de sélection"""
        await self.channel_layer.group_send(
            self.session_group_name,
            {
                'type': 'selection_updated',
                'user_id': self.scope["user"].id,
                'selection': data.get('selection')
            }
        )
    
    async def handle_chat_message(self, data):
        """Gérer les messages de chat de collaboration"""
        await self.channel_layer.group_send(
            self.session_group_name,
            {
                'type': 'chat_message_received',
                'user_id': self.scope["user"].id,
                'username': self.scope["user"].username,
                'message': data.get('message'),
                'timestamp': data.get('timestamp')
            }
        )
    
    # Handlers pour les messages de groupe
    async def user_joined(self, event):
        """Un nouvel utilisateur a rejoint"""
        await self.send(text_data=json.dumps({
            'type': 'user_joined',
            'user_id': event['user_id'],
            'username': event['username']
        }))
    
    async def user_left(self, event):
        """Un utilisateur a quitté"""
        await self.send(text_data=json.dumps({
            'type': 'user_left',
            'user_id': event['user_id'],
            'username': event['username']
        }))
    
    async def cursor_updated(self, event):
        """Mise à jour du curseur d'un autre utilisateur"""
        await self.send(text_data=json.dumps({
            'type': 'cursor_updated',
            'user_id': event['user_id'],
            'username': event['username'],
            'position': event['position'],
            'timestamp': event['timestamp']
        }))
    
    async def text_changed(self, event):
        """Changement de texte d'un autre utilisateur"""
        await self.send(text_data=json.dumps({
            'type': 'text_changed',
            'user_id': event['user_id'],
            'changes': event['changes'],
            'version': event['version']
        }))
    
    async def selection_updated(self, event):
        """Mise à jour de sélection d'un autre utilisateur"""
        await self.send(text_data=json.dumps({
            'type': 'selection_updated',
            'user_id': event['user_id'],
            'selection': event['selection']
        }))
    
    async def chat_message_received(self, event):
        """Réception d'un message de chat"""
        await self.send(text_data=json.dumps({
            'type': 'chat_message_received',
            'user_id': event['user_id'],
            'username': event['username'],
            'message': event['message'],
            'timestamp': event['timestamp']
        }))
    
    @database_sync_to_async
    def _can_access_document(self):
        """Vérifier asynchrone si l'utilisateur peut accéder au document"""
        from books.models import Book
        try:
            document = Book.objects.get(id=self.document_id)
            return document.is_accessible_by(self.scope["user"])
        except Book.DoesNotExist:
            return False
    
    @database_sync_to_async
    def _update_cursor_position(self, position):
        """Mettre à jour asynchrone la position du curseur en base"""
        try:
            session = CollaborationSession.objects.get(
                document_id=self.document_id,
                is_active=True
            )
            participant = SessionParticipant.objects.get(
                session=session,
                user=self.scope["user"],
                left_at__isnull=True
            )
            participant.cursor_position = position
            participant.save()
        except (CollaborationSession.DoesNotExist, SessionParticipant.DoesNotExist):
            pass