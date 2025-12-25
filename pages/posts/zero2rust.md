---
title: Zero2Rust 读书心得
date: 2024-09-06 09:58:53
lang: zh
duration: 5min
type: blog
art: connections
---

## 项目介绍

### 构建一个Newsletter程序

### 需求分析

- Blog visitor: 管理多个newsletter
- Blog author: 通知订阅者
- Newsletter subscriber: 停止接收newsletter

> 在构建项目的过程中，可以先实现一个用户的需求，然后再逐渐扩展。

## 如何编写一个合格的测试

在项目的开头不要着急写主体程序，而是先构建一个预期可达到的测试结果。

### 数据库的测试

在每次修改代码运行`cargo test`时，会向数据库添加一个测试用例，而反复添加则会使测试中断，因此可以在每次测试时创建一个逻辑数据库，以UUID为name，在执行完测试后可以批量删除，而不影响主库。

同时，为了保证数据库的异步操作，可以使用线程池来防止数据库堵塞。

> i will try to use english to explain something i have learned.

## Observability

### Logging
