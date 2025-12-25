---
title: Cherry Studio MCP with Arxiv
date: 2025-03-11 17:17:04
lang: zh
duration: 5min
type: blog
image: https://chentao0717.cn/og/mcp-arxiv.png
art: connections
---

今天我们来探索如何使用 Cherry Studio MCP 来实现 Arxiv 论文的下载和总结。

## MCP工具准备

这次会用到两个MCP工具

- [ArXiv MCP Server](https://github.com/blazickjp/arxiv-mcp-server?tab=readme-ov-file)
- [Filesystem MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)

### ArXiv MCP Server

1. 下载

```bash
uv tool install arxiv-mcp-server
```

2. 配置mcp server
   ![arxiv-mcp-server](/images/mcp-arxiv-1.jpg)

> TIP: 参数的最后一行为论文保存路径

### Filesystem MCP Server

1. 下载npx

```bash
npm install -g npx
```

2. 配置mcp server
   ![filesystem-mcp-server](/images/mcp-arxiv-2.jpg)

> TIP: 参数的最后一行为允许访问的路径

## 任务清单

请完成以下任务：

1. 下载"Attention is all you need"论文到我的桌面
2. 理解桌面中的图片，图片文件名即为图片的内容
3. 结合图片总结论文要点，在合适的地方插入图片，并在我的桌面生成一个transformer.md的文件
4. 审阅生成的transformer.md，要符合论文内容。

> 经测试使用`claude-3.5-sonnet`可以比较好的一次性执行这个任务，但目前Cherry Studio MCP还有一些bug，暂时使用`qwen-max`来分步完成这个任务,具体效果如下。

### transformer.md内容

![transformer.md](/images/mcp-arxiv-4.jpg)

### 具体问答流程

<div style="display: flex; justify-content: center;">
<img src="/images/mcp-arxiv-3.jpg" style="width: 50%; height: 50%;"/>
</div>
