from django.urls import path
from .views import *

urlpatterns = [
    path(route='create/', view= PostCreateView.as_view(), name= 'create_post'),
    path(route='', view= PostPageView.as_view(), name= 'posts'),
    
]