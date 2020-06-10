"""Users model"""
from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    """model profile"""

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    biography = models.TextField(blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        """String representation of the object"""
        return self.user.username
