import erniebot
from django.http import JsonResponse
import json

from . import diffusion

models = erniebot.Model.list()
erniebot.api_type = "aistudio"
erniebot.access_token = "a71afcff2e5ee885c6117c59d563f0d8370d6a0d"

# templateMassages=[{
#     "role": "user",
#     "content": "请问你是谁？"
# }, {
#     "role": "assistant",
#     "content":
#         "我是百度公司开发的人工智能语言模型，我的中文名是文心一言，英文名是ERNIE-Bot，可以协助您完成范围广泛的任务并提供有关各种主题的信息，比如回答问题，提供定义和解释及建议。如果您有任何问题，请随时向我提问。"
# }, {
#     "role": "user",
#     "content": "我在深圳，周末可以去哪里玩？"
# }]


# templateFunc=[{
#         'name': 'get_current_temperature',
#         'description': "获取指定城市的气温",
#         'parameters': {
#             'type': 'object',
#             'properties': {
#                 'location': {
#                     'type': 'string',
#                     'description': "城市名称",
#                 },
#                 'unit': {
#                     'type': 'string',
#                     'enum': [
#                         '摄氏度',
#                         '华氏度',
#                     ],
#                 },
#             },
#             'required': [
#                 'location',
#                 'unit',
#             ],
#         },
#         'responses': {
#             'type': 'object',
#             'properties': {
#                 'temperature': {
#                     'type': 'integer',
#                     'description': "城市气温",
#                 },
#                 'unit': {
#                     'type': 'string',
#                     'enum': [
#                         '摄氏度',
#                         '华氏度',
#                     ],
#                 },
#             },
#         },
#     }]

availible_params = {
    'prompt': {
        'type': 'string',
        'description': "圖像描述/文本描述/文本提示詞/prompt",
    },
    'negative_prompt': {
        'type': 'string',
        'description': "不希望出現的圖像內容/負面提示詞/negative prompt",
    },
    'steps': {
        'type': 'number',
        'description': "生成步數/渲染步數/steps",
    },
    'noise': {
        'type': 'number',
        'description': "噪聲強度/噪聲比例/重繪幅度/noise ratio/Denoising strength",
    },
    'prompt_weight': {
        'type': 'number',
        'description': "提示權重/文本權重/文本引導程度/prompt weight",
    },
    'image_count': {
        'type': 'number',
        'enum': [1,2,3,4],
        'description': "生成張數/生成圖片數量/輸出數量",
    },
    'generate': {
        'type': 'boolean',
        'description': "是否有具體的生成圖像的命令/只修改參數還是需要一同執行生成",
    },
}

functions = [
    {
        'name': 'text2img',
        'description': "生成圖像",
        'parameters': {
            'type': 'object',
            'properties': {
                'prompt': {
                    'type': 'string',
                    'description': "圖像描述",
                },
            },
            'required': [
                'prompt',
            ],
        }
    },
    {
        'name': 'inpaint',
        'description': "修復圖像",
        'parameters': {
            'type': 'object',
            'properties': {
                'prompt': {
                    'type': 'string',
                    'description': "圖像描述",
                },
            },
            'required': [
                'prompt',
            ],
        }
    },
    {
        'name': 'optimizePrompt',
        'description': "優化、修改、加強輸入的圖像描述文本，讓生成效果更好",
        'parameters': {
            'type': 'object',
            'properties': {
                'prompt': {
                    'type': 'string',
                    'description': "圖像描述/描述文本/prompt",
                },
            },
        },
    },
    {
        'name': 'changeParamsAndGenerate',
        'description': "指定輸入模型的參數",
        'parameters': {
            'type': 'object',
            'properties': availible_params
        },
    },
]

def generateImgByErnie(prompt):
    erniebot.api_type = "yinian"
    erniebot.access_token = "<access-token-for-yinian>"

    response = erniebot.Image.create(
        model="ernie-vilg-v2",
        prompt=prompt, #"雨后的桃花，8k，辛烷值渲染"
        width=512,
        height=512
    )


