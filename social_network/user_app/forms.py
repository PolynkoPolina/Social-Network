from django import forms
from django.contrib.auth import get_user_model, authenticate
from .models import User
from django.contrib.auth.forms import AuthenticationForm


class ConfirmForm(forms.Form):
    
    first = forms.CharField(widget = forms.NumberInput, required = True)
     
    second = forms.CharField(widget = forms.NumberInput, required = True)
     
    third = forms.CharField(widget = forms.NumberInput, required = True)
     
    fourth = forms.CharField(widget = forms.NumberInput, required = True)
    
    fifth = forms.CharField(widget = forms.NumberInput, required = True)
    
    sixth = forms.CharField(widget = forms.NumberInput, required = True)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for field in self.fields.values():
            field.label = ''
            field.widget.attrs.update({
                'placeholder' : '___',
                'class' : 'confirm-email-input'
            })



user = get_user_model()


class UserCreationForm(forms.ModelForm):

    password = forms.CharField(label="Пароль", widget=forms.PasswordInput(
        attrs={
            'placeholder' : 'Введи пароль',
            'class' : 'register-input'
        }), 
        required=True)
    
    conf_password = forms.CharField(label="Підвердження паролю", widget=forms.PasswordInput(
        attrs={
            'placeholder' : 'Повтори пароль',
            'class' : 'register-input'
        }), 
        required=True)


    class Meta:
        model = user
        fields = ('email',)
        labels = {
            'email': 'Електронна пошта'
        }
        widgets = {
            'email': forms.EmailInput(
                attrs={
                    'placeholder': 'you@example.com',
                    'class': 'register-input'
            })
        }


    def clean_email(self):
        email = self.cleaned_data['email']
        if user.objects.filter(email = email).exists():
            raise forms.ValidationError('Користувач з такою електронною поштою вже існує')
        return email

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        conf_password = cleaned_data.get('conf_password')
        if password and conf_password and password != conf_password:
            raise forms.ValidationError('Паролі не співпадають')
        return cleaned_data
    
    def save(self, commit = True):
        user : User = super().save(commit = False) 
        user.username = ''
        user.set_password(self.cleaned_data['password'])
        if commit:
            user.save()
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.label_suffix = ''

class LoginForm(AuthenticationForm):
    username = forms.EmailField(label='Електрона пошта', widget=forms.EmailInput(
        attrs={
            'placeholder' : 'you@example.com',
            'class' : 'register-input'
        }),
        required=True)
    password = forms.CharField(label='Пароль', widget=forms.PasswordInput(
        attrs={
            'placeholder' : 'Введи пароль',
            'class' : 'login-input'
        }), 
        required=True)
    

    def clean(self):
        email = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        if email and password:
            self.user_cache = authenticate(
                self.request, 
                username = email,
                password = password
            )
        
            if not self.user_cache:
                raise forms.ValidationError('Логін або пароль не співпадають')
        
            self.confirm_login_allowed(self.user_cache)

        return self.cleaned_data
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.label_suffix = ''