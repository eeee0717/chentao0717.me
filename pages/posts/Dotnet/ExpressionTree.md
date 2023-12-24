---
title: ExpressionTree
date: 2023-12-24T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 概述
表达式树：树形数据结构表示代码，以表示逻辑运算，以便可以在运行时访问逻辑运算的结构。

## Expression与Func的区别
Func是一个委托，而Expression是一个表达式树，Func是在运行时执行的，而Expression是在编译时执行的。（func在debug时无法看到结构）

## 通过代码动态生成表达式树
```csharp
ParameterExpression a = Expression.Parameter(typeof(int), "a");
ParameterExpression b = Expression.Parameter(typeof(int), "b");
BinaryExpression be = Expression.Add(a, b);
Expression<Func<int, int, int>> expression = Expression.Lambda<Func<int, int, int>>(be, a, b);
// 使用
Func<int, int, int> func = expression.Compile();
Console.WriteLine(func(1, 2));
```

