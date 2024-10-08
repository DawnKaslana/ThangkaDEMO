import erniebot
from django.http import JsonResponse
import json


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


def chat(request):
    if request.method == 'POST':
        messages = request.POST.get("messages")
        messages = json.loads(messages)
        print(messages)

        # response = erniebot.ChatCompletion.create(
        #     model="ernie-3.5",
        #     messages=messages)
        # print(response.get_result())
        return JsonResponse({
        "role": "assistant",
        "content": "got it!"
        })
def text2img(prompt):
    prompt = "雨后的桃花，8k，辛烷值渲染"
    response = erniebot.Image.create(
        model="ernie-vilg-v2",
        prompt=prompt,
        width=512,
        height=512
    )

    return JsonResponse(response.get_result())