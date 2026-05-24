from django.urls import path
from .views import *

urlpatterns = [
    path(route= 'settings/perosnal-info/', view=  PersonalInfoPageView.as_view(), name='personal-info'),
    path(route = 'settings/albums',view = AlbumsPageView.as_view(), name='albums' ),
    path(route='auth/', view= AuthTemplateView.as_view(), name= 'auth'),
    path(route='auth/register/', view= RegisterView.as_view(), name= 'register'),
    path(route='auth/login/', view= LoginView.as_view(), name= 'login'),
    path(route='auth/confirm/', view= ConfirmView.as_view(), name= 'confirm'),
    path(route='logout/', view= LogoutView.as_view(), name= 'logout'),
    path(route='send-mail/', view= SendMail.as_view(), name= 'send-mail'),
    path(route='set-code-sent/', view= SetCodeSent.as_view(), name= 'set-code-sent'),
    path(route="create-username/", view= CreateUsernameView.as_view(), name= 'create-username'),
    path(route='friends/', view= FriendsView.as_view(), name='friends'),
    path(route='friends/<str:section>/', view= FriendSectionView.as_view(), name='friends-section-view'),
    path(route='friends/action/<int:other_user_id>/<str:action>/', view= FriendsActionView.as_view(), name='friends-action')
]