from channels.generic.websocket import AsyncWebsocketConsumer
import json

class OnlineStatusConsumer(AsyncWebsocketConsumer):
    online_users = set()

    async def connect(self):
        self.user = self.scope['user']
        self.user_id = str(self.user.id)
        self.group_name = "online_users"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        self.online_users.add(self.user_id)
        # Відправляємо інформацію про статус кожного юзера поточному юзеру
        for user_id in self.online_users:
            await self.send_status(user_id, "online")
        # Поточний юзер відправляє інформацію про свій статус іншим юзерам
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'online_status',
                'user_id': self.user_id,
                'status': "online"
            }
        )

    async def disconnect(self, code):
        self.online_users.discard(self.user_id)
        await self.channel_layer.group_send(self.group_name, {
            'type': 'online_status',
            "user_id": self.user_id,
            "status": "offline"
        })


    async def online_status(self, event):
        await self.send_status(event['user_id'], event['status'])

    async def send_status(self, user_id, status):
        await self.send(text_data=json.dumps({
            'user_id': user_id,
            'status': status
        }))
