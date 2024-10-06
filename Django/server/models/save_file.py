from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
import server.models.diffusion as diffusion
import base64

# 获取csrftoken
@ensure_csrf_cookie
def getToken(request):
    response = HttpResponse()
    return response

def test(request):
    return JsonResponse({'msg': 'ok'})


#@csrf_exempt
def user_img(request):
    if request.method == 'POST':
        imagefile = request.FILES.get("image")
        maskfile = request.FILES.get("mask")
        prompt = request.POST.get("prompt")
        steps = request.POST.get("steps")
        type = request.POST.get("type")
        SDModel = request.POST.get("SDModel")
        maskImg = request.POST.get("maskImg")
        print(type,SDModel)

        with open('./server/media/'+imagefile.name,'wb') as fp:
            for chunk in imagefile.chunks():
                fp.write(chunk)
        with open('./server/media/' + maskfile.name, 'wb') as fp:
            for chunk in maskfile.chunks():
                fp.write(chunk)
        if type == "Image Inpaint":
            diffusion.inpaint(imagefile.name, maskfile.name, prompt, steps, type, SDModel, maskImg)
            return JsonResponse({'msg': "inpainted"})
        return JsonResponse({'msg': "uploaded"})

def send_img(request):
    if request.method == 'GET':
        imageName = request.GET.get("imageName")
        result={}
        with open("./server/media/output/"+imageName, 'rb') as f:
            data = f.read()
            result["img"] = bytes.decode(base64.b64encode(data))
            return JsonResponse(result)
