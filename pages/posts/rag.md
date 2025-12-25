---
title: RAG 学习与探索
date: 2025-03-18 18:07:57
lang: zh
duration: 8min
type: blog
image: https://chentao0717.cn/og/rag.png
art: connections
---

## RAG (Retrieval Augmented Generation)检索增强生成

随着LLM的逐渐火热，RAG也开始出现在了人们的视野中，通俗来讲，RAG就是在LLM的基础上，结合额外提供的知识库内容，生成更加准确的回答。

显而易见，RAG解决了通用LLM的以下几个缺点：

1. 知识的局限性：LLM的知识完全来源于训练数据，即使ChatGPT爬取了互联网上的所有资料，但仍有一些内部文档是无法被获取的。
2. 幻觉问题：LLM生成的回答可能是不准确的，因为它只是根据训练数据生成的，而不是根据真实的知识生成的。

## 传统RAG

![rag-1](/images/rag-1.svg)

传统的RAG流程十分简单：将文本分块，通过嵌入模型将其转化为向量存储在向量数据库中，查询时，通过一些距离算法（余弦相似性、欧氏距离等），获取top_k个片段，LLM根据获取的片段进行针对性的回答。

当然传统的RAG也是存在一些缺点的：

1. 嵌入模型的局限性：由于嵌入模型存在固定的维度，因此嵌入向量可能缺少对语义的理解，且对长文档和复杂文档解析能力较差。
2. 泛化性：嵌入方法往往无法遇见片段上下文，因此在实际应用中还是缺少一定的精确度。

## Rerank + RAG

![rag-3](/images/rag-3.svg)

以`Cherry Studio`中实现的`Rerank Rag`为例，在传统RAG的链路中加入了Rerank模型。

### Rerank

Rerank的核心是基于BERT的cross-encoder模型，具体原理如下：

- 交叉编码器模型：cross-encoder模型将query和文字块进行比较，计算它们的语义匹配度，再进行排序，从而改进检索结果的精确度。

使用Rerank Rag获得的优点：

1. 高精确性：Rerank模型通过交叉编码器对query和文字块进行语义匹配度计算，提高检索结果的精确性。
2. 高性价比：使用Rerank会有一种四两拨千斤的感觉，不仅提供了一种简单且低复杂度的方法来改善搜索结果，允许用户将语义相关性纳入现有的搜索系统中，而且无需进行重大的基础设施修改。

## 总结

这是对现有的`Cherry Studio`知识库增强的一次尝试，后续还有更多的增强知识库的工作要做。

To Be Continue...

### 相关材料

[1] [基礎RAG退散，小模型Reranker來來](https://medium.com/@bohachu/%E5%9F%BA%E7%A4%8Erag%E9%80%80%E6%95%A3-reranker%E4%BE%86%E4%BE%86-5c2304d1b87d)

[2] [Dify 重排序](https://docs.dify.ai/zh-hans/learn-more/extended-reading/retrieval-augment/rerank)
