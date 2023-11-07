---
title: 创建型模式——原型对象
date: 2023-10-24T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

1. ## 概要

原型模式是一种创建型设计模式，它使用现有对象作为原型，通过复制这些原型来创建新的对象。这种模式允许我们创建对象的副本，而无需暴露对象的创建逻辑。

## 使用场景

原型模式适用于以下情况：

1. 当一个系统需要独立于其产品的创建、组合和表示时。
2. 当需要避免通过子类化来创建对象的情况。

## 优点和缺点

优点：

1. 可以动态添加或删除产品的部件。
2. 可以更好地控制对象的创建过程。
3. 可以减少子类的数量，提高代码的可维护性。

缺点：

1. 需要为每个具体原型类编写克隆方法。
2. 克隆方法的实现可能会比较复杂。

## 代码示例

```cs
using System;

// 原型类
abstract class Prototype
{
    public abstract Prototype Clone();
}

// 具体原型类
class ConcretePrototype : Prototype
{
    private string _name;

    public ConcretePrototype(string name)
    {
        _name = name;
    }

    public override Prototype Clone()
    {
        return new ConcretePrototype(_name);
    }

    public void Display()
    {
        Console.WriteLine($"Name: {_name}");
    }
}

// 客户端代码
class Program
{
    static void Main(string[] args)
    {
        // 创建原型对象
        Prototype prototype = new ConcretePrototype("Prototype");

        // 克隆原型对象
        Prototype clone = prototype.Clone();

        // 显示原型和克隆对象的信息
        prototype.Display();
        clone.Display();
    }
}
```

在上面的示例中，我们定义了一个抽象的原型类 `Prototype`，其中包含一个抽象的克隆方法 `Clone`。然后，我们创建了一个具体的原型类 `ConcretePrototype`，它实现了克隆方法，并且可以克隆自身。最后，我们在客户端代码中创建了一个原型对象，并通过克隆方法创建了一个克隆对象，然后分别显示它们的信息。

这样，我们就可以通过原型模式创建新的对象，而无需关心对象的创建细节。

