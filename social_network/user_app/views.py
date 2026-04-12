from django.shortcuts import render
from django.http import HttpRequest
from django.views.generic.base import TemplateView
# Create your views here.
class PersonalInfoPageView(TemplateView):
    template_name = 'user_app/settings_personal_info.html'


class AlbumsPageView(TemplateView):
    template_name = 'user_app/settings_albums.html'