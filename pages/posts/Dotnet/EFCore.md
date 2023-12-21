---
title: EFCore
date: 2023-12-17T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 说明
1. EFCore是对底层ADO.NET的封装，因此需要使用ADO.NET支持的数据库。
2. 可以自己实现Provider，支持其他数据库。

## Code First
1. [efcore-mysql](/posts/Dotnet/EFCore-Mysql)


## 增删改查
> 最好使用异步方法，避免阻塞线程。
### 增
```csharp
using (var db = new BloggingContext())
{
    var blog = new Blog { Url = "http://sample.com" };
    db.Blogs.Add(blog);
    db.SaveChangesAsync();
}
```
### 删
```csharp
using (var db = new BloggingContext())
{
    var blog = db.Blogs.Find(1);
    db.Blogs.Remove(blog);
    db.SaveChangesAsync();
}
```
### 改
```csharp
using (var db = new BloggingContext())
{
    var blog = db.Blogs.Find(1);
    blog.Url = "http://sample.com/blog";
    db.SaveChangesAsync();
}
```
### 查
```csharp
using (var db = new BloggingContext())
{
    var blogs = db.Blogs
        .Where(b => b.Rating > 3)
        .OrderBy(b => b.Url)
        .ToList();
}
```
