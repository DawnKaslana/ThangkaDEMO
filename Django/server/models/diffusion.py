from os.path import join
from diffusers import StableDiffusionPipeline, DiffusionPipeline, UNet2DConditionModel, EulerDiscreteScheduler, \
    StableDiffusionImg2ImgPipeline, \
    StableDiffusionInpaintPipeline
import torch
import time
import numpy as np
from PIL import Image, ImageChops
import tqdm

'''
export TRANSFORMERS_CACHE=/media/brl2022-1/brl2022-1-1/xty/huggingface/hub/
export HF_HOME=/media/brl2022-1/brl2022-1-1/xty/huggingface/
export HUGGINGFACE_HUB_CACHE=/media/brl2022-1/brl2022-1-1/xty/huggingface/hub/
'''
torch.cuda.set_device(0)


sd_model_path = "/mnt/Workspace/SDmodels/"
model_path = "/mnt/Workspace/SDmodels/Lora/"
filePath = "/mnt/Workspace/thangka_inpaint_DEMO/Django/server/media"
output_path = join(filePath,"output")

def MaskToTranspaent(img, mask):
    datas = img.getdata()
    mask = mask.convert("RGBA")
    maskdatas = mask.getdata()
    newimage = Image.new('RGBA', img.size, (0, 0, 0, 0))
    newData = []
    # print(len(datas),len(maskdatas))

    for idx, item in enumerate(datas):
        if maskdatas[idx][0]==255:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    newimage.putdata(newData)
    return newimage

def WhiteToTranspaent(img):
    datas = img.getdata()
    newimage = Image.new('RGBA', img.size, (0, 0, 0, 0))
    newData = []

    for item in datas:
        if item[0] > 127 and item[0] == item[1] == item[2]:
            newData.append(item)
        else:
            newData.append((255, 255, 255, 0))

    newimage.putdata(newData)
    return newimage

premodel_abspath = join(sd_model_path,"SDI2")  # SD21/SDI2
print(premodel_abspath)
# scheduler = EulerDiscreteScheduler.from_pretrained(premodel_abspath, subfolder="scheduler")
pipe = StableDiffusionInpaintPipeline.from_pretrained(premodel_abspath,
                                                      # scheduler=scheduler,
                                                      torch_dtype=torch.float16,
                                                      use_safetensors=True, )
                                                      # variant="fp16",)
pipe.load_lora_weights(join(model_path,"thangka_ACD"), weight_name="pytorch_lora_weights.safetensors")
# this model type use lora model no need convert
# model_id = "checkpoint-25000" #if needed
pipe.to("cuda")


def inpaint(fileName, maskName, text, steps, type, SDModel, maskImg):
    print(fileName, maskName, text, steps, type, SDModel, maskImg)

    if not text: text = ""
    steps = int(steps) if eval(steps) else 10
    image = Image.open(join(filePath, fileName)).resize((512,512)) # image = image.convert("RGB")
    mask_image = Image.open(join(filePath, maskName)).resize((512, 512))

    # if maskImg:
    #     image = MaskToTranspaent(image, mask_image)
    #
    # image.show(title="image")
    # mask_image.show(title="mask_image")

    output = pipe(prompt=text,
                  image=image,
                  mask_image=mask_image,
                  num_inference_steps=steps,
                  strength=1,#(0~1)
                  # num_images_per_prompt=1,
                  nagative_prompt="bad,ugly,disfigured,blurry,watermark,normal quality,jpeg artifacts,low quality,worst quality,cropped,low res,",
                  guidance_scale=7.5).images[0]


    newimage = Image.new('RGBA', image.size, (0, 0, 0, 0))
    newimage.paste(image, (0, 0))
    mask_image = WhiteToTranspaent(mask_image)
    newimage.paste(output, (0, 0), mask_image)

    # output.show(title="output")
    # newimage.show(title="newimage")

    time.sleep(0.5)
    newimage.save(join(output_path,fileName[:-4]+"_output.png"))

