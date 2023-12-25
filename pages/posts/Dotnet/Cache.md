---
title: Cache
date: 2023-12-25T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 缓存的概念
1. 缓存命中
2. 缓存命中率
3. 缓存数据不一致

## 客户端缓存
``` csharp
[ResponseCache(Duration = 60)]
public IActionResult Index()
{
    return View();
}
```
## 服务端缓存
``` csharp
// 在app.MapControllers之前添加
app.UseResponseCaching();
```
## 内存缓存
``` csharp
// 在ConfigureServices中添加
services.AddMemoryCache();

Book? b = await _cache.GetOrCreateAsync("Book", async entry =>
{
    entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(10);
    return await GetBookAsync();
});
```
### 滑动过期时间策略
``` csharp
entry.SlidingExpiration = TimeSpan.FromSeconds(10);
```
### 绝对过期时间策略
``` csharp
entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(10);
```
### 混合使用
使用滑动过期时间策略，如果一个缓存项一直被频繁访问，那么它将一直保持缓存状态，如果一个缓存项很长时间没有被访问，那么它将被移除。
``` csharp
entry.SlidingExpiration = TimeSpan.FromSeconds(10);
entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30);
```
### 数据源变更时自动更新缓存
`Remove`,`Set`

## 缓存穿透
缓存穿透是指缓存和数据库中都没有的数据，而用户不断发起请求，如发起的查询条件数据库中没有的数据，这时缓存中也没有，每次都要去数据库中查询，这就是缓存穿透。
> 使用`GetOrCreateAsync`方法可以避免缓存穿透。

## 缓存雪崩
1. 缓存项集中过期引起缓存雪崩
2. 解决办法，在基础过期时间上，再加一个随机的过期时间 
