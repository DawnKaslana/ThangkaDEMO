<style>
  .infoBlock {
    border: 1px solid black !important;
    background-color: lightblue;
    color: black;
    padding: 10px;
    border-radius: 5px;
    font-weight: bold;
  }

  mark {
    background-color: yellow;
    color: red;
    font-weight: bold;
  }

  h1 {
    text-align: center;
    color: #5f4b8b;
    margin-bottom: 20px;
  }

  h2 {
    font-weight: bold;
  }

  h2, h3, h4 {
    color: #4c4c4c;
    margin-top: 20px;
  }

  h3 {
    margin-top: 10px;
  }

  h4 {
    margin-top: 10px;
  }

  .model-list ul {
    list-style-type: none;
    padding-left: 0;
  }

  .model-list li {
    padding: 5px 0;
    color: #555;
    line-height: 1.6;
  }

  .model-list li::before {
    content: "•";
    color: #800080;
    font-size: 1.2em;
    padding-right: 10px;
  }

  details {
    background-color: #fafafa;
    padding: 10px;
    margin-top: 15px;
    border-radius: 6px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  details summary {
    font-size: 1.1em;
    cursor: pointer;
    font-weight: bold;
    color: #4b8dff;
  }

  details summary:hover {
    color: #800080;
  }
</style>

 <!--<mark>熒光筆</mark>-->


# 选择模型
<div class="infoBlock">选择合适的生成模型来进行图像生成、修复或编辑操作。每个模型有不同的功能和支持的操作类型。</div>

#### **Stable Diffusion Inpaint 2 (SDI2)**
- **功能**：图像修复
- **类型**：inpaint
- **说明**：专注于图像内容的修复和填充，特别适合处理缺失或损坏的图像部分。

#### **ControlNet Inpaint 2 (CNI)**
- **功能**：图像修复
- **类型**：inpaint
- **说明**：结合控制网技术，允许用户精确控制修复区域，提升修复的精度和效果。

#### **ControlNet Canny**
- **功能**：图像修复与编辑
- **类型**：inpaint
- **说明**：使用Canny边缘检测结合控制网技术，为用户提供基于图像边缘信息的精准修复与编辑。

#### **Stable Diffusion 2.1 (SD21)**
- **功能**：文本到图像、图像到图像
- **类型**：text2img, img2img
- **说明**：Stable Diffusion 2.1是当前先进的扩散模型，通过逐步去噪生成高质量图像。其可以基于文本描述生成图像，或在已有图像基础上进行编辑。

#### **Stable Diffusion 1.5 (SD15)**
- **功能**：文本到图像、图像到图像
- **类型**：text2img, img2img
- **说明**：Stable Diffusion1.5是StableDiffusion系列的早期版本，能够生成高质量的图像。它适合在计算资源有限的环境中使用，提供较为快速的图像生成体验。

#### **EdgeConnect**
- **功能**：图像修复
- **类型**：inpaint
- **说明**：EdgeConnect是一个针对图像修复的深度学习模型，特别擅长修复图像的边缘部分。经过我们自定义数据训练，EdgeConnect能够较精确地恢复图像细节。

#### **微调模型 (Lora)**
- **功能**：微调
- **类型**：fine-tune
- **说明**：Lora（Low-Rank Adaptation）是一种基于低秩适应的微调方法，通过Lora，用户可以对生成模型进行定制化调整，得到更符合需求的输出。

<details>
  <summary>微调模型 (Lora) 示例图片</summary>
  <img src="https://pic1.zhimg.com/v2-605ef3d68377fd613dd242afe9425999_720w.jpg" alt="Lora 示例图片" style="width: 100%; max-width: 600px;">
</details>

<details>
  <summary>Lora 模型列表</summary>
  <ul>
    <li>thangka_21_Status_140</li>
    <li>thangka_21_Ob_EH_150</li>
    <li>thangka_21_ACD</li>
    <li>thangka_21_Ob_BA_150</li>
    <li>thangka_21_Ob_R8_150</li>
    <li>thangka_21_Ob_Ci_150</li>
    <li>thangka_21_Ob_AM+HC_150</li>
    <li>thangka_Ob_UP_150</li>
    <li>thangka_21_Ob_LT_150</li>
    <li>thangka_Ob_R8_85</li>
    <li>thangka_21_Ob_KW_150</li>
    <li>thangka_21_ACD_250</li>
  </ul>
</details>

# 设置参数
根据所选择的模型，您可以调整以下参数来优化生成效果：

- **渲染步数**：调整生成图像的迭代次数，步数越多，图像细节越丰富，但需要更多的计算时间。
- **生成数量**：选择需要生成的图像数量，支持批量生成，最多可生成4张图像。
- **提示词权重**：调整提示词（Prompt）和负面提示词（Negative Prompt）的权重，以确保生成的图像符合预期。
- **噪声比例**：调整噪声比例，影响图像的细节或模糊效果，噪声比例越高，生成的图像效果越模糊或不清晰。
- **种子值**：设定一个固定的种子值以保证生成结果的可重复性，或选择随机种子以增加多样性。

# 使用标签
点击标签按钮打开标签面板，您可以为提示词（Prompt）和负面提示词（Negative Prompt）添加标签，便于快速选择或修改常用的提示内容。


# 其他功能
## 语言切换
点击翻译按钮切换提示词语言，支持中文与英文之间的互译，方便不同语言用户使用。
## 退出系统
点击“退出”按钮退出当前账户，确保数据安全。
