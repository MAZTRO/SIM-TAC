from django.urls import path
from app import views

urlpatterns = [
    path(
        route='',
        view=views.simulator,
        name='simulator'
    ),

    path(
        route='home/',
        view=views.home_view,
        name='home'
    ),
]
