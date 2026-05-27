from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.

user = get_user_model()
class Chat(models.Model):
    users = models.ManyToManyField(to = user, related_name='chats')
    admin = models.ForeignKey(to= user, blank = True, null = True, on_delete=models.CASCADE)

    name = models.CharField(max_length=30, blank= True, null = True)
    is_group = models.BooleanField(default= False)
    avatar = models.ImageField(upload_to='chat_app/chat_avatars/', blank=True, null=True)

    
    def __str__(self):
        return self.name or f"Chat: {self.id}"