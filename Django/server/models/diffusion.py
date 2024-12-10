import os
import subprocess
import gc
from os.path import join, isdir, isfile
from os import mkdir, listdir
from diffusers import StableDiffusionPipeline, StableDiffusionControlNetPipeline, \
    StableDiffusionImg2ImgPipeline, StableDiffusionControlNetImg2ImgPipeline, \
    StableDiffusionInpaintPipeline, StableDiffusionControlNetInpaintPipeline, \
    ControlNetModel, \
    DDIMScheduler, DPMSolverMultistepScheduler, UniPCMultistepScheduler, \
    AutoPipelineForImage2Image
import torch
import time

import numpy as np
from skimage.feature import canny
from PIL import Image, ImageChops, ImageOps, ImageFilter

from . import images

# os.environ["CUDA_VISIBLE_DEVICES"] = "0,1"
torch.cuda.set_device('cuda:0')
print('torch.cuda.device_count:'+str(torch.cuda.device_count()), 'is_available:'+str(torch.cuda.is_available()))

'''
export TRANSFORMERS_CACHE=/media/brl2022-1/brl2022-1-1/xty/huggingface/hub/
export HF_HOME=/media/brl2022-1/brl2022-1-1/xty/huggingface/
export HUGGINGFACE_HUB_CACHE=/media/brl2022-1/brl2022-1-1/xty/huggingface/hub/
'''


"""
presetting
"""
edge_connect_dir = "/mnt/Workspace/edge-connect"
sd_model_path = "/mnt/Workspace/SDmodels/"
cn_model_path = "/mnt/Workspace/SDmodels/CN"
lora_model_path = "/mnt/Workspace/SDmodels/Lora/"
edge_model_path = "/mnt/Workspace/SDmodels/edge/"
filePath = "/mnt/Workspace/thangka_inpaint_DEMO/Django/server/media"
image_path = join(filePath, "image")
mask_path = join(filePath, "mask")
edge_path = join(filePath, "edge")
output_path = join(filePath, "output")

if not isdir(image_path):
    mkdir(image_path)
    mkdir(mask_path)
    mkdir(edge_path)
    mkdir(output_path)


"""
model list (what type can use)
"""
inpaintList = ["CNI", "SDI2", "SD21", "SD15"]
SDList = ["SD21", "SD15"]
SDVersion = {'SD15':'sd15', 'SD21':'sd21', 'SDI2': 'sd21', 'CNI': 'sd15'}

def loadModel(generateType, model, cnModel):
    global pipe
    pipe = changeModel(generateType, model, cnModel)
    pipe.to("cuda")

