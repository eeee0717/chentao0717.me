---
title: Cherry Studio 网络搜索与知识库最佳实践
date: 2025-04-17 13:20:43
lang: zh
duration: 10min
type: blog
image: https://chentao0717.cn/og/cherry-rag-websearch.jpg
art: connections
---

随着Cherry Studio v1.2.5版本的更新，在知识库和网络搜索方面又有了一些新的进展。为此，打算写一篇Blog来分享一下如何更"聪明"地使用这两个功能。

## 前置准备

1. Cherry Studio v1.2.5及以上版本
2. 配置[网络搜索功能](https://docs.cherry-ai.com/websearch/mian-fei-lian-wang-mo-shi)
3. 配置[知识库功能](https://docs.cherry-ai.com/knowledge-base/knowledge-base)

## 进阶配置

### 网络搜索常规设置

网络搜索会获取网页的全部内容，LLM 解析时容易超出上下文限制，因此建议限制单个网页的内容长度，例如设置为 `2000` 字符。此外，也可以根据所使用模型处理上下文的能力进行调整。例如，对于拥有 `1M tokens` 上下文窗口的 `gemini-2.5-pro` 模型，可以适当放宽内容长度限制，或将处理的搜索结果数量上限调整为 20 个。

![cherry-rag-websearch-2](/images/cherry-rag-websearch-2.jpg)

### 网络搜索黑名单

为了提高网络搜索的质量，Cherry Studio提供了黑名单功能，可以通过配置黑名单，过滤掉一些不希望搜索的网站。

- 可以通过手动输入的方法
- 也可以通过订阅源的方式

> 一些常见的黑名单订阅源：https://iorate.github.io/ublacklist/subscriptions

![cherry-rag-websearch-1](/images/cherry-rag-websearch-1.jpg)

### 知识库

在基础配置之上，可以通过微调以下参数来优化知识库的检索效果：

1.  **知识库请求文档数量**：知识库可能包含大量文档。为了确保检索全面性，建议根据需要调整请求的文档数量。例如，可以设置为 `20` 个。
2.  **匹配度阈值**：设置阈值（例如 `0.7`）有助于过滤掉相关性较低的文档，提高检索精度。
3.  **返回结果数量**：指经过重排序后最终返回给用户的文档数量。例如，可以设置为 `5` 个。

> **提示**：建议对文档进行预处理，特别是通过 OCR 扫描生成的 PDF 文档。文本格式不规整（例如，错误的换行、乱码）会降低文本嵌入的质量，从而严重影响检索效果。

![cherry-rag-websearch-3](/images/cherry-rag-websearch-3.jpg)

## 最佳实践

这次准备的知识库文档是[KAG-dataset](https://github.com/docugami/KG-RAG-datasets/tree/main/sec-10-q/data/v1)中 2022-2023 苹果、微软、英伟达的财报数据。

1. 混合检索

在打开网络搜索和选定知识库的情况下，Cherry Studio会对用户查询进行分析，选择最优的检索方式进行检索。

例如，查询`OpenAI最新的模型是什么？`，由于知识库的内容与此问题无关，因此会选择网络搜索的方式进行检索。
![cherry-rag-websearch-4](/images/cherry-rag-websearch-4.jpg)

2. 单一检索

在打开网络搜索和选定知识库的情况下，可以通过`根据知识库/网络搜索`的方式进行单一检索。

#### 基于知识库的检索

![cherry-rag-websearch-5](/images/cherry-rag-websearch-5.jpg)

#### 基于网络搜索的检索

![cherry-rag-websearch-6](/images/cherry-rag-websearch-6.jpg)

3. 总结网络链接

可以直接向 Cherry Studio 提供网页链接，让其总结页面内容。

![cherry-rag-websearch-7](/images/cherry-rag-websearch-7.jpg)

## 总结

Cherry Studio的网络搜索和知识库功能可以帮助用户更高效地获取信息。通过合理的配置和使用，可以大大提高检索的质量和效率。希望这篇Blog能对大家有所帮助。
