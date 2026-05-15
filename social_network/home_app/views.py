from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from user_app.forms import CreateUsernameForm
from post_app.forms import PostForm, AddTagForm
from django.urls import reverse_lazy
from post_app.models import Post
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.template.loader import render_to_string

# Create your views here.

class HomePageView(LoginRequiredMixin, TemplateView):
    template_name = 'main_app/home.html'
    paginate_by = 5
    login_url = reverse_lazy("auth")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['postForm'] = PostForm()
        context["addTagForm"] = AddTagForm()
        context['posts'] = Post.objects.all().order_by('-created_at')[:self.paginate_by]
        if not self.request.user.username:
            context['create_username_form'] = CreateUsernameForm()
            context['create_username'] = True
        return context
    
    def get_queryset(self):
        return Post.objects.all()
    
    def get(self, request, *args, **kwargs):
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            queryset = self.get_queryset()        
            paginator = Paginator(queryset, self.paginate_by)
            page_number = request.GET.get('page')
            page_obj = paginator.get_page(page_number)
            if int(page_number) > paginator.num_pages:
                return JsonResponse({'success': False})
            return JsonResponse({
                'success': True,
                'html': render_to_string('post_app/particles/show_posts.html', {'posts': page_obj.object_list})
            })
        
        return super().get(request, *args, **kwargs)
    