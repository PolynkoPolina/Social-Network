from channels.generic.websocket import AsyncWebsocketConsumer
from .forms import MessageForm
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        
        
        # 
        self.room_group_name = 'test_group'
        await self.channel_layer.group_add(
            self.room_group_name, 
           
            self.channel_name
        )
        await self.accept()

        
    async def receive(self, text_data):
        await self.channel_layer.group_send(
            group= self.room_group_name,
            message= {
                # 
                'type': 'chat_message',
                # 
                'message': text_data
            }
        ) 
    # 
    async def chat_message(self, event):
        text_data_dict = json.loads(event['message'])
        print(text_data_dict)
        form = MessageForm(text_data_dict)
        
        if form.is_valid():
            message = form.cleaned_data['message']
            
            await self.send(text_data= json.dumps(
                {
                    "type": 'chat',
                    'message': message
                }
            ))
        else:
            print('Error')
        
        
