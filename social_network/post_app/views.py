from django.shortcuts import render
from django.views.generic import ListView, FormView, View
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy, reverse
from .models import Post
from .forms import PostForm, AddTagForm
from django.shortcuts import get_object_or_404


from user_app.models import User, Friendship


class PostListView(ListView, LoginRequiredMixin):
    template_name = 'post_app/post.html'
    paginate_by = 5
    login_url = reverse_lazy("auth")

    
    def get_context_data(self, **kwargs):
        username = self.kwargs.get('username')
        user = get_object_or_404(User, username=username)
        id = user.id
        section = 'recommendations'
        try:
            status = Friendship.objects.get(to_user = self.request.user, from_user = user).status
        except:
            status = False
            
        if status:
            if status == 'accepted':
                section = 'friends'
            elif status == 'pending':
                section = 'requests'
        context = super().get_context_data(**kwargs)
        context['postForm'] = PostForm()
        context["addTagForm"] = AddTagForm()
        context['posts'] = Post.objects.filter(author_id = id).order_by('-created_at')[:self.paginate_by]
        context["profile_user"] = user
        context["section"] = section
        print(section)
        return context
    
    def get_queryset(self):
        username = self.kwargs.get('username')
        user = get_object_or_404(User, username=username)
        id = user.id
        
        return Post.objects.filter(author_id =id)

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
    

class PostCreateView(LoginRequiredMixin, FormView):
    template_name = "post_app/create_post.html"
    form_class = PostForm
    success_url = reverse_lazy("post")
    login_url = reverse_lazy("auth")

    def get_form_kwargs(self):
        
        kwargs = super().get_form_kwargs()

        if self.request.method == "POST":
            kwargs["links"] = self.request.POST.getlist("links")
            kwargs["images"] = self.request.FILES.getlist("images")

        return kwargs
    
    def form_invalid(self, form):
        return JsonResponse(
            {
                "success": False,
                "errors": form.errors.get_json_data(),
            },
            status=400,
        )

    def form_valid(self, form):
        post = form.save(author=self.request.user)
    
        return JsonResponse({
            "success": True,
            "redirect_url": reverse("post", kwargs={
                "username": self.request.user.username
            })
        })

class AddTag(LoginRequiredMixin, View):
    login_url = reverse_lazy("auth")
    success_url = reverse_lazy("post")

     
    def post(self, request, *args, **kwargs):
        form = AddTagForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse(
                {
                    "success": True,
                    "message": "Тег створено успішно",
                    "redirect_url": reverse("post", kwargs={"username": request.user.username}),
                }
            )
        return JsonResponse(
            {
                "success": False,
                "errors": form.errors.get_json_data(),
            },
            status=400,
        )
    

class DeletePostView(LoginRequiredMixin, View):
    login_url = reverse_lazy("auth")

    def post(self, request, *args, **kwargs):
        post_id = self.kwargs.get('id')
        post = Post.objects.filter(id = post_id).first()
        post.delete()
        return JsonResponse({
            "success": True,
            "message": "Пост успішно видалено",
            "redirect_url": reverse("post", kwargs={"username": request.user.username})
        })
    