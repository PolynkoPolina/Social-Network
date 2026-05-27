from django.shortcuts import render
from django.http import HttpRequest, JsonResponse
from django.views.generic.base import TemplateView, View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.contrib.auth import get_user_model



from .forms import MessageForm
from .models import Chat
from user_app.utils.friends_queries import get_user_by_section
# Create your views here.

User = get_user_model()


class ChatsPageView(LoginRequiredMixin, TemplateView):
    template_name = 'chats_app/chats.html'
    login_url = reverse_lazy("auth")
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["friends"] = get_user_by_section(self.request.user, "friends")
        context["personal_chats"] = Chat.objects.filter(users= self.request.user, is_group= False).order_by("id")

        return context
    


class ChatWithView(LoginRequiredMixin, View):
    login_url = reverse_lazy("auth")
    
    def post(self, request, user_id, *args, **kwargs):
        other_user = User.objects.get(id= user_id)
        friends = get_user_by_section(request.user, "friends")

        if other_user not in friends:
            return JsonResponse({"success": False}, status= 403) 
        
        user_id_chats = Chat.objects.filter(users= request.user, is_group = False).value_list('id', flat = True)
        chat = Chat.objects.filter(id__in= user_id_chats, users= other_user, is_group= False).first()

        if chat is None:
            chat = Chat.objects.create(is_group = False)
            chat.users.add(request.user, other_user)
            
        return JsonResponse(
            {
                "success": True,
                "chat_id": chat.id,
                "username": other_user.username
            }
        )
