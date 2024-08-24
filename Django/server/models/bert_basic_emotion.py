import logging

from django.http import JsonResponse
import torch
from torch.utils.data import TensorDataset, DataLoader, RandomSampler, SequentialSampler
import pandas as pd
import numpy as np
from transformers import BertTokenizer, BertConfig,AdamW, BertForSequenceClassification,get_linear_schedule_with_warmup
from sklearn.preprocessing import LabelEncoder

import json
import logging

def get_user_text(request):
    if request.method == 'POST':
        text = request.POST.get('text')
        return recognition(text)

def recognition(text):
    device = torch.device('mps')

    tokenizer = BertTokenizer.from_pretrained('/Users/dawnkaslana/Workspace/BERT/tokenizer/', do_lower_case=True)
    model = BertForSequenceClassification.from_pretrained("/Users/dawnkaslana/Workspace/BERT/model/").to(device)
    model.eval()

    class_dict = {4: 'sadness', 2: 'joy', 1: 'fear', 0: 'anger', 3: 'love', 5: 'surprise'}

    input_id = tokenizer.encode(text, add_special_tokens=True, max_length=256, padding='max_length', truncation=True)
    attention_mask = [float(i > 0) for i in input_id]
    test_input = torch.tensor(input_id).unsqueeze(0).to(device)
    test_mask = torch.tensor(attention_mask).unsqueeze(0).to(device)

    with torch.no_grad():
        logits = model(test_input, token_type_ids=None, attention_mask=test_mask)

    logits = logits[0].to('cpu').numpy()
    pred = np.argmax(logits, axis=1)[0]

    return JsonResponse({'msg': class_dict[pred]})