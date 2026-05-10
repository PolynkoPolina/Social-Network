from django.shortcuts import render
from django.http import HttpRequest
from django.views.generic.base import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
# Create your views here.
class FriendsMainPageView(TemplateView, LoginRequiredMixin):
    template_name = 'friends_app/friends_main.html'

class AllFriendsPageView(TemplateView, LoginRequiredMixin):
    template_name = 'friends_app/all_friends.html'

class FriendsRecommendationsPageView(TemplateView, LoginRequiredMixin):
    template_name = 'friends_app/friends_recommendations.html'

class FriendsRequestsPageView(TemplateView, LoginRequiredMixin):
    template_name = 'friends_app/friends_requests.html'