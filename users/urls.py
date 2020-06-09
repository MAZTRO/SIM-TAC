from django.urls import path
from users import views


urlpatterns = [
    path(
        route='login/',
        view=views.login_view,
        name='login'
    ),

    path(route='signup/',
    view=views.signup_view,
    name='signup'
    )
]
