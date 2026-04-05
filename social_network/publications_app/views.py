from django.shortcuts import render
from django.http import HttpRequest
from django.views.generic.base import TemplateView
# Create your views here.
class PublicationsPageView(TemplateView):
    template_name = 'publications_app/publications.html'
