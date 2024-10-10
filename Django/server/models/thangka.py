import time

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
def generate(request):
    if request.method == 'POST':
        imagefile = request.FILES.get("image")
        maskfile = request.FILES.get("mask")
        prompt = request.POST.get("prompt")
        negativePrompt = request.POST.get("negativePrompt")
        steps = request.POST.get("steps")
        seed = request.POST.get("seed")
        strength = request.POST.get("strength")
        guidance = request.POST.get("guidance")
        imageCount = request.POST.get("imageCount")
        type = request.POST.get("type")
        SDModel = request.POST.get("SDModel")
        loraModel = request.POST.get("loraModelName")
        filename = request.POST.get("filename")

        if not prompt: prompt = ""
        if not negativePrompt: negativePrompt = ""
        steps = int(steps) if eval(steps) else 30
        seed = eval(seed)
        strength = eval(strength)
        guidance = eval(guidance)
        imageCount = eval(imageCount)

        if type == "inpaint":
            with open('./server/media/' + imagefile.name, 'wb') as fp:
                for chunk in imagefile.chunks():
                    fp.write(chunk)
            with open('./server/media/' + maskfile.name, 'wb') as fp:
                for chunk in maskfile.chunks():
                    fp.write(chunk)

            diffusion.inpaint(fileName=imagefile.name,
                              maskName=maskfile.name,
                              prompt=prompt, nagative_prompt=negativePrompt,
                              steps=steps, seed=seed,
                              strength=strength, guidance=guidance,
                              imageCount=imageCount,
                              SDModel=SDModel,
                              loraModel=loraModel)
            return JsonResponse({'msg': "successed"})

        if type == "text2img":
            print(prompt, steps, filename)
            diffusion.text2img(prompt=prompt,
                               negativePrompt=negativePrompt,
                               steps=steps, seed=seed,
                               strength=strength, guidance=guidance,
                               imageCount=imageCount,
                               filename=filename,
                               loraModel=loraModel)
            return JsonResponse({'msg': "successed"})

        if type == "img2img":
            print(prompt, steps, imagefile.name)
            with open('./server/media/' + imagefile.name, 'wb') as fp:
                for chunk in imagefile.chunks():
                    fp.write(chunk)

            diffusion.img2img(prompt=prompt,
                              negativePrompt=negativePrompt,
                              steps=steps, seed=seed,
                              strength=strength, guidance=guidance,
                              imageCount=imageCount,
                              filename=imagefile.name,
                              loraModel=loraModel)
            return JsonResponse({'msg': "successed"})

        return JsonResponse({'msg': "uploaded"})

def send_img(request):
    if request.method == 'GET':
        imageName = request.GET.get("imageName")
        result={}
        with open("./server/media/output/"+imageName, 'rb') as f:
            data = f.read()
            result["img"] = bytes.decode(base64.b64encode(data))
            return JsonResponse(result)


def changePipe(request):
    if request.method == 'POST':
        generateType = request.POST.get("type")
        model = request.POST.get("model")
        print(generateType, model)
        diffusion.loadModel(generateType, model)
        return JsonResponse({'msg': "successed"})

# def changeLora(request):
#     if request.method == 'POST':
#         loraModelName = request.POST.get("loraModelName")
#         diffusion.loadLora(loraModelName)
#         return JsonResponse({'msg': "successed"})


def getType(request):
    if request.method == 'GET':
        result = diffusion.getModelType()
        return JsonResponse(result)