from django.urls import path
from .views import *

urlpatterns = [
    path('', FriendsPageView.as_view(), name='friends'),
]