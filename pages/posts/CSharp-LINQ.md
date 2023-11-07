---
title: CSharp-LINQ
date: 2023-08-25T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

查询表达式

应用对象：IEnumerable 或 IQueryable

[LINQ关键字](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/query-keywords)

### from子句

查询表达式必须以from开头，效果可以类比foreach

```javascript
from item in items
```

### where子句

指定将在查询表达式中返回数据源中的哪些元素

```javascript
// 可以传入数值 也可以 传入函数
where num > 5
where IsEven(num)
```

### select子句

选择筛选的结果

```javascript
from item in items
select item

select item.name
```

### group子句

分组

```javascript
group student by student.name
```

希望按照多个键对元素进行分组时，可使用复合键。 使用匿名类型或命名类型来存储键元素，创建复合键。

```javascript
group person by new {name = person.surname, city = person.city};
```

### into

可使用 `into` 上下文关键字创建临时标识符，将 [group](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/group-clause)、[join](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/join-clause) 或 [select](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/select-clause) 子句的结果存储至新标识符

```javascript
group w by w[0] into fruitGroup
```

### orderby子句

在查询表达式中，`orderby` 子句可导致返回的序列或子序列（组）以升序或降序排序。

```javascript
// 可按多个键排序 默认升序
orderby student.Last ascending, student.First ascending
```

### join 联接

`join` 子句可用于将来自不同源序列并且在对象模型中没有直接关系的元素相关联。

1. 内部联接

```javascript
join prod in products on category.ID equals prod.CategoryID
```

2. 分组联接

```javascript
join prod in products on category.ID equals prod.CategoryID
```

3. 左外部联接(需要使用DefaultIfEmpty）

```javascript
join prod in products on category.ID equals prod.CategoryID into prodGroup
from item in prodGroup.DefaultIfEmpty(new Product { Name = String.Empty, CategoryID = 0 })
```

### let子句

用于存储子表达式

```javascript
let words = sentence.Split(' ')
```

