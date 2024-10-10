import erniebot
from django.http import JsonResponse
import json

from . import diffusion

models = erniebot.Model.list()
erniebot.api_type = "aistudio"
erniebot.access_token = "a71afcff2e5ee885c6117c59d563f0d8370d6a0d"

"""
[{
    "role": "user",
    "content": "请问你是谁？"
}, {
    "role": "assistant",
    "content":
        "我是百度公司开发的人工智能语言模型，我的中文名是文心一言，英文名是ERNIE-Bot，可以协助您完成范围广泛的任务并提供有关各种主题的信息，比如回答问题，提供定义和解释及建议。如果您有任何问题，请随时向我提问。"
}, {
    "role": "user",
    "content": "我在深圳，周末可以去哪里玩？"
}]
"""

a=[{
        'name': 'get_current_temperature',
        'description': "获取指定城市的气温",
        'parameters': {
            'type': 'object',
            'properties': {
                'location': {
                    'type': 'string',
                    'description': "城市名称",
                },
                'unit': {
                    'type': 'string',
                    'enum': [
                        '摄氏度',
                        '华氏度',
                    ],
                },
            },
            'required': [
                'location',
                'unit',
            ],
        },
        'responses': {
            'type': 'object',
            'properties': {
                'temperature': {
                    'type': 'integer',
                    'description': "城市气温",
                },
                'unit': {
                    'type': 'string',
                    'enum': [
                        '摄氏度',
                        '华氏度',
                    ],
                },
            },
        },
    }]

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
        'name': 'changeParams',
        'description': "修改輸入模型的參數",
        'parameters': {
            'type': 'object',
            'properties': {
                'prompt': {
                    'type': 'string',
                    'description': "圖像描述/文本描述/prompt",
                },
                'steps': {
                    'type': 'string',
                    'description': "生成/渲染步數",
                },
                'noise': {
                    'type': 'string',
                    'description': "噪聲強度/重繪幅度",
                },
            },
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
    print('generateImgByErnie')

def text2img(prompt):
    info = diffusion.getModelType()
    content = ""
    command = ""
    if info['type'] != 'text2img':
        content = "請先切換為文生圖模式。"
    else:
        command = "text2img"
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
            "prompt": prompt,
            "content": content,
            "command": command,
        })

def changeParams(args):
    print(args)
    params = {}

    if 'prompt' in args: params['prompt'] = args['prompt']
    if 'steps' in args: params['steps'] = eval(args['steps'])
    if 'noise' in args: params['noise'] = eval(args['noise'])

    return JsonResponse({
            "role": "assistant",
            "params": params,
            "content": "已修改參數。",
            "command": "changeParams",
        })


def chat(request):
    command = ""
    if request.method == 'POST':
        messages = request.POST.get("messages")
        messages = json.loads(messages)
        print(messages)

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
            name2function = {'text2img': text2img, 'inpaint': inpaint, 'changeParams': changeParams}
            func = name2function[result['name']]
            if result['name'] == 'changeParams':
                args = json.loads(result['arguments'])
                answer = func(args)
            else:
                args = json.loads(result['arguments'])
                answer = func(prompt=args['prompt'])

        return answer
