---
title: EFCore连接Mysql
date: 2023-12-19T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## Code First
### 创建表结构
```csharp
public class Book
{
  public long Id { get; set; }
  public string? Title { get; set; }
  public DateTime PubTime { get; set; }
  public double Price { get; set; }
}
```
### 创建BookConfig
```csharp
public class BookConfig:IEntityTypeConfiguration<Book>
{
  public void Configure(EntityTypeBuilder<Book> builder)
  {
    builder.ToTable("T_Books");
    
  }
}
```
### 创建DbContext
```csharp
public class MyDbContext:DbContext
{
  public DbSet<Book>? Books { get; set; }

  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
  {
    base.OnConfiguring(optionsBuilder);
    var connectionString = "server=localhost;port=3306;database=efcore;uid=root;pwd=123456;";
    var serverVersion = ServerVersion.AutoDetect(connectionString);
    optionsBuilder.UseMySql(connectionString, serverVersion);
  }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);
    // 获取当前程序集所有类
    modelBuilder.ApplyConfigurationsFromAssembly(this.GetType().Assembly);
  }
}
```

### 安装nuget包
```bash
dotnet add package Pomelo.EntityFrameworkCore.MySql
```

### 数据迁移
```bash
dotnet ef migrations add init
dotnet ef database update
```

> 创建完毕