def refineByErnie(text):
    messages = [{
        "role": "user",
        "content": "從'" + text + "'中擷取關於圖像的描述並進行優化，使生成效果更好，最後只輸出圖像描述文本（不要太長）"
    }]

    response = erniebot.ChatCompletion.create(
        model="ernie-3.5",
        messages=messages,
    )

    print("refineByErnie:"+response.get_result())
    return response.get_result()

def translateByErnie(text, lang='eng', generate=False):
    if generate:
        text = refineByErnie(text)

    messages = [{
        "role": "user",
        "content": "將'" + text + "'翻译成" + lang + "，只输出" + lang
    }]

    response = erniebot.ChatCompletion.create(
        model="ernie-3.5",
        messages=messages,
    )

    print("translateByErnie:"+str(response.get_result()))
    return response.get_result()


def send_command(command):
    return JsonResponse({
        "command": command,
    })

includeChinese = lambda x:sum([1 if u'\u4e00' <= i <= u'\u9fff' else 0 for i in x])>0
def translate(request):
    if request.method == 'POST':
        text = request.POST.get("text")
        lang = request.POST.get("lang")

        return JsonResponse({"text": translateByErnie(text, lang)})

def optimize(request):
    if request.method == 'POST':
        print(request.POST)
        text = request.POST.get("text")
        if text:
            print("original prompt:" + text)
            text = refineByErnie(text)

        return JsonResponse({
            "role": "assistant",
            "params": {'prompt':text},
            "command": "changeParams",
            "content": "已將prompt優化為："+text,
        })

def text2img(prompt):
    print('text2img prompt:'+prompt)
    info = diffusion.getModelType()
    content = ""
    command = ""
    if info['type'] != 'text2img':
        content = "請先切換為文生圖模式。"
    else:
        command = "text2img"

    if includeChinese(prompt):
        prompt = translateByErnie(prompt, generate=True)

    return JsonResponse({
            "role": "assistant",
            "prompt": prompt,
            "content": content,
            "command": command,
        })

def inpaint(prompt):
    info = diffusion.getModelType()
    content = ""
    command = ""
    if info['type'] != 'inpaint':
        content = "請先切換為修復模式。"
    else:
        command = "inpaint"

    return JsonResponse({
            "role": "assistant",
            "prompt": translateByErnie(prompt),
            "content": content,
            "command": command,
        })

def getParams(args):
    print("getParams")
    print(args)
    params = {}

    if 'prompt' in args: params['prompt'] = args['prompt']
    if 'negative_prompt' in args: params['negativePrompt'] = args['negative_prompt']
    if 'steps' in args: params['steps'] = args['steps']
    if 'noise' in args: params['noiseRatio'] = args['noise']
    if 'prompt_weight' in args: params['promptWeight'] = args['prompt_weight']
    if 'image_count' in args: params['imageCount'] = args['image_count']

    if 'generate' in args: params['generate'] = args['generate']
    return params

def changeParamsAndGenerate(args):
    return JsonResponse({
            "role": "assistant",
            "params": getParams(args),
            "content": "已修改參數。",
            "command": "changeParamsAndGenerate",
        })

def chat(request):
    if request.method == 'POST':
        messages = request.POST.get("messages")
        messages = json.loads(messages)
        # print(messages)

        response = erniebot.ChatCompletion.create(
            model="ernie-3.5",
            messages=messages,
            functions=functions
        )
        result = response.get_result()
        answer = JsonResponse({
            "role": "assistant",
            "content": result,
        })

        if 'thoughts' in result:
            name2function = {'text2img': text2img,
                             'inpaint': inpaint,
                             'optimizePrompt': send_command,
                             'changeParamsAndGenerate': changeParamsAndGenerate}
            func = name2function[result['name']]
            args = json.loads(result['arguments'])
            if result['name'] == 'changeParamsAndGenerate':
                answer = func(args)
            elif result['name'] == 'optimizePrompt':
                answer = func('optimizePrompt')
            else:
                answer = func(prompt=args['prompt'])

        return answer
