from django.urls import path
from app import views

urlpatterns = [
    path(
        route='simulator/',
        view=views.simulator,
        name='simulator'
    ),

    path(
        route='',
        view=views.home_view,
        name='home'
    ),
]
