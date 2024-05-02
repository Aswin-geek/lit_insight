from django.urls import path
from .consumers import PersonalChatConsumer

websocket_urlpatterns = [
    path('ws/chat/<int:user_id>', PersonalChatConsumer.as_asgi()),
] 