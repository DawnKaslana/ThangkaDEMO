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


# from .models import bert_basic_emotion
# from .models import gpt_api
# from .models import clip_api
from .models import save_file


def helloWorld(request):
    return JsonResponse({'result': 'hello world!'})

urlpatterns = [
    path('', helloWorld),
    path('getToken/', save_file.getToken),
    path('admin/', admin.site.urls),
    path('test/', save_file.test),
    # path('uploadTest', hymenoptera.get_user_file), #要刪掉
    # path('text_emotion', bert_basic_emotion.get_user_text),
    # path('text_generate', gpt_api.getPrompt),
    path('uploadImg/', save_file.user_img),
    path('getImg/', save_file.send_img),
    # path('processVideo', clip_api.process_video),
    # path('clipCap', clip_api.call_clipCap),

]
