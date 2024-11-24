import os
import subprocess
from os.path import join, isdir, isfile
from os import mkdir, listdir
from diffusers import StableDiffusionPipeline, DDIMScheduler, \
    StableDiffusionImg2ImgPipeline, \
    StableDiffusionInpaintPipeline, \
    StableDiffusionControlNetInpaintPipeline, ControlNetModel
import torch
import time
import numpy as np
from PIL import Image, ImageChops, ImageOps, ImageFilter
from . import images

'''
export TRANSFORMERS_CACHE=/media/brl2022-1/brl2022-1-1/xty/huggingface/hub/
export HF_HOME=/media/brl2022-1/brl2022-1-1/xty/huggingface/
export HUGGINGFACE_HUB_CACHE=/media/brl2022-1/brl2022-1-1/xty/huggingface/hub/
'''
torch.cuda.set_device(0)

"""
presetting
"""
edge_connect_dir = "/mnt/Workspace/edge-connect"
sd_model_path = "/mnt/Workspace/SDmodels/"
cn_model_path = "/mnt/Workspace/SDmodels/CN"
lora_model_path = "/mnt/Workspace/SDmodels/Lora/"
edge_model_path = "/mnt/Workspace/SDmodels/edge/"
filePath = "/mnt/Workspace/thangka_inpaint_DEMO/Django/server/media"
edge_output_path = join(filePath, "edge_output")
output_path = join(filePath, "output")

if not isdir(output_path):
    mkdir(output_path)

typeSet = "text2img" #inpaint text2img img2img
modelSet = "SD21" #SDI2 SD21

"""
model list (what type can use)
"""
inpaintList = ["SD15", "SD21", "SDI2", "CNI"]
SDList = ["SD15", "SD21"]

def loadModel(generateType, model):
    global typeSet
    global modelSet
    global pipe
    pipe = changeModel(generateType, model)
    pipe.to("cuda")
    typeSet = generateType
    modelSet = model

def changeModel(generateType, model):
    # torch.cuda.empty_cache()
    global pipe
    global typeSet
    global modelSet
    typeSet = generateType
    modelSet = model

    if generateType == "inpaint":
        if model == "CNI":
            premodel_abspath = join(sd_model_path, "SD15")
            cnmodel_abspath = join(cn_model_path, "control_v11p_sd15_inpaint")
            controlnet = ControlNetModel.from_pretrained(
                cnmodel_abspath,
                torch_dtype=torch.float16,
                use_safetensors=True,
            )
            pipe = StableDiffusionControlNetInpaintPipeline.from_pretrained(
                premodel_abspath, controlnet=controlnet,
                torch_dtype=torch.float16,
                use_safetensors=True,
            )
            pipe.scheduler = DDIMScheduler.from_config(pipe.scheduler.config)
        else:
            premodel_abspath = join(sd_model_path, model)
            pipe = StableDiffusionInpaintPipeline.from_pretrained(
                premodel_abspath,
                use_safetensors=True,
                torch_dtype=torch.float16)

    if generateType == "text2img":
        if model not in SDList: model == "SD21"
        premodel_abspath = join(sd_model_path, model)
        pipe = StableDiffusionPipeline.from_pretrained(
            premodel_abspath,
            use_safetensors=True,
            torch_dtype=torch.float16)

    if generateType == "img2img":
        if model not in SDList: model == "SD21"
        premodel_abspath = join(sd_model_path, model)
        pipe = StableDiffusionImg2ImgPipeline.\
            from_pretrained(
            premodel_abspath,
            use_safetensors=True,
            torch_dtype=torch.float16)

    return pipe


# load pipe first time
pipe = changeModel(typeSet, modelSet)
pipe.to("cuda")


def getModelType():
    result = {'model':modelSet, 'type':typeSet, 'loraList':[], 'cnList':[]}
    # 模型列表改成翻文件夾
    if modelSet == "SD21" or modelSet == "SDI2":
        loraList = listdir(lora_model_path)
        for item in loraList:
            if isfile(join(lora_model_path, item)):
                if item.split('.')[-1] == 'safetensors':
                    result['loraList'].append(item.split('.')[0])

    cnList = listdir(cn_model_path)
    for item in cnList:
        if isfile(join(cn_model_path, item)):
            if item.split('.')[-1] == 'safetensors':
                result['cnList'].append(item.split('.')[0])

    return result

def loadLora(loraModelName):
    global pipe
    pipe.load_lora_weights(join(lora_model_path), weight_name=loraModelName+'.safetensors')
    # model_id = "checkpoint-25000" #if needed


"""
process
"""
def make_inpaint_condition(image, image_mask):
    image = np.array(image.convert("RGB")).astype(np.float32) / 255.0
    image_mask = np.array(image_mask.convert("L")).astype(np.float32) / 255.0

    assert image.shape[0:1] == image_mask.shape[0:1], "image and image_mask must have the same image size"
    image[image_mask > 0.5] = -1.0  # set as masked pixel
    image = np.expand_dims(image, 0).transpose(0, 3, 1, 2)
    image = torch.from_numpy(image)
    return image

