from django.shortcuts import render
from django.http import HttpRequest
from django.views.generic.base import TemplateView
# Create your views here.
class SettingsPageView(TemplateView):
    template_name = 'settings_app/settings.html'