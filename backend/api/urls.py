from django.urls import path
from . import views

urlpatterns = [
       path('', views.home, name='home'),
       path('whoami', views.who_am_i, name='whoami'),
       path('signup', views.sign_up, name='signup'),
       path('login', views.log_in, name='login'),
       path('logout', views.log_out, name='logout'),
       path('toppings', views.toppings, name='toppings'),
       path('pizzas', views.pizzas, name='pizzas'),
]
