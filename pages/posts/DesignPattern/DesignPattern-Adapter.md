---
title: 结构型模式——适配器模式
date: 2023-10-28T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

1. ## 概要

适配器模式（Adapter Pattern）是一种结构型设计模式，它允许将一个类的接口转换成客户端所期望的另一个接口。适配器模式使得原本由于接口不兼容而不能一起工作的类可以协同工作。

### 使用场景

适配器模式适用于以下情况：

1. 当需要将一个类的接口转换成另一个接口时。
2. 当需要复用已有的类，但其接口与系统要求的接口不一致时。

### 优点和缺点

优点：

1. 可以让不兼容的类协同工作，提高代码的复用性。
2. 可以将适配器类作为一个中间层，解耦了客户端和被适配者之间的依赖关系。

缺点：

1. 增加了代码的复杂性，引入了额外的类和接口。
2. 适配器模式可能会导致系统中类的数量增加。

### 代码示例

```cs
using System;

// 目标接口
interface ITarget
{
    void Request();
}

// 需要适配的类
class Adaptee
{
    public void SpecificRequest()
    {
        Console.WriteLine("Adaptee's specific request");
    }
}

// 适配器类
class Adapter : ITarget
{
    private Adaptee _adaptee;

    public Adapter(Adaptee adaptee)
    {
        _adaptee = adaptee;
    }

    public void Request()
    {
        _adaptee.SpecificRequest();
    }
}

// 客户端代码
class Program
{
    static void Main(string[] args)
    {
        // 创建被适配者对象
        Adaptee adaptee = new Adaptee();

        // 创建适配器对象
        ITarget adapter = new Adapter(adaptee);

        // 调用目标接口方法
        adapter.Request();
    }
}
```

在上面的示例中，我们定义了一个目标接口 `ITarget`，其中包含一个 `Request` 方法。然后，我们创建了一个需要适配的类 `Adaptee`，它有一个 `SpecificRequest` 方法。接着，我们创建了一个适配器类 `Adapter`，它实现了目标接口，并在其 `Request` 方法中调用了被适配者的 `SpecificRequest` 方法。

在客户端代码中，我们创建了被适配者对象 `adaptee`，然后通过适配器对象 `adapter` 调用目标接口的方法 `Request`。

这样，我们就可以通过适配器模式将一个类的接口转换成另一个接口，使得原本不兼容的类可以协同工作。

