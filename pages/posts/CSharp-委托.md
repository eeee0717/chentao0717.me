---
title: CSharp-委托
date: 2023-08-28T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

[官方文档](https://learn.microsoft.com/zh-cn/dotnet/csharp/programming-guide/delegates/)

### 什么是委托？

简单来说，委托在某种程度上提供了间接的方法。举个栗子，遗嘱由一系列指令组成，例如：付账单，捐善款，其余财产留给猫。 遗嘱一般是某人去世前写好，然后放到一个安全的地方，希望律师去执行这些指令。委托正是如此，提供一个接口，但不知道具体实现。

### 简单委托的构成

1. 声明委托类型

```cs
public delegate void StringProcessor(string input);
```

1. 必须有一个方法包含了要执行的代码

   具有与委托相同的返回值和参数

```cs
void PrintString(string x)
```

1. 必须创建一个委托实例

```cs
StringProcessor proc;
proc = new StringProcessor(PrintString);
```

1. 调用(invoke)委托实例

```cs
proc("Hello");
```

## 何时使用委托而不是接口？

[官方文档](https://learn.microsoft.com/zh-cn/previous-versions/visualstudio/visual-studio-2010/ms173173(v=vs.100))

在以下情况下，请使用委托：

- 当使用事件设计模式时。
- 当封装静态方法可取时。
- 当调用方不需要访问实现该方法的对象中的其他属性、方法或接口时。
- 需要方便的组合。
- 当类可能需要该方法的多个实现时。

在以下情况下，请使用接口：

- 当存在一组可能被调用的相关方法时。
- 当类只需要方法的单个实现时。
- 当使用接口的类想要将该接口强制转换为其他接口或类类型时。
- 当正在实现的方法链接到类的类型或标识时：例如比较方法。

