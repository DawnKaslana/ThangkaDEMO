from django.http import JsonResponse
import torch
import clip
from PIL import Image
import numpy as np
import cv2

import replicate
import openai
openai.api_key = 'openai.api_key'


def process_video(request):
    if request.method == 'GET':
        videoName = request.GET.get('name')
        imgName = videoName.split('.')[0]
        print('process:'+videoName)
        video = cv2.VideoCapture('/home/dawn/Workspace/MyWeb/server/media/'+videoName)
        if video.isOpened():
            rval, frame = video.read()
        else:
            rval = False
            return JsonResponse({'msg': 'no file'})

        time = 100 #幀間隔頻率
        count = 1
        imgCount = 0
        while rval:
            rval, frame = video.read()
            if (count%time == 0 and rval):
                cv2.imwrite('./server/media/images/'+imgName+'_'+str(imgCount)+'.jpg', frame)
                imgCount+=1
            count += 1
            cv2.waitKey(1)

        video.release()

        return JsonResponse({'msg': 'cut frame '+str(imgCount), 'count': imgCount})

def call_gpt3(text):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=text,
        temperature=0,
        max_tokens=500,
        top_p=1,
        frequency_penalty=0.0,
        presence_penalty=0.0,
        #stop=["\n"]
    )
    return response.choices[0].text

def call_clipCap(request):
    if request.method == 'GET':
        videoName = request.GET.get('name').split('.')[0]
        count = request.GET.get('count')

        model = replicate.models.get("rmokady/clip_prefix_caption")
        version = model.versions.get("9a34a6339872a03f45236f114321fb51fc7aa8269d38ae0ce5334969981e4cd8")

        result = []
        for i in range(int(count)):
            inputs = {
                # Input image
                'image': open("./server/media/images/"+videoName+'_'+str(i)+'.jpg', "rb"),
                # Choose a model
                'model': "coco",
                # Whether to apply beam search to generate the output text
                'use_beam_search': False,
            }

            # https://replicate.com/rmokady/clip_prefix_caption/versions/9a34a6339872a03f45236f114321fb51fc7aa8269d38ae0ce5334969981e4cd8#output-schema
            result.append(version.predict(**inputs))

        print(result)

        text = "use chinese write a longer copy. background information: "
        for index, item in enumerate(result):
            text += str(index)+'.'+item+' '
        print(text)
        
        return JsonResponse({'result':result, 'generate':call_gpt3(text)})


def call_clip(filename):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model, preprocess = clip.load("ViT-B/32", device=device)

    itemList = ["a diagram", "a dog", "a cat"]
    image = preprocess(Image.open(filename)).unsqueeze(0).to(device)
    text = clip.tokenize(itemList).to(device)

    with torch.no_grad():
        image_features = model.encode_image(image)
        text_features = model.encode_text(text)

        logits_per_image, logits_per_text = model(image, text)
        probs = logits_per_image.softmax(dim=-1).cpu().numpy()

    probList = list(probs)
    print("Label probs:", probs)
    print("Label:", itemList[probList.index(max(probList))])





