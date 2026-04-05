from django.shortcuts import render
from django.http import HttpRequest
from django.views.generic.base import TemplateView
# Create your views here.
class FriendsPageView(TemplateView):
    template_name = 'friends_app/friends.html'