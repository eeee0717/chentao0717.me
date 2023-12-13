---
title: CSharp-模式匹配
date: 2023-08-29T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

模式匹配（Pattern Matching）是在 C# 7.0 引入的，是对 switch 语句的增强，可以支持实现复杂的条件匹配。下面我先用一个示例来展示一下模式匹配的一般的用法。

模式匹配有三个模式：简单模式、关系模式和逻辑模式

## 简单模式

```cs
vehicle switch
{
    ...
    Car c => 2.00m - 1.0m
}
```

=>变量c其实可以忽略

```cs
vehicle switch
{
    ...
    Car => 2.00m - 1.0m
}
```

## 关系模式

```cs
DeliveryTruck t when (t.GrossWeightClass > 5000) => 10.00m + 5.00m,
DeliveryTruck t when (t.GrossWeightClass < 3000) => 10.00m - 2.00m,
DeliveryTruck _ => 10.00m,
```

=>c#9.0可以简写为

```cs
DeliveryTruck t when t.GrossWeightClass switch
{
    > 5000 => 10.00m + 5.00m,
    < 3000 => 10.00m - 2.00m,
    _ => 10.00m,
}
```

## 逻辑模式

可以使用`and`、`or` 和 `not` 对模式进行组合

```cs
DeliveryTruck t when t.GrossWeightClass switch
{
    < 3000 => 10.00m - 2.00m,
    >= 3000 and <= 5000 => 10.00m,
    > 5000 => 10.00m + 5.00m,
}
```

