from django.shortcuts import render
from django.http import HttpRequest
from django.views.generic.base import TemplateView
# Create your views here.
class FriendsMainPageView(TemplateView):
    template_name = 'friends_app/friends_main.html'

class AllFriendsPageView(TemplateView):
    template_name = 'friends_app/all_friends.html'

class FriendsRecommendationsPageView(TemplateView):
    template_name = 'friends_app/friends_recommendations.html'

class FriendsRequestsPageView(TemplateView):
    template_name = 'friends_app/friends_requests.html'