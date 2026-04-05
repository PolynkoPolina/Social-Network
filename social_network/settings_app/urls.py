from django.urls import path
from .views import *

urlpatterns = [
    path('', SettingsPageView.as_view(), name='settings'),
]