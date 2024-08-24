import os.path
from diffusers import StableDiffusionPipeline, DiffusionPipeline, UNet2DConditionModel
import torch
import time

'''
export TRANSFORMERS_CACHE=/media/brl2022-1/brl2022-1-1/xty/huggingface/hub/
export HF_HOME=/media/brl2022-1/brl2022-1-1/xty/huggingface/
export HUGGINGFACE_HUB_CACHE=/media/brl2022-1/brl2022-1-1/xty/huggingface/hub/
'''
torch.cuda.set_device(0)

output_path = "./output/"
model_path = "./models/sd15/thangka_Ob_AM"

model_id = "checkpoint-15000" #if needed
# pipe.unet.load_attn_procs(model_path, subfolder=model_id, weight_name="pytorch_model.bin")

if not os.path.exists(output_path):
    os.makedirs(output_path)

myList = [

{"file_name": "1", "text":"a thangka of Uttanaja Anjali mudra, wear murky jewelry set with bright green gems, simple murky bracelet, gray blue hairy deerskin and deer head draped on right shoulder, MianTang style"},
{"file_name": "2", "text":"a thangka of Uttanaja Anjali mudra, simple murky bracelet, gray blue hairy deerskin and deer head draped on right shoulder, MianTang style"},

]

premodel_path = "runwayml/stable-diffusion-v1-5"
premodel_abspath = "/media/brl2022-1/brl2022-1-1/xty/SDmodels/SD15"
# stabilityai/stable-diffusion-2-1-base
print("create pipe")
pipe = StableDiffusionPipeline.from_pretrained(premodel_abspath, torch_dtype=torch.float16)
pipe.unet.load_attn_procs(model_path, weight_name="thangka_OB_AM.safetensors")
pipe.to("cuda")

count = 0
for item in myList:
    steps = 50
    count+=1
    imgName, prompt = item["file_name"],item["text"]
    print(imgName, prompt)
    image = pipe(prompt, num_inference_steps=steps, guidance_scale=7.5).images[0]
    time.sleep(0.5)
    image.save(output_path+str(count)+"_"+str(steps)+".png")
