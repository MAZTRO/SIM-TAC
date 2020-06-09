from django.shortcuts import render

def simulator(request):
    return render(request, 'web/simulator.html')

def login_view(request):
    return render(request, 'users/login.html')

def signup_view(request):
    return render(request, 'users/signup.html')

def home_view(request):
    return render(request, 'web/index.html')
