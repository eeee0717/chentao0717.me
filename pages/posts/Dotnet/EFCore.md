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
> 删除之前需要先查询出来
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

## Data Annotations
```csharp
public class Blog
{
    public int BlogId { get; set; }
    [Required]
    public string Url { get; set; }
    public int Rating { get; set; }
}
```
> 简单，但是耦合
> 
## Fluent API
> Fluent API是一种配置EFCore的方式，可以在OnModelCreating方法中进行配置。
> 建议放在config文件夹下，方便管理。
```csharp
public class BlogConfiguration : IEntityTypeConfiguration<Blog>
{
    public void Configure(EntityTypeBuilder<Blog> builder)
    {
        builder.Property(b => b.Url).IsRequired();
    }
}
```
> 复杂但是可以解耦
## 主键
支持多种主键生成策略：自增、Guid、Hi/Lo算法
1. 自增：简单，但是分布式系统中比较麻烦，并发性能差
2. Guid：全局唯一，高并发，但是占用空间大
> 不连续，主键不能做聚集索引（顺序存储），mysql innodb插入性能差，每次都需要重排

## 反向工程
Scaffold-DbContext
```bash
Scaffold-DbContext "Server=(localdb)\mssqllocaldb;Database=Blogging;Trusted_Connection=True;" Microsoft.EntityFrameworkCore.SqlServer
```

## EFCore的底层原理
将C#代码转化成SQL语句，然后通过ADO.NET执行SQL语句。

## EFCore一对多配置
```csharp
public void Configure(EntityTypeBuilder<Blog> builder)
{
    builder.HasMany(b => b.Posts)
        .WithOne(p => p.Blog)
        .HasForeignKey(p => p.BlogId);
}
```
```csharp
// 查询
var blog = db.Blogs
    .Include(b => b.Posts)
    .FirstOrDefault();
```
### 设置外键属性
1. 在实体类中显式声明一个外键属性
2. 关系配置中通过HasForeignKey方法指定外键属性
3. 除非有特殊需求，否则不建议使用外键属性，引入重复

## IQueryable与IEnumerable
[IEnumerable与IQueryable](/posts/CSharp/CSharp-IEnumerableAndIQueryable)
