from django.urls import path
from .views import *

urlpatterns = [
    path(route='create/', view= PostCreateView.as_view(), name= 'create_post'),
    path(route='add_tag/', view= AddTag.as_view(), name= 'add_tag'),
    path('<str:username>/', PostListView.as_view(), name='post'),
    path('delete_post/<int:id>', DeletePostView.as_view(), name='delete_post'),
    
]