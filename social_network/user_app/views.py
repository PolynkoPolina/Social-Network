from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse
from django.core.mail import send_mail
from django.views.generic import TemplateView, View, FormView
from .forms import *
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import login, logout
import random
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.template.loader import render_to_string
from django.core.paginator import Paginator

from .utils.friends_queries import get_user_by_section
from .utils.friends_actions import *


# Create your views here.
class PersonalInfoPageView(TemplateView, LoginRequiredMixin):
    template_name = 'user_app/particles/user_settings/settings_personal_info.html'
    login_url = reverse_lazy("auth")


class AlbumsPageView(TemplateView,LoginRequiredMixin):
    template_name = 'user_app/particles/user_settings/settings_albums.html'
    login_url = reverse_lazy("auth")



class AuthTemplateView(TemplateView,):
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
            return JsonResponse({
                 "success":True,
                "redirect_url": reverse("home")},
            status = 200
            )
        return JsonResponse(
            {
                "success": False,
                "errors": form.errors.get_json_data(),
            },
            status = 400
            )

    

class ConfirmView(View,):
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
                    email=request.session.get('email'),
                    password=request.session.get('password'),
                )
                del request.session['email']
                del request.session['password']

                # 
                return JsonResponse({"success": True})
            else:
                form.add_error(None, "Неправильний код")
        return JsonResponse({
            "success": False,
            "errors": form.errors.get_json_data(),
        }, status=400)
   
class LogoutView(View, LoginRequiredMixin):
    def get(self, request, *args, **kwargs):
        logout(request)
        return redirect("auth")

class SendMail(View):
    def post(self, request, *args, **kwargs):
        if request.session.get('code_sent'):

            
            if request.session['register_step'] == 'confirm_password':
                code = ''.join(str(random.randint(0, 9)) for _ in range(6))
                print(code)
                request.session['confirm_code'] = code

                
                send_mail(
                    subject='Пароль для аккаунта',
                    message=code,
                    from_email='socialnetwork140024@gmail.com',   
                    recipient_list= [request.session['email']],  
                    fail_silently=False,
                )
                
                request.session['code_sent'] = False
                return redirect('auth')
    
      
        return JsonResponse({"success": False})
    


class SetCodeSent(View):
    def post(self, request, *args, **kwargs):
        request.session['code_sent'] = True
        return JsonResponse({"success": True})
    

class CreateUsernameView(View, LoginRequiredMixin):
    def post(self, request, *args, **kwargs):
        form = CreateUsernameForm(request.POST)
        if form.is_valid():
            form.save()
        return redirect('home')
    

class FriendsView(TemplateView, LoginRequiredMixin):
    template_name = 'user_app/friends.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["sections"] = {
            "requests": {'title': 'Запити', 'users': get_user_by_section(self.request.user, 'requests')[:3], 'html': 'requests'},
            'recommendations': {'title': 'Рекомендації', 'users': get_user_by_section(self.request.user, 'recommendations')[:6], 'html': 'recommendations'},
            'friends': {'title': 'Всі друзі', 'users': get_user_by_section(self.request.user, 'friends')[:6], 'html': 'friends'}
        }
        return context
    
    
class FriendSectionView(LoginRequiredMixin, View):
    paginate_by = 9
    def get(self, request, section, *args, **kwargs):
        if section == "requests":
            users = get_user_by_section(request.user, 'requests')
        elif section == "recommendations":
            users = get_user_by_section(request.user, 'recommendations')
        else:
            users = get_user_by_section(request.user, 'friends')

        page_obj = Paginator(users, self.paginate_by).get_page(request.GET.get("page", 1))

        html = render_to_string(
            "user_app/particles/friends/friends_cards.html",
            {"users": page_obj.object_list, "section": section},
            request=request
        )
        
        return JsonResponse({"html": html, "has_next_page":page_obj.has_next()})
    


class FriendsActionView(LoginRequiredMixin, View):
    login_url = reverse_lazy("auth")

    def post(self, request, other_user_id, action, *args, **kwargs):
        other_user = User.objects.get(id = other_user_id)
        current_user = request.user

        if action == 'add':
            return JsonResponse(add_friend_request(current_user = current_user, other_user= other_user))
        
        if action == 'dismiss':
            return JsonResponse(dismiss_recommendation(current_user = current_user, other_user= other_user))

        if action == 'delete':
            return JsonResponse(delete_friend(current_user = current_user, other_user= other_user))
        
        if action == 'accept':
            action_result = accept_friend_request(current_user = current_user, other_user= other_user)
            action_result['friend_html'] = render_to_string(
                "user_app/particles/friends/friends_cards.html",
                context= {"user": [action_result["friend"]], 'section': "friends"},
                request=request
            )
            
            del action_result["friend"]
            return JsonResponse(action_result)
        

