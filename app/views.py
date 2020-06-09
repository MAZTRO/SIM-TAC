from django.shortcuts import render


def simulator(request):
    return render(request, 'web/simulator.html')

def home_view(request):
    return render(request, 'index.html')
