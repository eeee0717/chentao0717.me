---
title: Cherry Studio MCP初探
date: 2025-03-05 20:29:54
lang: zh
duration: 10min
type: blog
image: https://chentao0717.cn/og/mcp.png
art: connections
---

其实很早之前就已经听说了mcp了，但是一直没有去了解，借这次[vaayne大佬](https://github.com/vaayne)向Cherry Studio提交了PR的机会，也开始了解并体验了一下mcp。

## [Model Context Protocol](https://github.com/modelcontextprotocol)

mcp是一个开源的协议，它以标准化的形式向LLM提供上下文。可以将其理解为AI届的U盘，LLM可以根据自身需求向mcp server获取需要的插件，达到获取上下文的目的。相比于function tool，mcp更像是更高维度的抽象。

## MCP in Cherry Studio

目前mcp还在测试阶段，但已经可以通过clone [main](https://github.com/CherryHQ/cherry-studio)分支提前体验了！

以`fetch`功能为例，可以在[文档](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch)中查找详情。

1. 安装`uv`

```bash
// macos/linux
curl -LsSf https://astral.sh/uv/install.sh | sh

// windows
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

2. 在设置中`MCP Servers` -> `Add Server` -> 将下面的参数填入其中。([参考链接](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch))

![mcp](/images/mcp.jpg)

> 点击确定后，Cherry Studio就会自动下载fetch server，然后就可以愉快的使用啦🎉

3. 使用效果如下(可以看到效果还是很不错的)

![mcp2](/images/mcp-2.png)

## 总结

随着各大AI Client逐渐对mcp的支持，mcp的应用范围也会越来越广泛。Cherry Studio作为一个开源项目，也在不断的完善mcp的功能，希望大家可以多多关注🎉！
