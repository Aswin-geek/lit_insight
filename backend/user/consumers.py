import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from user.models import *

class PersonalChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = f"room_{self.scope['url_route']['kwargs']['user_id']}"
        self.group_name = f'chat_{self.room_name}'
        await self.channel_layer.group_add(self.group_name, self.channel_name) 
        print("testing")
        print(self.room_name)
        print(f'chat_{self.room_name}')
        await self.accept()
        
    async def disconnect(self, close_code):
        print('disconnect')
        # await self.channel_layer.group_discard(self.room_name, self.channel_name)
    
        
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        # await self.send(text_data=json.dumps({'message': message}))
        await self.channel_layer.group_send(
            self.group_name, {"type": 'chat_message', "message": message}
        )
        # f'chat_{message["room_name"]}'
        
    async def chat_message(self, event):
        print("hai")
        data = event['message']
        print(data)
        print("response data",data)
        await self.send(text_data=json.dumps({'message': data}))
    
    # async def receive(self, text_data):
    #     data = json.loads(text_data)
    #     message = data['message']
    #     print(message)
    #     await self.channel_layer.group_send(
    #         f'chat_{self.room_name}',
    #         {
    #             'type': 'chat.message',
    #             'data': {
    #                 'message': message,
    #             },
    #         }
    #     )    

    # @database_sync_to_async
    # def create_message(self, data):
    #     get_room_by_name = Room.objects.get(room_name=data['room_name'])
    #     if not Message.objects.filter(message=data['message']).exists():
    #         new_message = Message(room=get_room_by_name, sender=data['sender'], message=data['message'])
    #         new_message.save()