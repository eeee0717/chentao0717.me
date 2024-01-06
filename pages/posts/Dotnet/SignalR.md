---
title: SignalR
date: 2024-01-05T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## WebSocket和SignalR的区别
### WebSocket
1. WebSocket是基于TCP协议，支持二进制，双工通讯
2. 性能和并发性能好
3. 独立于HTTP协议，一般仍然把WebSocket服务部署到Web服务器上，可以共享HTTP端口

### SignalR
1. SignalR是.NET Core平台下对WebSocket的封装。
2. Hub（集线器）数据交换中心

## SignalR基本用法
```csharp
public class ChatHub : Hub
{
    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}
```
```csharp
services.AddSignalR();
app.MapHub<ChatHub>("/chatHub"); // 启用Cors
```

> SignalR协议协商 支持多种服务器推送方式，如WebSocket、Server-Sent Events、Long Polling

## SignalR的分布式
解决方案：所有服务器连接到消息中间件上。使用粘性会话或跳过协商。
### redis backplane
```csharp
services.AddSignalR().AddStackExchangeRedis("redis connection string", options =>
{
    options.Configuration.ChannelPrefix = "ChatApp";
});
```
