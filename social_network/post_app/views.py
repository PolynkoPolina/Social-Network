from django.shortcuts import render
from django.http import HttpRequest
from django.views.generic.base import TemplateView
# Create your views here.
class PostPageView(TemplateView):
    template_name = 'post_app/post.html'
