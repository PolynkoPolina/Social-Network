from django.shortcuts import render
from django.views.generic import ListView, FormView, View
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from .models import Post
from .forms import PostForm, AddTagForm


class PostListView(ListView, LoginRequiredMixin):
    # model = Post
    template_name = 'post_app/post.html'
    # context_object_name = 'posts'
    paginate_by = 5
    login_url = reverse_lazy("auth")

    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['postForm'] = PostForm()
        context["addTagForm"] = AddTagForm()
        context['posts'] = Post.objects.filter(author_id = self.request.user).order_by('-created_at')[:self.paginate_by]
        return context
    def get_queryset(self):
        return Post.objects.filter(author_id = self.request.user)
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

    def form_valid(self, form):
       
        post = form.save(author=self.request.user)
        return JsonResponse(
            {
                "success": True,
                "message": "Публікацію створено успішно",
                "redirect_url": str(self.success_url),
                "post_id": post.id,
            }
        )

    def form_invalid(self, form):
        return JsonResponse(
            {
                "success": False,
                "errors": form.errors.get_json_data(),
            },
            status=400,
        )


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
                    "redirect_url": str(self.success_url),
                }
            )
        return JsonResponse(
            {
                "success": False,
                "errors": form.errors.get_json_data(),
            },
            status=400,
        )