from django.urls import path
from .views import *


urlpatterns = [
    path(route= '', view= ChatView.as_view(), name= "chat"),
    path(route= 'chat_with/<int:user_id>/', view= ChatWithView.as_view(), name= "chat_with"),
    path(route= 'create_group/', view= CreateGroupView.as_view(), name= "create_group"),
    path(route= "<int:chat_id>/messages/", view= MessageHistoryView.as_view(), name= "message_history"),
    path(route= "upload_images/<int:chat_id>/", view= MessageImagesUploadView.as_view(), name= 'message_images_upload'),
    path(route= "read_message/<int:message_id>/", view= ReadMessageView.as_view(), name= 'read_message'),
]