from django.urls import path
from .views import *

urlpatterns = [
    path('', ChatsPageView.as_view(), name='chats'),
]