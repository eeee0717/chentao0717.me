---
title: HostedService
date: 2024-01-04T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 概述
代码托管在后台服务中，可以在应用程序启动时启动，也可以在应用程序关闭时关闭。

托管服务实现`IHostedService`借口,一般编写从`BackgroundService`类继承的类。

`services.AddHostedService<HostedService>();`注册服务

## HostedService
```csharp
public class HostedService: BackgroundService
{
  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    Console.WriteLine("HostedService is starting.");
    await Task.Delay(1000);
    Console.WriteLine("HostedService is stopping.");
  }
}
```
```csharp
// Program.cs
services.AddHostedService<HostedService>();
```
## HostedService的异常问题
当托管服务中发生未处理的异常时，应用程序将退出。使用`try catch`捕获异常，或者使用`IHostApplicationLifetime`接口的`StopApplication`方法停止应用程序。


## 注入DI
托管服务是以单例的生命周期注册到DI容器中的，因此在构造函数中注入的服务也是单例的。

可以通过构造方法注入一个`IServiceScopeFactory`，然后在`ExecuteAsync`方法中创建一个作用域，从而获取到一个瞬时的服务。一定要Dispose掉作用域。

```csharp
public class HostedService: BackgroundService
{
  private readonly IServiceScopeFactory _scopeFactory;
  public HostedService(IServiceScopeFactory scopeFactory)
  {
    _scopeFactory = scopeFactory;
  }
  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    using var scope = _scopeFactory.CreateScope();
    var service = scope.ServiceProvider.GetRequiredService<IService>();
    await service.DoSomething();
  }
}
```

## 案例
每隔5s打印一次当前时间
```csharp
public class HostedService: BackgroundService
{
  private readonly ILogger<HostedService> _logger;
  public HostedService(ILogger<HostedService> logger)
  {
    _logger = logger;
  }
  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    while(!stoppingToken.IsCancellationRequested)
    {
      _logger.LogInformation($"Current time: {DateTime.Now}");
      await Task.Delay(5000);
    }
  }
}
```
```csharp
