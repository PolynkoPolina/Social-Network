from django.shortcuts import render
from django.http import HttpRequest
from django.views.generic.base import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy

# Create your views here.
class ChatsPageView(LoginRequiredMixin, TemplateView):
    template_name = 'chats_app/chats.html'
    login_url = reverse_lazy("auth")
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["range"] = range(12)
        return context