---
title: 结构型模式——外观模式
date: 2023-11-01T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

1. ## 概要

外观模式（Facade Pattern）是一种结构型设计模式，它提供了一个统一的接口，用于访问子系统中的一组接口。外观模式通过定义一个高层接口，简化了复杂系统的使用，使得客户端可以更加方便地与系统进行交互。

## 使用场景

外观模式适用于以下情况：

1. 当需要简化复杂系统的接口，并提供一个统一的接口给客户端时。
2. 当希望将系统的内部结构与外部客户端分离，以提高系统的灵活性和可维护性时。

## 优点和缺点

优点：

1. 简化了复杂系统的使用，提供了一个统一的接口给客户端。
2. 将系统的内部结构与外部客户端分离，提高了系统的灵活性和可维护性。

缺点：

1. 如果系统的接口发生变化，可能需要修改外观类的代码。
2. 外观模式可能会引入一个新的单点故障，因为所有的客户端都依赖于外观类。

## 代码示例

```cs
using System;

// 子系统类A
class SubsystemA
{
    public void OperationA()
    {
        Console.WriteLine("Subsystem A operation");
    }
}

// 子系统类B
class SubsystemB
{
    public void OperationB()
    {
        Console.WriteLine("Subsystem B operation");
    }
}

// 子系统类C
class SubsystemC
{
    public void OperationC()
    {
        Console.WriteLine("Subsystem C operation");
    }
}

// 外观类
class Facade
{
    private SubsystemA _subsystemA;
    private SubsystemB _subsystemB;
    private SubsystemC _subsystemC;

    public Facade()
    {
        _subsystemA = new SubsystemA();
        _subsystemB = new SubsystemB();
        _subsystemC = new SubsystemC();
    }

    public void Operation()
    {
        _subsystemA.OperationA();
        _subsystemB.OperationB();
        _subsystemC.OperationC();
    }
}

// 客户端代码
class Program
{
    static void Main(string[] args)
    {
        Facade facade = new Facade();
        facade.Operation();
    }
}
```

在上面的示例中，我们定义了三个子系统类 `SubsystemA`、`SubsystemB` 和 `SubsystemC`，它们分别表示系统中的不同部分。然后，我们创建了一个外观类 `Facade`，它封装了子系统的操作，并提供了一个统一的接口给客户端。

在客户端代码中，我们创建了一个外观对象 `facade`，通过调用外观对象的操作方法，客户端可以简单地使用系统的功能，而不需要了解系统的内部结构和复杂性。

通过使用外观模式，我们可以简化复杂系统的使用，提供一个统一的接口给客户端，同时将系统的内部结构与外部客户端分离，提高系统的灵活性和可维护性。
