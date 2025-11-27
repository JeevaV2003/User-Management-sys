from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
    path('change-password/', views.change_password),
    path('users/', views.user_list),
    path('users/add/', views.add_user),
    path('users/delete/<int:user_id>/', views.delete_user),
]
