"""Users Forms"""
from django import forms
from django.contrib.auth.models import User
from users.models import Profile


class SignupForm(forms.Form):
    """Class Signup"""

    first_name = forms.CharField(min_length=2, max_length=50)
    last_name = forms.CharField(min_length=2, max_length=50)
    username = forms.CharField(min_length=4, max_length=50)
    email = forms.CharField(min_length=6, max_length=70, widget=forms.EmailInput())
    password = forms.CharField(max_length=70, widget=forms.PasswordInput())
    password_confirmation = forms.CharField(max_length=70, widget=forms.PasswordInput())

    def clean_username(self):
        """Username data clean"""
        username = self.cleaned_data['username']
        username_taken = User.objects.filter(username=username).exists()

        if username_taken:
            raise forms.ValidationError('Username already in use')
        return username

    def clean(self):
        """Verify passwords"""
        data = super().clean()
        password = data['password']
        password_confirmation = data['password_confirmation']

        if password != password_confirmation:
            raise forms.ValidationError('Password do not match')
        return data

    def save(self):
        data = self.cleaned_data
        data.pop('password_confirmation')

        user = User.objects.create_user(**data)
        profile = Profile(user=user)
        profile.save()
