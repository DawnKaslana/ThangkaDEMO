import time

from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
import server.models.diffusion as diffusion
import base64
from os.path import join, isdir, isfile

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
        isGCN = request.POST.get("isGCN")
        CNImagefile = request.POST.get("CNImage") if isGCN else request.FILES.get("CNImage")
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

        # setting params
        if not prompt: prompt = ""
        if not negativePrompt: negativePrompt = ""
        steps = int(steps) if eval(steps) else 30
        seed = eval(seed)
        strength = eval(strength)
        guidance = eval(guidance)
        imageCount = eval(imageCount)
        if isGCN:
            CNImgName = CNImagefile
        elif CNImagefile:
            with open(join('./server/media/edge', CNImagefile.name), 'wb') as fp:
                for chunk in CNImagefile.chunks():
                    fp.write(chunk)
            CNImgName = CNImagefile.name
        else:
            CNImgName = None

        diffusion.load_lora(loraModel)

        if type == "inpaint":
            with open(join('./server/media/image', imagefile.name), 'wb') as fp:
                for chunk in imagefile.chunks():
                    fp.write(chunk)
            with open(join('./server/media/mask', maskfile.name), 'wb') as fp:
                for chunk in maskfile.chunks():
                    fp.write(chunk)

            diffusion.inpaint(fileName=imagefile.name,
                              maskName=maskfile.name,
                              prompt=prompt, nagative_prompt=negativePrompt,
                              steps=steps, seed=seed,
                              strength=strength, guidance=guidance,
                              imageCount=imageCount,
                              SDModel=SDModel,
                              CNImgName=CNImgName)
            return JsonResponse({'msg': "successed"})

        if type == "text2img":
            diffusion.text2img(prompt=prompt,
                               negativePrompt=negativePrompt,
                               steps=steps, seed=seed,
                               strength=strength, guidance=guidance,
                               imageCount=imageCount,
                               filename=filename,
                               CNImgName=CNImgName)
            return JsonResponse({'msg': "successed"})

        if type == "img2img":
            with open(join('./server/media/image', imagefile.name), 'wb') as fp:
                for chunk in imagefile.chunks():
                    fp.write(chunk)

            diffusion.img2img(prompt=prompt,
                              negativePrompt=negativePrompt,
                              steps=steps, seed=seed,
                              strength=strength, guidance=guidance,
                              imageCount=imageCount,
                              filename=imagefile.name,
                              CNImgName=CNImgName)
            return JsonResponse({'msg': "successed"})

        return JsonResponse({'msg': "uploaded"})

def generate_edge(request):
    if request.method == 'POST':
        imagefile = request.FILES.get("image")
        maskfile = request.FILES.get("mask")
        with open(join('./server/media/image', imagefile.name), 'wb') as fp:
            for chunk in imagefile.chunks():
                fp.write(chunk)
        if maskfile:
            with open(join('./server/media/mask', maskfile.name), 'wb') as fp:
                for chunk in maskfile.chunks():
                    fp.write(chunk)
        if diffusion.edge_inpaint(imagefile.name, maskfile.name if maskfile else None) == 0:
            return JsonResponse({'msg': "successed"})

def send_img(request):
    if request.method == 'GET':
        filename = request.GET.get("imageName")
        path = request.GET.get("path")
        result={}
        filepath = join('./server/media/', path)
        with open(join(filepath, filename), 'rb') as f:
            data = f.read()
            result["img"] = bytes.decode(base64.b64encode(data))
            return JsonResponse(result)


def changePipe(request):
    if request.method == 'POST':
        generateType = request.POST.get("type")
        model = request.POST.get("model")
        cnModel = request.POST.get("cnModel")
        print('generateType: '+str(generateType))
        print('model: ' + str(model))
        print('cnModel: ' + str(cnModel))
        diffusion.loadModel(generateType, model, cnModel)
        return JsonResponse({'msg': "successed"})

# def changeLora(request):
#     if request.method == 'POST':
#         loraModelName = request.POST.get("loraModelName")
#         diffusion.loadLora(loraModelName)
#         return JsonResponse({'msg': "successed"})


def getType(request):
    if request.method == 'GET':
        result = diffusion.getModelType()
        print(result)
        return JsonResponse(result)