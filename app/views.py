from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def simulator(request):
    return render(request, 'web/simulator.html')

def home_view(request):
    return render(request, 'index.html')
