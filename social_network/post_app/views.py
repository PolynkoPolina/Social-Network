from django.views.generic import FormView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from .forms import PostForm
from django.urls import reverse_lazy

class PostPageView(TemplateView):
    template_name = 'post_app/post.html'

class PostCreateView(LoginRequiredMixin, FormView):
    template_name = "post_app/create_post.html"
    form_class = PostForm
    login_url = reverse_lazy("auth")

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()

        if self.request.method == "POST":
            kwargs["links"] = self.request.POST.getlist("links")
            kwargs["images"] = self.request.POST.getlist("images")
        
        return kwargs
    
    def form_valid(self, form: PostForm):

        post = form.save()

    def from_valid(self, form: PostForm):
        post = form.save(author = self.request.user)
        return JsonResponse({"success": True, "message": "Post created successfully!"})
    
    def form_invalid(self, form: PostForm):
        return JsonResponse({"success": False, "message": "Failed to create post.", "errors": form.errors}, status=400)