---
title: 依赖注入
date: 2023-12-15T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 概述
依赖注入是控制反转思想的实现方式。依赖注入简化模块的组装过程，降低模块之间的耦合度。

### 分类
1. 服务定位
2. 控制反转


## DI
### 生命周期
1. Transient（瞬时）：每次请求都会创建一个新的实例。
2. Scoped（作用域）：每次请求都会创建一个新的实例，但是在同一个请求中，每次都会使用同一个实例。
3. Singleton（单例）：每次请求都会使用同一个实例。

## 扩展方法
### AddTransient
```csharp
// ConsoleLogExtension.cs
public static class ConsoleLogExtension
{
    public static void AddConsoleLog(this IServiceCollection services)
    {
        services.AddTransient<ILog, ConsoleLog>();
    }
}
// main.cs
public static void Main(string[] args)
{
    var services = new ServiceCollection();
    services.AddConsoleLog();
}
```
## asp.net core中的DI
### 服务需要时注册
> 服务需要时注册，不需要时注销，这样可以提高性能。
```csharp
[FromServices]
public IActionResult Index([FromServices] ILog log)
{
    log.Write("Hello World");
    return View();
}
```
