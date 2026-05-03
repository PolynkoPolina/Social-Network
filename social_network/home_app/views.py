from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy

# Create your views here.

class HomePageView(LoginRequiredMixin, TemplateView):
    template_name = 'main_app/home.html'
    login_url = reverse_lazy("auth")