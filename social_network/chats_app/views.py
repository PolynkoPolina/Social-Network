from django.shortcuts import render
from django.http import HttpRequest, JsonResponse
from django.views.generic.base import TemplateView, View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.contrib.auth import get_user_model
from django.core.paginator import Paginator
from django.utils import timezone

from .models import Chat, Message
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
        context['group_chats'] = Chat.objects.filter(users=self.request.user, is_group=True).order_by('id')
        return context
    
class MessageHistoryView(LoginRequiredMixin, View):
    login_url = "auth"

    def get(self, request, chat_id):
        if not Chat.objects.filter(id=chat_id, users=request.user).exists():
            return JsonResponse({"success": False}, status=403)

       
        query = Message.objects.filter(chat_id=chat_id).select_related("sender").order_by("-created_at", "-id")
        page_obj = Paginator(query, 10).get_page(request.GET.get("page", 1))
        messages = list(page_obj.object_list)[::-1]

        return JsonResponse(
            {
                "messages": [
                    {
                        "id": message.id, 
                        "text": message.text, 
                        "sender": message.sender.email,
                        'created_at': timezone.localtime(message.created_at).isoformat()
                    }
                    for message in messages
                ],
                "has_next": page_obj.has_next(),
            }
        )
    

class ChatWithView(LoginRequiredMixin, View):
    login_url = reverse_lazy("auth")
    
    def post(self, request, user_id, *args, **kwargs):
        other_user = User.objects.get(id= user_id)
        friends = get_user_by_section(request.user, "friends")

        if other_user not in friends:
            return JsonResponse({"success": False}, status= 403) 
        
        user_id_chats = Chat.objects.filter(users= request.user, is_group = False).values_list('id', flat = True)
        chat = Chat.objects.filter(id__in= user_id_chats, users= other_user, is_group= False).first()
        chat_users_count = 2
        if chat is None:
            chat = Chat.objects.create(is_group = False)
            chat.users.add(request.user, other_user)
            
        return JsonResponse(
            {
                "success": True,
                "chat_id": chat.id,
                "username": other_user.username,
                "users_count": chat_users_count
            }
        )


class CreateGroupView(LoginRequiredMixin, View):
    login_url = reverse_lazy('auth')

    def post(self, request):
        name = request.POST.get("name", "").strip()
        user_ids  = request.POST.getlist("users")

        if not name:
            return JsonResponse({"success": False, "error": "name required"}, status=400)
        
        
        friend_ids = get_user_by_section(request.user, 'friends').filter(id__in=user_ids).values_list("id", flat=True)
        chat = Chat.objects.create(name=name, is_group=True, admin=request.user)
        chat.users.add(request.user)
        chat.users.add(*User.objects.filter(id__in=friend_ids))
        
        return JsonResponse({"success": True, 'chat_id': chat.id, "name":name})

