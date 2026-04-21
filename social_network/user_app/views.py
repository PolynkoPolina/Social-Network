from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse
from django.core.mail import send_mail
from django.views.generic import TemplateView, View, FormView
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
        form = RegisterForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            confirm_password = form.cleaned_data['confirm_password']
            if password == confirm_password:
                return redirect('auth')
            

class ConfirmView(FormView):
    template_name = 'user_app/particles/form_confirm_email.html'
    form_class = ConfirmForm
    success_url = 'home'

    def form_valid(self, form):
        form.send_mail()
        return super().form_valid(form)
    
class LogoutView(View):
    ...