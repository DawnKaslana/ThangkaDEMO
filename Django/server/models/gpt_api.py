from django.http import JsonResponse
import openai
openai.api_key = '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'

def getPrompt(request):
    if request.method == 'POST':
        text = request.POST.get('text')
        return generate(text)

def generate():
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
    #print(response.choices[0].text)
    return JsonResponse({'result': response.choices[0].text})