def changeModel(generateType, model, cnModel=None,ft=False):
    if not ft:
        global pipe
        del pipe
        gc.collect()
        torch.cuda.empty_cache()
    global typeSet
    global modelSet
    global cnModelSet
    typeSet = generateType
    modelSet = model
    cnModelSet = cnModel

    # reset available model
    if generateType == "inpaint":
        if model not in inpaintList:
            modelSet = model = inpaintList[0]
    else:
        if model not in SDList:
            modelSet = model = SDList[0]
    if str(cnModel) != "None":
        if cnModel.split('_')[1] != SDVersion[modelSet]:
            cnModelSet = cnModel = "None"

    if generateType == "inpaint":
        if model == "CNI":
            premodel_abspath = join(sd_model_path, "SD15")
            CNI_abspath = join(cn_model_path, "control_sd15_inpaint")
            CNI_controlnet = ControlNetModel.from_pretrained(
                CNI_abspath,
                torch_dtype=torch.float16,
                use_safetensors=True,
            )
            controlnet = CNI_controlnet
            if str(cnModel) != 'None':
                cnmodel_abspath = join(cn_model_path, cnModel)
                controlnet_extra = ControlNetModel.from_pretrained(
                    cnmodel_abspath,
                    torch_dtype=torch.float16,
                    use_safetensors=True,
                )
                controlnet = [CNI_controlnet, controlnet_extra]
                pipe = StableDiffusionControlNetImg2ImgPipeline.from_pretrained(
                    premodel_abspath, controlnet=controlnet,
                    torch_dtype=torch.float16,
                    use_safetensors=True,
                )
            else:
                pipe = StableDiffusionControlNetInpaintPipeline.from_pretrained(
                    premodel_abspath, controlnet=controlnet,
                    torch_dtype=torch.float16,
                    use_safetensors=True,
                )
            pipe.scheduler = DDIMScheduler.from_config(pipe.scheduler.config)
        else: #SDI2
            premodel_abspath = join(sd_model_path, model)
            if str(cnModel) != 'None':
                cnmodel_abspath = join(cn_model_path, cnModel)
                controlnet = ControlNetModel.from_pretrained(
                    cnmodel_abspath,
                    torch_dtype=torch.float16,
                )
                pipe = StableDiffusionControlNetInpaintPipeline.from_pretrained(
                    premodel_abspath,
                    controlnet=controlnet,
                    torch_dtype=torch.float16
                )
                pipe.scheduler = DDIMScheduler.from_config(pipe.scheduler.config)
            else:
                pipe = StableDiffusionInpaintPipeline.from_pretrained(
                    premodel_abspath,
                    use_safetensors=True,
                    torch_dtype=torch.float16)

    if generateType == "text2img":
        premodel_abspath = join(sd_model_path, model)
        if str(cnModel) != 'None' and cnModel.split('_')[1] == SDVersion[modelSet]:
            cnmodel_abspath = join(cn_model_path, cnModel)
            controlnet = ControlNetModel.from_pretrained(
                cnmodel_abspath,
                torch_dtype=torch.float16,
            )
            pipe = StableDiffusionControlNetPipeline.from_pretrained(
                premodel_abspath,
                controlnet=controlnet,
                torch_dtype=torch.float16
            )
            pipe.scheduler = UniPCMultistepScheduler.from_config(pipe.scheduler.config)
        else:
            pipe = StableDiffusionPipeline.from_pretrained(
                premodel_abspath,
                use_safetensors=True,
                torch_dtype=torch.float16)

    if generateType == "img2img":
        if model not in SDList:
            model == "SD21"
        premodel_abspath = join(sd_model_path, model)
        if str(cnModel) != 'None':
            cnmodel_abspath = join(cn_model_path, cnModel)
            controlnet = ControlNetModel.from_pretrained(
                cnmodel_abspath,
                torch_dtype=torch.float16,
            )
            pipe = StableDiffusionControlNetImg2ImgPipeline.from_pretrained(
                premodel_abspath,
                controlnet=controlnet,
                torch_dtype=torch.float16
            )
            pipe.scheduler = UniPCMultistepScheduler.from_config(pipe.scheduler.config)
        else:
            pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
                premodel_abspath,
                use_safetensors=True,
                torch_dtype=torch.float16)

    # pipe.enable_model_cpu_offload()
    # remove following line if xFormers is not installed or you have PyTorch 2.0 or higher installed
    pipe.enable_xformers_memory_efficient_attention()

    return pipe


"""
preloading type & model
"""
typeSet = "inpaint" #inpaint text2img img2img
modelSet = "SD21" #inpaint:[CNI SDI2] SD:[SD21 SD15]
cnModelSet = "None" #None control_sd21_canny control_sd15_canny

# load pipe first time
pipe = changeModel(typeSet, modelSet, cnModelSet, ft=True)
pipe.to("cuda")


def getModelType():
    result = {'model':modelSet, 'type':typeSet, 'cnModel':cnModelSet, 'loraList':[], 'cnList':[]}
    # 模型列表改成翻文件夾
    if modelSet == "SD21" or modelSet == "SDI2":
        loraList = listdir(lora_model_path)
        for item in loraList:
            if isfile(join(lora_model_path, item)):
                if item.split('.')[-1] == 'safetensors':
                    result['loraList'].append(item.split('.')[0])

    cnList = listdir(cn_model_path)
    for item in cnList:
        if isdir(join(cn_model_path, item)):
            version = item.split('_')[1]
            cnType = item.split('_')[2]
            # 目前只提供canny
            if cnType == 'canny' and SDVersion[modelSet] == version:
                result['cnList'].append(item)

    return result

