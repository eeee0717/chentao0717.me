---
title: ComfyUI Furry风格
postId: '1007'
date: 2024-05-20 15:11:18
lang: zh
duration: 5min
type: blog
art: connections
---

Hello大家好，今天给大家带来毛茸茸风格的Comfyui工作流的搭建教程。

> 本人初探Comfyui，感觉还是蛮有意思的。

下面是一些我使用后的结果

![](/images/comfyui-furry-1.png)

## 安装Comfyui

[https://github.com/comfyanonymous/ComfyUI](https://github.com/comfyanonymous/ComfyUI)

原文链接在这里，跟着我一步步来吧。

1. 安装pytorch环境

windows用户通过下面这个命令安装

`pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu121`

1. 下载comfyui

进入github链接,点击Code下拉菜单，Download ZIP下载，解压。

![](/images/comfyui-furry-2.png)

1. 安装依赖

解压完文件后，通过命令行`cd Comfyui`进入文件，再进入pytorch安装的环境，运行`pip install -r requirements.txt`。

> 到这就安装好了Comfyui的环境了，可以通过命令`python3 main.py`运行后将[http://127.0.0.1:8188](http://127.0.0.1:8188/)输入浏览器，就可以打开UI界面了

## 安装Comfyui Manager

为了更好的管理Comfyui，可以Comfyui Manager。

1. 进入ComfyUI/custom_nodes
2. 在命令行运行`git clone https://github.com/ltdrdata/ComfyUI-Manager.git`
3. restart comfyui

## 导入工作流

💡 kejun大佬分享的[furry&fluffy style icon V1.1 毛茸茸风格图标 V1.1](https://openart.ai/workflows/kejun/furry-icon/XueYOY1PYXXAHMcarWl8)

1. 下载[工作流](https://openart.ai/workflows/kejun/furry-icon/XueYOY1PYXXAHMcarWl8)，在网址中下载保存为.json格式的文件。

2. 在comfyui中导入，点击load按钮即可导入

3. 安装missing nodes，在导入json后可能会提示`node type is not found`

   不要担心，这时候我们点击Comfyui manager，点击`install missing custom node`，将缺少的node一个个下载后restart comfyui.

## 下载模型

各个模型的文件结构如下

comfyui/models/

|

|—checkpoints/

| |—— [majicmixRealistic_v7.safetensors](https://civitai.com/models/43331/majicmix-realistic)

|

|—clip_vision/

| |—— [CLIP-ViT-bigG-14-laion2B-39B-b160k.safetensors](https://huggingface.co/h94/IP-Adapter/resolve/main/models/image_encoder/model.safetensors)

| |—— [CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors](https://huggingface.co/h94/IP-Adapter/resolve/main/sdxl_models/image_encoder/model.safetensors)

|

|—controlnet/

| |—— [t2iadapter_canny_sd15v2.pth](https://huggingface.co/TencentARC/T2I-Adapter/resolve/main/models/t2iadapter_canny_sd15v2.pth?download=true)

| |—— [t2iadapter_color_sd14v1.pth](https://huggingface.co/TencentARC/T2I-Adapter/resolve/main/models/t2iadapter_color_sd14v1.pth?download=true)

| |—— [control_depth-fp16.safetensors](https://huggingface.co/webui/ControlNet-modules-safetensors/resolve/main/control_depth-fp16.safetensors?download=true)

| |—— [control_v11f1e_sd15_tile.bin](https://huggingface.co/lllyasviel/control_v11f1e_sd15_tile)([下载的是pth文件，需要转成bin文件](https://www.notion.so/Comfyui-furry-af6de0d18bcf443c8c456f57980800b7?pvs=21))

|

|—ipadapter(需要创建)/

| |—— [ip-adapter-plus_sd15.safetensors](https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter-plus_sd15.safetensors)

|

|—loras/

| |—— [毛绒2_v1.0.safetensors](https://www.liblib.art/modelinfo/da0bb8cf61094f32bc36607e58fb3aa1)

| |—— [是毛团子啊！可爱化动物模型\_V1.0.safetensors](https://www.liblib.art/modelinfo/c17051f8b3b74f29955bffaedc649fcc)

| |—— [Wool felt v1.0\_毛毡\_V1.0版.safetensors|](https://www.liblib.art/modelinfo/77be9311a31b463da2af682c2c849052)

|—vae/

| |—— [vae-ft-mse-840000-ema-pruned.safetensors](https://huggingface.co/stabilityai/sd-vae-ft-mse-original/resolve/main/vae-ft-mse-840000-ema-pruned.safetensors?download=true)

<aside>
🎉 如果你完成了上面的步骤，恭喜你，现在可以开始绘图啦！

</aside>

restart comfyui后上传一张白底的图片，点击queue prompt即可等待出图！

### pth转bin(创建如下main.py文件，并运行即可)

```python
import torch

# pth文件路径
model_path = 'control_v11f1e_sd15_tile.pth'  # 请替换为您的.pth模型文件路径
# bin文件路径
out_path = 'control_v11f1e_sd15_tile.bin'  # 请替换为您想要输出的.bin文件路径

# 加载模型
checkpoint = torch.load(model_path, map_location='cpu')

# 保存为.bin文件
torch.save(checkpoint,out_path)
```
