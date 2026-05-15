from django.shortcuts import render
from django.http import HttpRequest
from django.views.generic.base import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy

# Create your views here.
class ChatsPageView(TemplateView, LoginRequiredMixin):
    template_name = 'chats_app/chats.html'
    login_url = reverse_lazy("auth")

