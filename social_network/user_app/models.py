from django.db import models
# Create your models here.
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        if not password:
            raise ValueError('Password is required')

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        if not password:
            raise ValueError('Superuser must have a password')

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)

    username = models.CharField(max_length=150, blank=True, null=True)
    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

class Friendship(models.Model):
    status = models.CharField( max_length=50, default = "pending")
    from_user = models.ForeignKey(User, on_delete= models.CASCADE, related_name= 'sent_friendships')
    to_user = models.ForeignKey(User, on_delete= models.CASCADE, related_name= 'received_friendships')
    created_at = models.DateTimeField(auto_now_add= True)  
    
    class Meta:
        unique_together = ('from_user', 'to_user')

    def __str__(self):
        return f"Від:{self.from_user} До: {self.to_user}"
