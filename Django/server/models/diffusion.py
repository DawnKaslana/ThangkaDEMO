from os.path import join
from diffusers import StableDiffusionPipeline, DDIMScheduler, \
    StableDiffusionImg2ImgPipeline, \
    StableDiffusionInpaintPipeline, \
    StableDiffusionControlNetInpaintPipeline, ControlNetModel
import torch
import time
import numpy as np
from PIL import Image, ImageChops, ImageOps
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
sd_model_path = "/mnt/Workspace/SDmodels/"
cn_model_path = "/mnt/Workspace/SDmodels/CN"
model_path = "/mnt/Workspace/SDmodels/Lora/"
filePath = "/mnt/Workspace/thangka_inpaint_DEMO/Django/server/media"
output_path = join(filePath,"output")


def changeModel(generateType, model):
    if generateType == "inpaint":
        if model == "SDI2":
            premodel_abspath = join(sd_model_path, "SDI2")  # SD21/SDI2
            pipe = StableDiffusionInpaintPipeline.from_pretrained(
                premodel_abspath,
                torch_dtype=torch.float16)
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

    # load lora
    # pipe.load_lora_weights(join(model_path, "thangka_ACD"), weight_name="pytorch_lora_weights.safetensors")
    # model_id = "checkpoint-25000" #if needed
    return pipe

# load pipe
# pipe = changeModel("inpaint", "CNI")
# pipe.to("cuda")

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
main func : inpaint text2img img2img img2text
"""
def inpaint(fileName, maskName, text, steps, SDModel):
    # param check
    print(fileName, maskName, text, steps, SDModel)
    if not text: text = ""
    nagative_prompt = "bad,ugly,disfigured,blurry,watermark,normal quality,jpeg artifacts,low quality,worst quality,cropped,low res"
    steps = int(steps) if eval(steps) else 30

    # process image & mask  &  image_masked
    image = Image.open(join(filePath, fileName)).convert("RGBA").resize((512,512))
    image = images.flatten(image, "#ffffff")
    mask_image = Image.open(join(filePath, maskName)).resize((512,512))
    mask_image = images.create_binary_mask(mask_image)
    image = images.fill(image, mask_image)

    if SDModel == "CNI":
        control_image = make_inpaint_condition(image, mask_image)

    if SDModel == "SDI2":
        output = pipe(prompt=text,
            image=image,
            mask_image=mask_image,
            num_inference_steps=steps, #steps
            # strength=1,#(0~1)
            # num_images_per_prompt=1,
            nagative_prompt=nagative_prompt,
            # guidance_scale=7.5
            ).images[0]
    else:
        generator = torch.Generator(device="cpu").manual_seed(1)
        output = pipe(
            prompt=text,
            num_inference_steps=steps,
            generator=generator,
            eta=1.0,
            image=image,
            mask_image=mask_image,
            control_image=control_image,
        ).images[0]

    # output
    newimage = Image.new('RGBA', image.size, (0, 0, 0, 0))
    newimage.paste(image, (0, 0))
    newimage.paste(output, (0, 0), mask_image)

    # output.show()

    newimage.save(join(output_path,fileName[:-4]+"_output.png"))

def text2img():
    print("")

def img2img():
    print("")

def img2text():
    print("")