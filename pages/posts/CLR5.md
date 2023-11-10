---
title: CLR-参数
date: 2023-07-26T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

## ref和out关键字

1、ref 引用传递参数

```cs
void Method(ref int refArgument)
{
    refArgument = refArgument + 44;
}

int number = 1;
Method(ref number);
Console.WriteLine(number);
// Output: 45
```

2、out 引用传出参数（可与泛型配合使用）

```cs
int initializeInMethod;
OutArgExample(out initializeInMethod);
Console.WriteLine(initializeInMethod);     // value is now 44

void OutArgExample(out int number)
{
    number = 44;
}
```

