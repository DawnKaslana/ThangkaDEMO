"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.http import JsonResponse

from .models import thangka
from .models import ernie_bot

def helloWorld(request):
    return JsonResponse({'result': 'hello world!'})

urlpatterns = [
    path('', helloWorld),
    path('admin/', admin.site.urls),
    path('getToken/', thangka.getToken),
    path('test/', thangka.test),
    path('generate/', thangka.generate),
    path('getImg/', thangka.send_img),
    path('changePipe/', thangka.changePipe),
    path('getPipeType/', thangka.getType),
    path('chat/', ernie_bot.chat),
    path('translate/', ernie_bot.translate)
]
