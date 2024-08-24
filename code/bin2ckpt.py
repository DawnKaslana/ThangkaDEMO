import os
import re
import torch
from safetensors.torch import save_file

loraName = os.path.split(os.getcwd())[1]
path = './models/sd21/thangka_Ob_UP/checkpoint-15000'
loraModel = 'thangka_Ob_UP'

# for root, dirs, files in os.walk(path):
    # for dir in dirs:
    #     ckptIndex = re.search('^checkpoint\-(\d+)$', dir)
    # else:
    #     break

newDict = dict();
checkpoint = torch.load(os.path.join(path, 'pytorch_model.bin'))
for idx, key in enumerate(checkpoint):

    newKey = re.sub('\.processor\.', '_', key)
    newKey = re.sub('mid_block\.', 'mid_block_', newKey)
    newKey = re.sub('_lora.up.', '.lora_up.', newKey)
    newKey = re.sub('_lora.down.', '.lora_down.', newKey)
    newKey = re.sub('\.(\d+)\.', '_\\1_', newKey)
    newKey = re.sub('to_out', 'to_out_0', newKey)
    newKey = 'lora_unet_'+newKey

    newDict[newKey] = checkpoint[key]

newLoraName = path + loraModel + '.safetensors'
print("Saving " + newLoraName)
save_file(newDict, newLoraName)
