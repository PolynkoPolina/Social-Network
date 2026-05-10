from django.shortcuts import render
from django.http import HttpRequest
from django.views.generic.base import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
# Create your views here.
class ChatsPageView(TemplateView, LoginRequiredMixin):
    template_name = 'chats_app/chats.html'
