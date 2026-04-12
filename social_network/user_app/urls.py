from django.urls import path
from .views import *

urlpatterns = [
    path('perosnal-info/', PersonalInfoPageView.as_view(), name='personal-info'),
    path('albums/', AlbumsPageView.as_view(), name='albums'),
]