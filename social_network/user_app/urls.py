from django.urls import path
from .views import *

urlpatterns = [
    path(route= 'settings/perosnal-info/', view=  PersonalInfoPageView.as_view(), name='personal-info'),
    path(route = 'settings/',view = AlbumsPageView.as_view(), name='settings'),
    path(route='auth/', view= AuthTemplateView.as_view(), name= 'auth'),
    path(route='auth/register/', view= RegisterView.as_view(), name= 'register'),
    path(route='auth/login/', view= LoginView.as_view(), name= 'login'),
    path(route='auth/confirm/', view= ConfirmView.as_view(), name= 'confirm'),
    path(route='logout/', view= LogoutView.as_view(), name= 'logout'),
    path(route='send-mail/', view= SendMail.as_view(), name= 'send-mail'),
]