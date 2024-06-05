---
title: Podwise AI
date: 2024-05-25 16:35
lang: zh
duration: 5min
type: blog
---

## 项目介绍

该项目的灵感来源于听播客,播客中有很多优质的内容,例如半拿铁中的故事,但是听完之后,很容易忘记,故希望通过AI技术,将播客内容进行提取,并生成文字,方便用户查看。

## 技术栈

参考[硬地骇客的博客](https://book.hardhacker.com/build/buildstack)

本项目的技术栈选择如下(暂定):

- Web前端: Nuxt.js, TypeScript, UnoCSS, PrimeVue
- Web后端: Nuxt.js, TypeScript
- 纯后端服务: Asp.Net Core

## 核心功能

- 工作流1: 下载音频文件 -> 探测语言 -> 预采样音频内容 -> whisper 转录音频 -> 生成分段 -> 优化 transcript -> 写入 db。
- 工作流2: load transcript -> 分段（split）-> 总结章节，抽取 highlights和关键词 -> 基于章节生成全文总结 -> 解释关键词 -> 基于章节生成 mindmap -> 写入 db。
- 开放api接口，手机可以通过快捷指令的方式将播客发送待处理列表。

## LLM模型选择

由于最近qwen-long的价格大幅度下降,可以以qwen-long为首选,但是为了保证后续模型的可替换性,以OpenAI接口格式为标准。可用的模型可包括:kimi, deepseek, gpt3.5。

## 开发日志

### 获取小宇宙podcast和episode

1. 需要需要先获取access token，通过抓包获取第一个refresh token 和 access token，然后post `https://api.xiaoyuzhoufm.com/app_auth_tokens.refresh`这个url即可获取新的access token。
2. 获取episode，通过`https://api.xiaoyuzhoufm.com/v1/episode/get?eid=${episode.eid}`获取单集的信息
3. 获取podcast，通过`https://api.xiaoyuzhoufm.com/v1/podcast/get?pid=${podcast.pid}`获取单个podcast的信息
4. 获取episode列表，使用post请求`https://api.xiaoyuzhoufm.com/v1/episode/list`,参数为`{"pid":"pid", "loadMoreKey":"loadMoreKey"}`

### 数据库设计

> 使用数据库存放导入的播客的信息

1. podcast表

| id  | pid | title | author | description | picUrl |
| --- | --- | ----- | ------ | ----------- | ------ |

2. episods表

| id  | pid | eid | title | datePublished | duration | description | mediaUrl | picUrl |
| --- | --- | --- | ----- | ------------- | -------- | ----------- | -------- | ------ |

### 2024-6-5小结

1. 目前实现的功能有：

- 导入podcast链接，获取所有的episods
- 将podcast和episods信息存入pgsql数据库
- 展示episods列表
- 可进行episods的排序

2. 下一步计划：

- 实现导入episode链接，输出至/episode页面
- ✅ 在制作episode页面详情页之前进行重构设计，完善代码逻辑
- mindmap[组件](https://vueflow.dev/guide/getting-started.html)
