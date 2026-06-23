from chat_app.models import Chat
from django.contrib.auth import get_user_model
from user_app.utils.friends_queries import get_user_by_section
from django.http import HttpRequest


User = get_user_model()

def get_or_create_chat(request, user_id):
    current_user = request.user
    other_user = User.objects.get(id=user_id)

    friends = get_user_by_section(current_user, 'friends') 
    if other_user not in friends:
        return {"success": False}
    
    current_user_chat_ids = Chat.objects.filter(
        users=current_user,
        is_group = False,
        ).values_list("id", flat=True)
    
    chat = Chat.objects.filter(
        id__in=current_user_chat_ids,
        users=other_user, 
        is_group=False
        ).first()
    
    if chat is None:
        chat = Chat.objects.create(is_group=False)
        chat.users.add(current_user, other_user)

    return {'success': True, 'chat_id': chat.id, "users_count": chat.users.count()}


def create_group(request: HttpRequest):
    name = request.POST.get("name", "").strip()
    user_ids  = request.POST.getlist("users")

    if not name:
        return {"success": False, "error": "name required"}
    
    friend_ids = get_user_by_section(request.user, 'friends').filter(id__in=user_ids).values_list("id", flat=True)
    chat = Chat.objects.create(name=name, is_group=True, admin=request.user)
    chat.users.add(request.user)
    chat.users.add(*User.objects.filter(id__in=friend_ids) )

    
    return {"success": True, 'chat_id': chat.id, "name":name, "users_count": chat.users.count()}


def edit_group(request, chat_id):
    name = request.POST.get("name", "").strip()
    user_ids = request.POST.getlist("users")

    chat = Chat.objects.get(id=chat_id, is_group=True, admin=request.user)
    friend_ids = get_user_by_section(request.user, 'friends').filter(id__in=user_ids).values_list("id", flat=True)

    chat.name = name 
    users_to_remove = chat.users.exclude(id=chat.admin.id)
    chat.users.remove(*users_to_remove)
    chat.users.add(*User.objects.filter(id__in=friend_ids))

    

    chat.save()

    return {"success": True, 'chat_id': chat.id, "name":name, "users_count": chat.users.count()}