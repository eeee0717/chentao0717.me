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

## LLM模型选择

由于最近qwen-long的价格大幅度下降,可以以qwen-long为首选,但是为了保证后续模型的可替换性,以OpenAI接口格式为标准。可用的模型可包括:kimi, deepseek, gpt3.5。