def loadLora(loraModelName):
    global pipe
    pipe.load_lora_weights(join(lora_model_path), weight_name=loraModelName+'.safetensors')
    # model_id = "checkpoint-25000" #if needed


"""
generate edge
"""
def edge_inpaint(filename, maskname=None):
    #只有原圖tocanny 沒給mask不用跑edge修復
    print('Func: edge_inpaint')
    print('filename: ', filename)
    print('maskname: ', maskname)

    if maskname:
        py_dir = join(edge_connect_dir, 'test.py')
        checkpoints = join(edge_model_path,'thangkaAC_1') #thangkaAC_1
        image = join(image_path, filename)
        mask = join(mask_path, maskname)

        command = "python3 %s --model 1 --checkpoints %s --input %s --mask %s --output %s"\
                  % (py_dir, checkpoints, image, mask, edge_path)
        command = command.split()

        res = subprocess.run(command, timeout=30, check=True)

        return res.returncode
    else:
        image = Image.open(join(image_path, filename)).resize((512,512)).convert('L')
        edge = canny(np.array(image), sigma=1)
        edge = Image.fromarray(edge)
        edge.save(join(edge_path, filename[:-4]+'_edge.png'))
        return 0


"""
main func : inpaint text2img img2img img2text(not finish)
"""

def load_lora(loraModelName):
    print('loraModel: ' + str(loraModelName))
    global pipe
    if str(loraModelName) != 'None':
        pipe.load_lora_weights(join(lora_model_path), weight_name=loraModelName+'.safetensors')
    else:
        pipe.unload_lora_weights()

def inpaint(filename, isGIM, maskName, prompt, nagative_prompt,
            steps, seed, strength, guidance, imageCount, SDModel, CNImgName=None):
    # params check
    print('func: inpaint')
    print('prompt:', prompt)
    print('filename:', filename)
    print('maskName:', maskName)
    print('CNImgName:', CNImgName)
    print('imageCount:', imageCount)

    generator = torch.Generator(device="cpu").manual_seed(seed)

    # process image & mask  &  image_masked
    image = Image.open(join(output_path if isGIM else image_path, filename)).convert("RGBA").resize((512,512))
    image_flat = images.flatten(image, "#ffffff")
    mask_image = Image.open(join(mask_path, maskName)).resize((512,512))
    bin_mask = images.create_binary_mask(mask_image)
    image_fill = images.fill(image_flat, bin_mask) #通過模糊填充周圍顏色
    np_mask = np.array(bin_mask)
    np_mask = (np_mask > 0).astype(np.uint8) * 255

    # print("mask_image.mode:" + mask_image.mode)

    if mask_image.mode == "RGBA":
        use_mask = np_mask
    else:
        use_mask = mask_image

    if CNImgName:
        cnImg = Image.open(join(edge_path, CNImgName)).resize((512, 512))
        if cnImg.mode != 'L' and cnImg.mode != '1':
            cnImg = images.canny_image(cnImg)
    else:
        cnImg = None

    # image_fill.show()

    if SDModel == "CNI":
        control_image = images.make_inpaint_condition(image_flat, bin_mask)
        if CNImgName:
            control_image = [control_image, cnImg]
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
            # controlnet_conditioning_scale=[1.0, 0.5]
            generator=generator,
        ).images
    else: #SDI2
        output = pipe(prompt=prompt,
            nagative_prompt=nagative_prompt,
            image=image_fill, #image_fill
            mask_image=use_mask, #np_mask or not np
            num_inference_steps=steps,
            strength=strength,#(0~1)
            num_images_per_prompt=imageCount,
            guidance_scale=guidance,
            generator=generator,
            control_image=cnImg,
            ).images

    timestamp = str(int(time.time()))
    if isGIM: # replace timestamp
        outputName = filename[:-4].split('_')
        outputName = '_'.join(outputName[:-2])
        outputName = outputName + '_' + timestamp
    else:  # add timestamp
        outputName = filename[:-4] + '_' + timestamp

    for i in range(imageCount):
        newimage = Image.new('RGBA', image.size, (0, 0, 0, 0))

        # print(images.has_transparency(image))
        if images.has_transparency(image):
            newimage.paste(output[i], (0, 0))
            image = images.MasktoTransparent(image, mask_image)
            r, g, b, a = image.split()
            a = a.filter(ImageFilter.MinFilter(3))
            newimage.paste(image, (0, 0), mask=a) #ImageOps.invert(a)
        else:
            newimage.paste(image, (0, 0))
            newimage.paste(output[i], (0, 0), mask=mask_image.convert('L'))

        newimage.save(join(output_path, outputName + '_' + str(i) + ".png"))

    return outputName

