from django.urls import path
from .views import *

urlpatterns = [
    path('', ChatsPageView.as_view(), name='chats'),
    path(route= 'chat_with/<int:user_id>/', view= ChatWithView.as_view(), name= "chat")

]