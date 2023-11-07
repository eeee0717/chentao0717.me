---
title: CSharp-IEnumerable与IQueryable
date: 2023-08-26T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

在C#中可以通过IEnumerable和IQueryable提取出int数组中大于10的数据：

```cs
int[] nums={3, 5, 6, 776, 213};
IEnumberable<int> items = nums.Where(n => n > 10);
```

在Where方法转到定义，可以看到，这里调用了Enumerable类中的Where方法，方法声明如下：

```cs
IEnumerable<TSource> Where<TSource>(this IEnumerable<TSource> source, Func<TSource,bool> predicate);
```

同样的，我们可以在EF Core的DbSet类型上调用Where之类的方法进行数据筛选。

```cs
IQueryable<Book> books = ctx.Books.Where(b => b.Price > 1.1);
```

同理，查看where方法的定义，可以看到方法声明如下：

```cs
IQueryable<TSource> Where<TSource>(this IQueryable<TSource> source, Func<TSource, bool> predicate);
```

这个Where方法是一个`IQueryable<TSource>`类型的扩展方法，其实就是继承了IEnumerable接口的接口：

```cs
public interface IQueryable : System.Collections.IEnumerable
```

那么既然IQueryable继承IEnumerable接口，为什么微软还要推出一个IQueryable呢？

对于普通集合，Where方法会在内存中对每条数据进行过滤，而EF Core如果也把数据都在内存中进行过滤的话，就需要把一张数据库表中的所有数据都加载到内存中，如果数据量非常庞大，就会有**性能问题**。因此比EF Core中的Where实现必须有一套可以让数据的筛选在数据库服务器上执行。使用SQL语句在数据库服务器上完成数据筛选的过程叫做“服务器端评估”；同样的，把数据库加载到应用程序的内存中再进行筛选的过程叫做“客户端评估”。很显然，对于大部分情况来讲，“客户端评估”的性能比较低，我们要避免。

因为Enumerable类中定义的普通集合使用的Where等方法都是“客户端评估”，因此微软创造了IQueryable类型。

下面举个例子说明。

```cs
IQueryable<Book> books = ctx.Books.Where(b => b.Price > 1.1); 
foreach (var b in books.Where(b => b.Price > 1.1))
{ 
  Console.WriteLine($"Id={b.Id},Title={b.Title}"); 
}
```

上面代码生成的SQL语句如下：

```cs
SELECT [t].[Id],[t].[AuthorName],[t].[Price],[t].[PubTime],[t].[Title]

FROM [T Books] AS [t]WHERE [t].[Price]1.1000000000000001E0
```

可以看到，这里EF Core在数据服务器上的语句是服务端评估，因为books变量是`IQueryable<Book>`类型的。

接下来我们对代码稍微改变

```cs
IEnumerable<Book> books = ctx.Books; 
foreach (var b in books.Where(b => b.Price > 1.1))
{ 
  Console.WriteLine($"Id={b.Id},Title={b.Title}"); 
}
```

我们再查看生成的SQL语句，如下：

```cs
SELECT [t].[Id],[t].[AuthorName], [t].[Price],[t].[PubTime],[t].

[Title] FROM

[T_Books] AS [t]
```

很明显，这次程序把T_Books表中的所有数据都加载到应用程序内存中，然后在内存中进行数据的过滤，变成了客户端评估。

总之，在使用EF Core的时候，我们要尽量避免客户端评估，能用IQueryable的地方就不要使用IEnumerable。