def text2img(filename, prompt, negativePrompt, steps, seed, strength, guidance, imageCount, CNImgName=None):
    print('func: text2img')
    print('prompt:', prompt)
    print('filename:', filename)
    print('CNImgName:', CNImgName)
    print('imageCount:', imageCount)

    generator = torch.Generator(device="cpu").manual_seed(seed)

    if CNImgName:
        cnImg = Image.open(join(edge_path, CNImgName)).resize((512, 512))
        if cnImg.mode != 'L' and cnImg.mode != '1':
            cnImg = images.canny_image(cnImg)

        output = pipe(
            prompt=prompt,
            negative_prompt=negativePrompt,
            num_inference_steps=steps,
            strength=strength,  # (0~1)
            num_images_per_prompt=imageCount,
            guidance_scale=guidance,
            image=cnImg,
            generator=generator,
        ).images
    else:
        output = pipe(
            prompt=prompt,
            negative_prompt=negativePrompt,
            num_inference_steps = steps,
            strength=strength,  # (0~1)
            num_images_per_prompt=imageCount,
            guidance_scale=guidance,
            generator=generator,
        ).images


    for i in range(imageCount):
        output[i].save(join(output_path, filename + '_' + str(i) + ".png"))

    return filename


def img2img(filename, isGIM, prompt, negativePrompt, steps, seed, strength, guidance, imageCount, CNImgName=None):
    print('func: img2img')
    print('prompt:', prompt)
    print('isGIM:', isGIM)
    print('filename:', filename)
    print('CNImgName:', CNImgName)
    print('loadImgPath:', output_path if isGIM else image_path)

    generator = torch.Generator(device="cpu").manual_seed(seed)

    init_image = Image.open(join(output_path if isGIM else image_path, filename)).resize((512,512))
    init_image = images.flatten(init_image, "#ffffff")

    if CNImgName:
        cnImg = Image.open(join(edge_path, CNImgName)).resize((512, 512))
        if cnImg.mode != 'L' and cnImg.mode != '1':
            cnImg = images.canny_image(cnImg)

        output = pipe(
            prompt=prompt,
            negative_prompt=negativePrompt,
            image=init_image,
            num_inference_steps=steps,
            strength=strength,  # (0~1)
            num_images_per_prompt=imageCount,
            guidance_scale=guidance,
            control_image=cnImg,
            generator=generator,
        ).images
    else:
        output = pipe(
            prompt=prompt,
            negative_prompt=negativePrompt,
            image=init_image,
            num_inference_steps=steps,
            strength=strength,  # (0~1)
            num_images_per_prompt=imageCount,
            guidance_scale=guidance,
            generator=generator,
        ).images

    timestamp = str(int(time.time()))
    if isGIM: # replace timestamp
        outputName = filename[:-4].split('_')
        outputName = '_'.join(outputName[:-2])
        outputName = outputName + '_' + timestamp
    else:  # add timestamp
        outputName = filename[:-4] + '_' + timestamp

    for i in range(imageCount):
        output[i].save(join(output_path, outputName + '_' + str(i) + ".png"))

    return outputName


def img2text():
    print("")
