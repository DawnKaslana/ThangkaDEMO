项目简介
===

平台发布链接: [121.40.100.199:12537](121.40.100.199:12537)<br>
GitHub链接: https://github.com/DawnKaslana/ThangkaDEMO.git

### 选题背景
本团队的研究方向是文生图扩散模型，使用的唐卡图像数据得到了实验室及导师的支持。在研究过程中，团队还收集了不少网上的唐卡图像数据，并为图像加入文本后构建了唐卡文本图像数据集。通过该数据集，团队微调了稳定扩散模型，以提升唐卡修复效果。选择该产品设计的主要目的是展示研究成果[[1]](https://ieeexplore.ieee.org/document/10687698/)，并制作展示网页。

- 中国非物质文化遗产
唐卡画作具有极高的文化和艺术价值，内容涵盖宗教、历史、风俗等多个方面，拥有深厚的历史背景，因此被誉为“西藏百科全书”，体现了唐卡在文化传承中的重要地位。

- 画作容易受损
唐卡因其材质特殊且长期供奉，如保存不当，极易受损。常见的问题包括：磨损、刮痕、布帛开裂，颜料也容易模糊或褪色。

- 手工修复的难点
唐卡修复需要专业的技巧与经验。修复化学药剂可能会对画作造成二次损伤，且需要确保修复效果与原画风格一致。现代工具的使用也面临很大挑战，传统的笔修方式因画师而异，可能导致图像风格不一致，对修复者的技巧和经验要求极高。

### 主要内容
本产品允许使用者利用本团队搜集的数据微调过的模型在线修复唐卡图像。

- 文心一言交互式对话：在生成图像的过程中，用户可以通过交互式对话获取文本描述、生成灵感及提示优化等支持。
- 专门设计的唐卡标籤：使用者可以获取到我们数据集中为唐卡设计的专用标籤，以提升修复效果。

本产品旨在提供简便且高效的唐卡图像修复解决方案，同时增强用户的交互体验。

其中引用了2019 EdgeConnect[[2]](https://github.com/knazeri/edge-connect)的邊緣修復工作。

平台功能說明
===

<center>
<img src="https://hackmd.io/_uploads/HJROHiDE1g.png" width="500px" >
</center>

左側為可開合的參數設置欄位，右側為與文心一言的對話框。

选择模型
---

<center>
<img src="https://hackmd.io/_uploads/B1Xi4iPV1e.png" alt="2024-12-12-014333" width="500px" >
</center>

<div class="info-block">
  选择合适的生成模型来进行图像生成、修复或编辑操作。每个模型有不同的功能和支持的操作类型。
<h3><strong>Stable Diffusion Inpaint 2 (SDI2)</strong></h3>
      <ul>
        <li><strong>功能：</strong>图像修复</li>
        <li><strong>类型：</strong>inpaint</li>
        <li><strong>说明：</strong>专注于图像内容的修复和填充，特别适合处理缺失或损坏的图像部分。</li>
      </ul>
<h3><strong>ControlNet Inpaint 2 (CNI)</strong></h3>
      <ul>
        <li><strong>功能：</strong>图像修复</li>
        <li><strong>类型：</strong>inpaint</li>
        <li><strong>说明：</strong>结合控制网技术，允许用户精确控制修复区域，提升修复的精度和效果。</li>
      </ul>

<h3><strong>ControlNet Canny</strong></h3>
      <ul>
        <li><strong>功能：</strong>图像修复与编辑</li>
        <li><strong>类型：</strong>inpaint</li>
        <li><strong>说明：</strong>使用Canny边缘检测结合控制网技术，为用户提供基于图像边缘信息的精准修复与编辑。</li>
      </ul>

<h3><strong>Stable Diffusion 2.1 (SD21)</strong></h3>
      <ul>
        <li><strong>功能：</strong>文本到图像、图像到图像</li>
        <li><strong>类型：</strong>text2img, img2img</li>
        <li><strong>说明：</strong>Stable Diffusion 2.1是当前先进的扩散模型，通过逐步去噪生成高质量图像。</li>
      </ul>

<h3><strong>EdgeConnect</strong></h3>
      <ul>
        <li><strong>功能：</strong>图像修复</li>
        <li><strong>类型：</strong>inpaint</li>
        <li><strong>说明：</strong>EdgeConnect特别擅长修复图像的边缘部分，经过自定义数据训练，能够较精确地恢复图像细节。</li>
      </ul>
<details>
  <summary>生成模型列表</summary>
  <ul>
    <li>Stable Diffusion Inpaint 2 (SDI2)</li>
    <li>ControlNet Inpaint 2 (CNI)</li>
    <li>Stable Diffusion 2.1 (SD21)</li>
    <li>Stable Diffusion 1.5 (SD15)</li>
  </ul>
</details>  
<details>
  <summary>Lora微调模型列表</summary>
  <ul>
    <li>thangka_21_Status_140</li>
    <li>thangka_21_Ob_EH_150<br>
    <img src="https://hackmd.io/_uploads/HkR6zW_4Jg.png" alt="[thangka_21_Ob_AM+HC_150]" width="400px">
</li>
    <li>thangka_21_ACD</li>
    <li>thangka_21_Ob_BA_150<br>
    <img src="https://hackmd.io/_uploads/BJI68-dEyg.png" alt="thangka_21_Ob_BA_150" width="400px"></li>
    <li>thangka_21_Ob_R8_150<br>
    <img src="https://hackmd.io/_uploads/SJMtPZdVyg.png" alt="thangka_21_Ob_BA_150" width="400px"></li>
    <li>thangka_21_Ob_Ci_150<br>
    <img src="https://hackmd.io/_uploads/SkorwZONkl.png" alt="thangka_21_Ob_BA_150" width="400px"></li>
    <li>thangka_21_Ob_AM+HC_150<br>
    <img src="https://hackmd.io/_uploads/HkR6zW_4Jg.png" alt="thangka_21_Ob_AM+HC_150" width="400px">
</li>
    <li>thangka_Ob_UP_150</li>
    <li>thangka_21_Ob_LT_150<br>
    <img src="https://hackmd.io/_uploads/H14_vWu4ke.png" alt="thangka_21_Ob_AM+HC_150" width="400px"></li>
    <li>thangka_Ob_R8_85</li>
    <li>thangka_21_Ob_KW_150<br>
    <img src="https://hackmd.io/_uploads/r1DDP-dEkg.png" alt="thangka_21_Ob_AM+HC_150" width="400px"></li>
    <li>thangka_21_ACD_250<br>
    <img src="https://hackmd.io/_uploads/Hy34z-O41l.png" alt="thangka_21_ACD_250" width="400px"></li>
  </ul>
</details>
 
<details>
  <summary>控制模型列表</summary>
  <ul>
    <li>control_sd21_canny</li>
  </ul>
</details>
</div>
      
生成參數设置
---
<li>点击翻译按钮切换提示词语言，支持中文与英文之间的互译。</li>

<center>
<img src="https://hackmd.io/_uploads/By2ox0vEkx.png" width="500px">
</center>

<div class="info-block">
  <h4>调整以下参数以优化生成效果：</h4>
  <center>
  <img src="https://hackmd.io/_uploads/rkkqwRPNkx.png" width="500px">
  </center>
  <ul>
    <li>渲染步数：调整生成图像的迭代次数，步数越多，图像细节可能越丰富，但需要更多的计算时间。</li>
    <li>生成数量：选择需要生成的图像数量，支持批量生成，最多可生成4张图像。</li>
    <li>提示词权重：调整提示词（Prompt）和负面提示词（Negative Prompt）的权重，以确保生成的图像符合预期。</li>
    <li>噪声比例：调整噪声比例，影响图像的重绘幅度。</li>
    <li>种子值：设定一个固定的种子值以保证生成结果的可重复性，或选择随机种子以增加多样性。</li>
  </ul>
</div>
  
在线编辑图像
---
可以在线上编辑图像或者制作mask。

<center>
<img src="https://hackmd.io/_uploads/Byi3kbdVyl.png" width="400px">
</center>

图片支持基本的放大、缩小、绘制、清除、加入图案、下载、裁剪等功能。

生成结果作為輸入
---

<center>
<img src="https://hackmd.io/_uploads/BJUE-JPU1x.png" width="400px">
</center>

点击該按钮，您可以将生成的图像作为后续的输入进行进一步的生成操作。

标签系統
---

<div class="info-block">
  点击标签按钮打开标签面板，您可以为提示词（Prompt）和负面提示词（Negative Prompt）添加标签，便于快速选择或修改常用的提示内容。
  点击prompt处的标签展开即可在页面左侧获得一个Prompt列表，可以自行增加类别，也可以增加类别中的元素。，支持修改Prompt中元素的名字。点击翻译按钮，可以实现prompt文本的中英互译。
</div>

<center>
<img src="https://hackmd.io/_uploads/rk2sW0P41l.png" width="600px">
<img src="https://hackmd.io/_uploads/rkv6w0P41x.png" width="600px">
</center>

用户功能
---

用户管理界面可进行的操作有，删除用户、新增用户、搜索用户、修改用户。选定一个用户并点击后即可进入操作页面。
<center>
<img src="https://hackmd.io/_uploads/rkrfb0DVke.png" width="400px">
</center>

点击“退出”按钮退出当前账户。

<center>
<img src="https://hackmd.io/_uploads/Bk3KXyP8kl.png" width="400px">
</center>