from django.urls import path
from .views import *

urlpatterns = [
    path('', PostPageView.as_view(), name='post'),
]