from django.urls import path
from .views import *

urlpatterns = [
    path('', FriendsMainPageView.as_view(), name='friends_main'),
    path('all/', AllFriendsPageView.as_view(), name='friends_all'),
    path('recommendations/', FriendsRecommendationsPageView.as_view(), name='friends_recommendations'),
    path('requests/', FriendsRequestsPageView.as_view(), name='friends_requests'),
]