from django import forms
from user_app.models import User
from .models import Chat

class GroupCreateForm(forms.ModelForm):
    class Meta:
        model = Chat
        fields = ('users', 'name', 'avatar')
        labels = {
            'name' : 'Назва'
        }
        widgets = {
            'users' : forms.SelectMultiple(),
            'name' : forms.TextInput(attrs={"placeholder": "Введіть назву"}),
            'avatar' : forms.FileInput(),
        }


class MessageForm(forms.Form):
    message = forms.CharField(
        max_length= 100,
        required= True,
        widget= forms.TextInput(attrs= {'placeholder': 'Type your message'})
    )