from django.contrib import admin
from .models import Post, PostImage, PostLinks, Tag, PostView

# Register your models here.
admin.site.register([PostLinks, PostImage, Post, Tag])