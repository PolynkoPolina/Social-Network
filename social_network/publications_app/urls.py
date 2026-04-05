from django.urls import path
from .views import *

urlpatterns = [
    path('', PublicationsPageView.as_view(), name='publications'),
]