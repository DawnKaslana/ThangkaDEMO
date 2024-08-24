from django.http import JsonResponse
import torch
from torchvision import datasets, transforms
from PIL import Image


def get_user_file(request):
    if request.method == 'POST':
        file = request.FILES.get("image")
        with open('./server/files/'+file.name,'wb') as fp:
            for chunk in file.chunks():
                fp.write(chunk)
            print('保存完畢')
        return recognition(file.name)


def recognition(filename):
    class_names = ['ants', 'bees']
    # 加载模型
    model = torch.load('/Users/dawnkaslana/Workspace/Resnet/hymenoptera/model.pt')
    # APPLE GPU实现API Metal Performance Shaders（MPS）
    device = torch.device('mps')
    model = model.to(device)
    # 把模型转为test模式
    model.eval()

    # 資料路徑
    data_dir = './server/files/'
    test_transforms = transforms.Compose([
        transforms.Resize(256),  # 縮放
        transforms.CenterCrop(224),  # 中央剪裁
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])  # 標準化
    ])
    img = Image.open(data_dir+filename)
    img = test_transforms(img).unsqueeze(0) #拓展維度
    img = img.to(device)

    outputs = model(img)
    _, preds = torch.max(outputs, 1)

    return JsonResponse({'msg':class_names[preds[0]]})

