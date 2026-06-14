from django.urls import path
from .consumers import *


websocket_urlpatterns = [
    path('users/online/', OnlineStatusConsumer.as_asgi())
]