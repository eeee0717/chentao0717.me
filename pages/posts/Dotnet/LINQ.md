---
title: LINQ
date: 2023-12-14T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 揭秘LINQ
```csharp
int[] numbers = { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
IEnumerable<int> query = numbers.Where(n => n > 5);
```
### Where实现
```csharp
public static IEnumerable<int> MyWhere(IEnumerable<int> items, Func<int, bool> f)
{
  List<int> results = new List<int>();
  foreach(var i in items)
  {
    if(f(i))
    {
      results.Add(i);
    }
  }
  return results;
}
// 调用
IEnumerable<int> query = MyWhere(numbers, n => n > 5);
```
### Where实现2
```csharp
public static IEnumerable<int> MyWhere(this IEnumerable<int> items, Func<int, bool> f)
{
  foreach(var i in items)
  {
    if(f(i))
    {
      yield return i;
    }
  }
}
// 调用
IEnumerable<int> query = numbers.MyWhere(n => n > 5);
```
