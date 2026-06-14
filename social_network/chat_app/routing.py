'''
Налаштування маршуртів по протоколу Websocket
(аналог urls.py для Вебсокетів)
'''

from django.urls import path
from .consumers import *


websocket_urlpatterns = [
    path('chat/<int:chat_id>/', ChatConsumer.as_asgi()),
]