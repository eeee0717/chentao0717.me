---
title: Cherry Studio v1.6.0 知识库使用指南
date: 2025-09-04 20:40:34
lang: zh
duration: 10min
type: blog
image: https://chentao0717.cn/og/cherry-knowledge.jpg
art: connections
---

Cherry Studio 在1.6.0版本对知识库进行了重构，为后续更丰富的功能更新打下了基础。

## 前置条件

- Cherry Studio v1.6.0及以上版本

## 知识库迁移

由于知识库在底层上使用的向量存储库和之前的版本不兼容，因此需要进行迁移。迁移步骤如下：

1. 在知识库界面上方的蓝色Badge中会提示迁移操作，点击即可开始迁移。
   > 迁移过程中会将原先的文档重新进行向量化，因此会耗费大量的token，请注意用量。

![cherry-knowledge-1.6.0-1](/images/cherry-knowledge-1.6.0-1.jpg)

2. 迁移完成后会保留原始知识库和迁移后的知识库副本，在确认迁移成功后，可以自行决定是否删除原始知识库（原知识库仍不影响继续使用）。

## 新增功能

### 视频嵌入

#### YouTube视频嵌入

在保证网络环境的情况下，可以直接在网址栏中输入YouTube视频的链接，Cherry Studio会自动识别并进行嵌入。

![cherry-knowledge-1.6.0-2](/images/cherry-knowledge-1.6.0-2.jpg)

#### 本地视频嵌入

对于本地视频文件，可以通过上传的方式进行嵌入，支持的格式包括`mp4`、`mov`、`avi`等常见格式。并且需要上传**srt**格式的字幕文件，Cherry Studio会根据字幕内容进行向量化。

![cherry-knowledge-1.6.0-3](/images/cherry-knowledge-1.6.0-3.jpg)

### 检查与使用

1. 在嵌入完成后可以通过右上角的搜索按钮对嵌入结果进行检查。

![cherry-knowledge-1.6.0-4](/images/cherry-knowledge-1.6.0-4.jpg)

2. 在聊天中使用知识库时，当检索到视频相关的内容时，会直接返回视频的链接并且跳转到对应的时间节点。

![cherry-knowledge-1.6.0-5](/images/cherry-knowledge-1.6.0-5.jpg)
