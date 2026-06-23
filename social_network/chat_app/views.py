from django.views.generic import TemplateView, View
from django.contrib.auth.mixins import LoginRequiredMixin
from user_app.utils.friends_queries import get_user_by_section
from django.urls import reverse_lazy
from .models import *
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from .utils.chat_actions import *
from django.core.paginator import Paginator
from django.utils import timezone
from django.http import HttpRequest
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

User = get_user_model()

class ChatView(LoginRequiredMixin, TemplateView):
    template_name = 'chat_app/chat.html'
    login_url = reverse_lazy('auth')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['friends'] = get_user_by_section(self.request.user, 'friends')
        context['personal_chats'] = Chat.objects.filter(
            users=self.request.user,
            is_group=False
        ).order_by('id')
        context['group_chats'] = Chat.objects.filter(
            users=self.request.user,
            is_group=True
        ).order_by('id')
        context['requests_count'] = len(get_user_by_section(self.request.user, 'requests'))
        return context
    

class ChatWithView(LoginRequiredMixin, View):
    login_url = reverse_lazy('auth')
    
    def post(self, request, user_id):
        response_dict = get_or_create_chat(request, user_id)
        return JsonResponse(response_dict)
    
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
                        "message_text": message.text,
                        "is_read": message.readers.exists(),
                        "sender": message.sender.first_name,
                        "created_at": timezone.localtime(message.created_at).isoformat(),
                        "sender_avatar": '/static/icons/friends_icon1.svg',
                        "images": [img.image.url for img in message.images.all()]
                    } 
                    for message in messages
                ],
                "has_next": page_obj.has_next(),
            }
        )
    

class CreateGroupView(LoginRequiredMixin, View):
    login_url = reverse_lazy('auth')

    def post(self, request):
        response_dict = create_group(request)
        return JsonResponse(response_dict)
        

class MessageImagesUploadView(LoginRequiredMixin, View):
    login_url = reverse_lazy('auth')

    def post(self, request: HttpRequest, chat_id):
        if not Chat.objects.filter(id=chat_id, users=request.user).exists():
            return JsonResponse({'success': False}, status=403)
        
        text = request.POST.get("text", "").strip()
        images = request.FILES.getlist('images')
        if not text and not images:
            return JsonResponse({'success': False, 'error': "empty_message"}, status=400)
        
        message = Message.objects.create(chat_id=chat_id, sender=request.user, text=text)

        for img in images:
            MessageImage.objects.create(message=message, image=img)

        image_urls = [image_obj.image.url for image_obj in message.images.all()]
 

        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"chat_{chat_id}",
            {
                "type": "chat_message",
                'id': message.id,
                "is_read": message.readers.exists(),
                'message_text': message.text,
                'sender': message.sender.first_name,
                "created_at": timezone.localtime(message.created_at).isoformat(),
                'sender_avatar': '/static/icons/friends_icon1.svg',
                "images": image_urls
            }
        )

        return JsonResponse({'success': True})
    

class ReadMessageView(LoginRequiredMixin, View):
    login_url = reverse_lazy('auth')

    def get(self, request: HttpRequest, message_id):
        message = Message.objects.get(id=message_id)

        if message.sender == self.request.user:
            return JsonResponse({"success": False})

        message.readers.add(self.request.user)

        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"chat_{message.chat_id}",
            {
                "type": "message_read",
                "id": message.id,
                "sender": self.request.user.first_name,
            }
        )

        return JsonResponse({"success": True})
    
class DeleteGroupView(LoginRequiredMixin, View):
    login_url = reverse_lazy('auth')

    def post(self, request, chat_id): 
        chat = Chat.objects.filter(id=chat_id, is_group=True, users=request.user).first
        
        if chat:
            chat.delete()
  
        return JsonResponse({"success": True, "chat_id": chat_id})
       


class LeaveGroupView(LoginRequiredMixin, View):
    login_url = reverse_lazy('auth')

    def post(self, request, chat_id):
        chat = Chat.objects.filter(id=chat_id, is_group=True).first()
        chat.users.remove(request.user)

        return JsonResponse({"success": True, "chat_id": chat_id})


class EditGroupView(LoginRequiredMixin, View):
    login_url = reverse_lazy('auth')

    def post(self, request, chat_id):
        return JsonResponse(edit_group(request, chat_id))

    def get(self, request, chat_id):
        chat = Chat.objects.filter(id=chat_id, is_group=True).first()

        if not chat:
            return JsonResponse({"success": False, "error": "Chat not found"})

        users = [{ "id": user.id, "first_name": user.first_name } for user in chat.users.all().exclude(id = self.request.user.id)]
        return JsonResponse({ "success": True, "chat_id": chat.id,"chat_name": chat.name, "users_in_chat": users})