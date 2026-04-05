from django.shortcuts import render
from django.http import HttpRequest
from django.views.generic.base import TemplateView
# Create your views here.
class ChatsPageView(TemplateView):
    template_name = 'chats_app/chats.html'
