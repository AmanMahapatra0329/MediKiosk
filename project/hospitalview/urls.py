from django.urls import path,include
from hospitalview import views



urlpatterns = [
    path('',views.homepage,name='homepage'),
]