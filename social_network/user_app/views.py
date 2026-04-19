from django.shortcuts import render
from django.http import HttpRequest
from django.views.generic.base import TemplateView, View
from .forms import *

# Create your views here.
class PersonalInfoPageView(TemplateView):
    template_name = 'user_app/settings_personal_info.html'


class AlbumsPageView(TemplateView):
    template_name = 'user_app/settings_albums.html'



class AuthTemplateView(TemplateView):
    template_name = 'user_app/auth.html'
    
    def get_context_data(self, **kwargs) -> dict:
        context = super().get_context_data(**kwargs)
        form_register = RegisterForm()
        form_login = LoginForm()
        form_confirm = ConfirmForm()

        context["form_register"] = form_register
        context["form_login"] = form_login
        context["form_confirm"] = form_confirm
        return context
    



class LoginView(View):
    def post(self, request: HttpRequest):
        form = LoginForm(request.POST, request.FILES)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            form.save()

    
class RegisterView(View):
    def post(self, request: HttpRequest):
        ...


class ConfrimView(View):
    ...

class LogoutView(View):
    ...