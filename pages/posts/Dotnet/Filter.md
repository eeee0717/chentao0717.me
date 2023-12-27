---
title: Filter
date: 2023-12-27T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 面向切面编程
面向切面编程（Aspect-Oriented Programming，AOP）是一种编程范式，它的目的是将横切关注点与业务逻辑分离，从而提高代码的模块化程度。横切关注点是指那些与业务逻辑无关的代码，比如日志、安全、缓存、事务等。将这些横切关注点与业务逻辑相分离，即可将它们独立到非指导业务逻辑的模块中，这种分离有助于减少代码重复，提高模块化程度，同时也有利于代码维护，提高代码的可重用性。

## 类型
1. Authorization filter
2. Resource filter
3. Action filter
4. Exception filter
5. Result filter

## Exception filter
当系统出现未经处理的异常的时候，异常过滤器将会被调用。
```csharp
public class CustomExceptionFilter : IAsyncExceptionFilter
{
    private readonly IWebHostEnvironment _env;
    public Task OnException(ExceptionContext context)
    {
        string msg;
        if(_env.IsDevelopment())
        {
            msg = context.Exception.ToString();
        }
        else
        {
            msg = "An error occurred";
        }
        var objResult = new ObjectResult(new {code = 500, message = msg});
        context.Result = objResult;
        // handle影响到后续的异常处理，跟顺序有关
        context.ExceptionHandled = true;
        return Task.CompletedTask;
    }
}
```
```csharp
[Route("api/[controller]")]
[ApiController]
[TypeFilter(typeof(CustomExceptionFilter))]
public class ExceptionFilterController : ControllerBase
{
    [HttpGet]
    public ActionResult Get()
    {
        throw new Exception("Exception triggered");
    }
}
```
## Action filter
和Exception差不多
案例：自动启用事务的filter
1. 数据库事务：要么全部成功，要么全部失败
2. 自动化：启动、提交以及回滚事务
3. 当一段使用EFCore进行数据库操作的代码放到TransactionScope时自动标记为支持事务
4. TransactionScope实现IDisposable接口
5. 支持嵌套事务
```csharp
using(TransactionScope tx = new(TransactionScopeOption.Enabled))
{
    ctx.Books.Add(book);
    ctx.SaveChanges();
    tx.Complete();
}
```

