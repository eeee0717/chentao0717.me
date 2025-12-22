---
title: Cherry Studio 知识库V2 提案
date: 2025-12-21
lang: zh
duration: 10min
type: blog
image: https://chentao0717.cn/og/cherry-knowledge-v2.jpg
---

## 目标

在Agent时代，打造一个为Agent使用的智能知识库。它不应该只是一个提供查询的"图书馆"，而应该是能由Agent进行 **自助阅读、自我学习、自我优化** 的动态数据库。

## 3种常见的RAG架构对比

## 头脑风暴

1. agentic rag
2. 暴露成api服务，便于其他应用进行调用，也方便建立完善的知识库测试脚本
3. 以mcp服务的形式

- 暴露基础的知识库搜索(BM25)，添加，修改，删除等操作
- 暴露知识库检索参数，BM25参数，搜索个数
- 可以直接对知识库libsql进行查询，如查询知识库中的文档个数(用户query："我有多少个文档", "知识库中有什么内容"等)
- 提供对某个chunk添加metadata，eg. 后续可以通过agent的能力对知识库中的内容进行标注，替代现在人工标注

4. 需要一个数据集进行验证测试
