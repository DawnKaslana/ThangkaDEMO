import cv2
import numpy as np
from os.path import join
import os
def psnr(original, reconstructed):
    # 读取原始图像和重建图像
    original_image = cv2.imread(original)
    reconstructed_image = cv2.imread(reconstructed)

    # 计算均方误差（MSE）
    mse = np.mean((original_image - reconstructed_image) ** 2)

    # 计算PSNR
    max_pixel_value = 255  # 对于8位图像，最大像素值为255
    psnrScore = 10 * np.log10((max_pixel_value ** 2) / mse)
    return psnrScore


# 对于人类来说，快速评估两个图像之间的感知相似度(Perceptual Similarity)是很容易的，但这潜在的过程被认为是相当复杂的。
# 然而目前广泛使用的感知指标(PSNR、SSIM圖像結構等)都是很简单的函数，无法很好地解释人类的感知。

import torch
import torchvision.transforms as transforms
import torchvision.models as models
from PIL import Image
import lpips
def LPIPS(original, reconstructed):
    # 加载预训练的LPIPS模型
    import lpips
    loss_fn_alex = lpips.LPIPS(net='alex')  # best forward scores
    loss_fn_vgg = lpips.LPIPS(net='vgg')  # closer to "traditional" perceptual loss, when used for optimization

    # 加载两幅图像
    image1 = Image.open(original).convert('RGB')
    image2 = Image.open(reconstructed).convert('RGB')

    # 对图像进行预处理
    preprocess = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor(),
    ])

    image1 = preprocess(image1).unsqueeze(0)
    image2 = preprocess(image2).unsqueeze(0)

    # 使用LPIPS模型计算相似性
    similarity_score = loss_fn_alex(image1, image2)
    similarity_vgg_score = loss_fn_vgg(image1, image2)
    return similarity_score, similarity_vgg_score

def SSIM(original, reconstructed):
    from skimage.metrics import structural_similarity as ssim
    from skimage import io

    # 读取两幅图像
    image1 = io.imread(original, as_gray=True)
    image2 = io.imread(reconstructed, as_gray=True)

    # 计算SSIM
    ssim_score = ssim(image1, image2,  data_range=255)

    print(f"SSIM: {ssim_score}")


# pip install pytorch-fid
def FID(original, reconstructed):
    original = original.replace(' ', '\ ')
    reconstructed = reconstructed.replace(' ', '\ ')
    output = os.system("python -m pytorch_fid "+original+" "+reconstructed)
import shutil


pathO = "/home/brl2022-1/Desktop/cal/O"
pathR = "/home/brl2022-1/Desktop/cal/R"
pathT = "/home/brl2022-1/Desktop/cal/temp"
def cal(pathO, pathR, pathT):
    Ofile = os.listdir(pathO)[0]
    Rfiles = os.listdir(pathR)
    Rfiles.sort()

    for item in Rfiles:
        print("====="+item+"=====")
        psnrScore = psnr(join(pathO,Ofile), join(pathR, item))
        similarity_score, similarity_vgg_score = LPIPS(join(pathO,Ofile), join(pathR, item))
        shutil.copyfile(join(pathR, item), join(pathT, item))
        FID(pathO, pathT)
        os.remove(join(pathT, item))
        print(f"PSNR: {psnrScore} dB")
        print(f"LPIPS Similarity: alex={similarity_score} vgg={similarity_vgg_score}")

cal(pathO, pathR, pathT)








