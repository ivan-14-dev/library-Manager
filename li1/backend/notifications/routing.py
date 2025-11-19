from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # WebSocket pour la messagerie
    re_path(
        r'ws/chat/(?P<room_name>\w+)/$',
        consumers.ChatConsumer.as_asgi()
    ),

    # WebSocket pour les rapports de lecture
    re_path(
        r'ws/reports/(?P<book_id>\w+)/$',
        consumers.ReportConsumer.as_asgi()
    ),

    # WebSocket pour la collaboration en temps réel
    re_path(
        r'ws/collaboration/(?P<document_id>\w+)/$',
        consumers.CollaborationConsumer.as_asgi()
    ),
]