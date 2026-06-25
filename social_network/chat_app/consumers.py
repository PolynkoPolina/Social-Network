'''Обробка WebSocket-запитів (аналог views.py для Вебсокетів)'''

import json
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Chat, Message

from channels.db import database_sync_to_async
from django.utils import timezone

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        self.group_name = f"chat_{self.chat_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send(
            text_data= json.dumps({
                'action' : 'connection',
                'message': "Встановлення з'єднання по WebSocket було успішне!"
                }
            )
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        dict_data = json.loads(text_data)
        message_text = dict_data.get("messageText", None)
        sender = self.scope['user']
        if message_text:
            message = await self.save_message(message_text)
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'chat_message',
                    'id': message['id'],
                    "is_read": message["is_read"],
                    'message_text': message_text,
                    'sender': sender.first_name,
                    "created_at": message["created_at"],
                    "sender_avatar": '/static/icons/friends_icon1.svg',
                    "images": message['images']
                }
            )
  
    async def chat_message(self, event):
        await self.mark_message_read(event["id"])
        await self.notify_unread_users()
        await self.send(text_data=json.dumps({
            'action': 'chat_message',
            'id': event['id'],
            'is_read': event['is_read'],
            'message_text': event['message_text'],
            'sender':event['sender'],
            'created_at': event["created_at"],
            "sender_avatar": event["sender_avatar"],
            'images': event.get("images", [])
            }))

    @database_sync_to_async
    def save_message(self, text):
        user = self.scope["user"]
        message = Message.objects.create(chat_id=self.chat_id, sender=user, text=text)
        created_at = timezone.localtime(message.created_at)
        return {"id": message.id, "text": message.text, 'is_read': message.readers.exists(), "sender": user.first_name, "created_at": created_at.isoformat(),  'sender_avatar': '/static/icons/friends_icon1.svg', 'images': []}

    async def message_read(self, event):
        await self.send(text_data=json.dumps({
            "action": "message_read",
            "id": event["id"],
            "sender": event["sender"],
        }))
    async def notify_unread_users(self):
        user_ids = await self.get_chat_user_ids()
        for user_id in user_ids:
            await self.channel_layer.group_send(f'unread_{user_id}', {'type':'unread_update'})
    
    @database_sync_to_async
    def get_chat_user_ids(self):
        return list(Chat.objects.get(id = self.chat_id).users.values_list('id', flat=True))
    
    @database_sync_to_async
    def mark_message_read(self, message_id):
        user = self.scope['user']
        message = Message.objects.get(id = message_id)
        if message.sender_id != user.id:
            message.readers.add(user)


class UnreadConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.group_name = f"unread_{self.user.id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send_unread_data()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
    
    async def receive(self, text_data = None):
        await self.send_unread_data()

    async def unread_update(self, event):
        await self.send_unread_data()

    async def send_unread_data(self):
        data = await self.get_unread_data()
        await self.send(text_data=json.dumps(data))
        
    
    @database_sync_to_async
    def get_unread_data(self):
        personal_total = 0
        group_total = 0
        chat_data = []
        chats = Chat.objects.filter(users = self.user)
        for chat in chats:
            chat_id = chat.id
            last_message = chat.messages.order_by('-created_at','-id').first()
            last_text = ''
            if last_message:
                created_at = timezone.localtime(last_message.created_at)
                last_text = f"{last_message.text[:20]}/{str(created_at)}"
            else:
                last_text = "Надіслав/ла вам файл"
                
            unread = chat.messages.exclude(sender = self.user).exclude(readers = self.user).count()  

            if chat.is_group:
                group_total += unread   
            else:
                personal_total += unread 
            
            chat_data.append({'id': chat_id, 'unread': unread, 'last': last_text})
        return {'personal_total': personal_total,'group_total': group_total, 'total': personal_total+group_total, 'chats': chat_data}
    


