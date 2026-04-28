from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse
from django.core.mail import send_mail
from django.views.generic import TemplateView, View, FormView
from .forms import *
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import login
import random


# Create your views here.
class PersonalInfoPageView(TemplateView):
    template_name = 'user_app/settings_personal_info.html'


class AlbumsPageView(TemplateView):
    template_name = 'user_app/settings_albums.html'



class AuthTemplateView(TemplateView):
    template_name = 'user_app/auth.html'
    
    def get_context_data(self, **kwargs) -> dict:
        context = super().get_context_data(**kwargs)
        form_register = UserCreationForm()
        form_login = LoginForm()
        form_confirm = ConfirmForm()

        context["form_register"] = form_register
        context["form_login"] = form_login
        context["form_confirm"] = form_confirm
        return context


class RegisterView(View):

    def post(self, request, *args, **kwargs):
        form = UserCreationForm(request.POST)

        if form.is_valid():
            email = form.cleaned_data.get('email')
            password = form.cleaned_data.get('password')

            request.session['email_password'] = [email, password]
            request.session['register_step'] = 'confirm_password'

            return JsonResponse({"success": True})

        return JsonResponse({
            "success": False,
            "errors": form.errors.get_json_data()
        }, status=400)
            
            
            

class LoginView(View):
    def post(self, request, *args, **kwargs):
        form = LoginForm(request = request, data = request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return JsonResponse({
                "success": True,
                "message": "Користувач успішно залогінився"
            })
        
        return JsonResponse(
            {
                "success": False,
                "errors": form.errors.get_json_data(),
            },
            status = 400
            )
    

class ConfirmView(View):
    def post(self, request, *args, **kwargs):
        form = ConfirmForm(request.POST)
        if form.is_valid():
            code = form.cleaned_data.get('code')
            print(code)
            if code == request.session.get('confirm_code'):
                ...
        return JsonResponse({
            "success": False,
            "errors": form.errors.get_json_data(),
        }, status=400)
   
class LogoutView(View):
    ...

class SendMail(View):
    def post(self, request, *args, **kwargs):
        if request.session.get('code_sent'):

            
            if request.session['register_step'] == 'confirm_password':
                code = ''.join(str(random.randint(0, 9)) for _ in range(6))
                request.session['confirm_code'] = code

                
                send_mail(
                    subject='Пароль для аккаунта',
                    message=code,
                    from_email='socialnetwork140024@gmail.com',   
                    recipient_list= [request.session['email_password'][0]],  
                    fail_silently=False,
                )
                
                request.session['code_sent'] = False
                return JsonResponse({"success": True})
    
      
        return JsonResponse({"success": False})
    


class SetCodeSent(View):
    def post(self, request, *args, **kwargs):
        request.session['code_sent'] = True
        return JsonResponse({"success": True})