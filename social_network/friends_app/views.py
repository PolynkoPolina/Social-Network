from django.shortcuts import render
from django.http import HttpRequest
from django.views.generic.base import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy

# Create your views here.
class FriendsMainPageView(TemplateView, LoginRequiredMixin):
    template_name = 'friends_app/friends_main.html'
    login_url = reverse_lazy("auth")

class AllFriendsPageView(TemplateView, LoginRequiredMixin):
    template_name = 'friends_app/all_friends.html'
    login_url = reverse_lazy("auth")

class FriendsRecommendationsPageView(TemplateView, LoginRequiredMixin):
    template_name = 'friends_app/friends_recommendations.html'
    login_url = reverse_lazy("auth")

class FriendsRequestsPageView(TemplateView, LoginRequiredMixin):
    template_name = 'friends_app/friends_requests.html'
    login_url = reverse_lazy("auth")
