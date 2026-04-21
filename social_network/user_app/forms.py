from django import forms

class RegisterForm(forms.Form):
    email = forms.EmailField(label="Електронна пошта", widget=forms.EmailInput(
        attrs={
            'placeholder' : 'you@example.com',
            'class' : 'register-input'
    }),
    required=True)

    password = forms.CharField(label="Пароль", widget=forms.PasswordInput(
        attrs={
            'placeholder' : 'Введи пароль',
            'class' : 'register-input'
    }), required=True)

    confirm_password = forms.CharField(label="Підтвердити пароль", widget=forms.PasswordInput(
        attrs={
            'placeholder' : 'Повтори пароль',
            'class' : 'register-input'
    }), 
    required=True)


class LoginForm(forms.Form):
    email = forms.EmailField(label="Електронна пошта", widget=forms.EmailInput({
            'placeholder' : 'you@example.com',
            'class' : 'login-input'
    }),
    required=True)
    password = forms.CharField(label="Пароль", widget=forms.PasswordInput(
        attrs={
            'placeholder' : 'Введи пароль',
            'class' : 'login-input'
    }), 
    required=True)

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
                'placeholder' : '_',
                'class' : 'confirm-email-input'
            })
    