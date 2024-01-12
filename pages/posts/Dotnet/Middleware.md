---
title: Middleware
date: 2023-12-28T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 概述
中间件是ASP.NET Core的核心组件，MVC框架、响应缓存、身份验证、CORS、Swagger等都是内置中间件。

中间件由**前逻辑、next()、后逻辑**组成，前逻辑和后逻辑都是可选的。

## 基本中间件使用
```csharp
app.Map("/test",  pipBuilder =>
{
  pipBuilder.Use(async (context, next) =>
  {
    context.Response.ContentType = "text/html";
    await context.Response.WriteAsync("1  Start<br/>");
    await next.Invoke();
    await context.Response.WriteAsync("1  End<br/>");
  });
  pipBuilder.Use(async (context, next) =>
  {
    await context.Response.WriteAsync("2  Start<br/>");
    await next.Invoke();
    await context.Response.WriteAsync("2  End<br/>");
  });
  pipBuilder.Run(async ctx =>
  {
    await ctx.Response.WriteAsync("hello middleware <br/>");
  });
});
```
## 中间件类
```csharp
public class TestMiddleware
{
  private readonly RequestDelegate _next;
  public TestMiddleware(RequestDelegate next)
  {
    _next = next;
  }
  public async Task InvokeAsync(HttpContext context)
  {
    context.Response.ContentType = "text/html";
    await context.Response.WriteAsync("1  Start<br/>");
    await _next.Invoke(context);
    await context.Response.WriteAsync("1  End<br/>");
  }
}
```

## 中间件扩展
```csharp
public static class TestMiddlewareExtensions
{
  public static IApplicationBuilder UseTest(this IApplicationBuilder builder)
  {
    return builder.UseMiddleware<TestMiddleware>();
  }
}
```
```csharp
app.UseTest();
```


