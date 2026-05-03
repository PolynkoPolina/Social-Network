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

            request.session['email'] = email
            request.session['password'] =password
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
            return redirect('home')
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
            code = str(request.session['confirm_code'])
            code_from_inputs = ''.join([
                form.cleaned_data['first'],
                form.cleaned_data['second'],
                form.cleaned_data['third'],
                form.cleaned_data['fourth'],
                form.cleaned_data['fifth'],
                form.cleaned_data['sixth'],
            ])
            
            if code_from_inputs == code:
                user = User.objects.create_user(
                    username= request.session.get('email'),
                    email=request.session.get('email'),
                    password=request.session.get('password'),
                )
                del request.session['email']
                del request.session['password']

                # 
                return redirect('home')
            else:
                form.add_error(None, "Неправильний код")
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
                return redirect('auth')
    
      
        return JsonResponse({"success": False})
    


class SetCodeSent(View):
    def post(self, request, *args, **kwargs):
        request.session['code_sent'] = True
        return JsonResponse({"success": True})