"""
edge
"""
def edge_inpaint():
    #必須有原圖 只有原圖tocanny 沒給mask不用跑edge修復
    filename = "6.4_a_1024x1024-1_img.png"
    maskname = "6.4_a_1024x1024-1_mask.png"
    py_dir = join(edge_connect_dir, 'test.py')
    checkpoints = join(edge_model_path,'thangka_AC') #thangkaAC_1
    input = join(filePath, filename)
    mask = join(filePath, maskname)
    command = "python3 %s --model 1 --checkpoints %s --input %s --mask %s --output %s"\
              % (py_dir, checkpoints, input, mask, edge_output_path)
    command = command.split(" ")

    res = subprocess.run(command, check=True, timeout=30)
    print(res)


"""
main func : inpaint text2img img2img img2text(not finish)
"""
def inpaint(fileName, maskName, prompt, nagative_prompt,
            steps, seed, strength, guidance, imageCount, SDModel, loraModel):
    # param check
    print(fileName, maskName, prompt, steps, SDModel)
    generator = torch.Generator(device="cpu").manual_seed(seed)

    if loraModel != 'None':
        pipe.load_lora_weights(join(lora_model_path), weight_name=loraModel+'.safetensors')
    else:
        pipe.unload_lora_weights()

    # process image & mask  &  image_masked
    image = Image.open(join(filePath, fileName)).convert("RGBA").resize((512,512))
    image_flat = images.flatten(image, "#ffffff")
    mask_image = Image.open(join(filePath, maskName)).resize((512,512))
    bin_mask = images.create_binary_mask(mask_image)
    image_fill = images.fill(image_flat, bin_mask) #通過模糊填充周圍顏色
    np_mask = np.array(bin_mask)
    np_mask = (np_mask > 0).astype(np.uint8) * 255

    print("mask_image.mode:" + mask_image.mode)

    if mask_image.mode == "RGBA":
        use_mask = np_mask
    else:
        use_mask = mask_image

    # image_fill.show()

    if SDModel == "CNI":
        control_image = make_inpaint_condition(image_flat, bin_mask)

    if SDModel != "CNI": #SDI2
        output = pipe(prompt=prompt,
            nagative_prompt=nagative_prompt,
            image=image_fill, #image_fill
            mask_image=use_mask, #np_mask or not np
            num_inference_steps=steps,
            strength=strength,#(0~1)
            num_images_per_prompt=imageCount,
            guidance_scale=guidance,
            generator=generator
            ).images[0]
    else:
        output = pipe(
            prompt=prompt,
            nagative_prompt=nagative_prompt,
            num_inference_steps=steps,
            image=image_fill,
            mask_image=bin_mask,
            eta=1.0,
            strength=strength,  # (0~1)
            num_images_per_prompt=imageCount,
            control_image=control_image,
            guidance_scale=guidance,
            generator=generator,
        ).images[0]

    # output.show()

    newimage = Image.new('RGBA', image.size, (0, 0, 0, 0))

    print(images.has_transparency(image))
    if images.has_transparency(image):
        newimage.paste(output, (0, 0))
        image = images.MasktoTransparent(image, mask_image)
        r, g, b, a = image.split()
        a = a.filter(ImageFilter.MinFilter(3))
        newimage.paste(image, (0, 0), mask=a) #ImageOps.invert(a)
    else:
        newimage.paste(image, (0, 0))
        newimage.paste(output, (0, 0), mask=mask_image.convert('L'))

    newimage.save(join(output_path, fileName[:-4] + "_output.png"))



def text2img(filename, prompt, negativePrompt, steps, seed, strength, guidance, imageCount, loraModel):
    print('prompt'+str(prompt))
    print('loraModel' + str(loraModel))

    generator = torch.Generator(device="cpu").manual_seed(seed)

    if loraModel != 'None':
        pipe.load_lora_weights(join(lora_model_path), weight_name=loraModel+'.safetensors')
    else:
        pipe.unload_lora_weights()

    output = pipe(
        prompt=prompt,
        negative_prompt=negativePrompt,
        num_inference_steps = steps,
        strength=strength,  # (0~1)
        num_images_per_prompt=imageCount,
        guidance_scale=guidance,
        generator=generator,
    ).images[0]
    output.save(join(output_path,filename+".png"))

def img2img(filename, prompt, negativePrompt, steps, seed, strength, guidance, imageCount, loraModel):
    generator = torch.Generator(device="cpu").manual_seed(seed)

    if loraModel != 'None':
        pipe.load_lora_weights(join(lora_model_path), weight_name=loraModel+'.safetensors')
    else:
        pipe.unload_lora_weights()

    init_image = Image.open(join(filePath, filename)).resize((512, 512))

    output = pipe(
        prompt=prompt,
        negative_prompt=negativePrompt,
        image=init_image,
        num_inference_steps=steps,
        strength=strength,  # (0~1)
        num_images_per_prompt=imageCount,
        guidance_scale=guidance,
        generator=generator,
    ).images[0]
    output.save(join(output_path,filename[:-4]+"_output.png"))

def img2text():
    print("")