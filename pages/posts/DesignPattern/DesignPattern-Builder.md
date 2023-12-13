---
title: 创建型模式——builder模式
date: 2023-10-26T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

1. ## 概要

建造者模式（Builder Pattern）使用多个简单的对象一步一步构建成一个复杂的对象。这种类型的设计模式属于创建型模式，它提供了一种创建对象的最佳方式。

### 使用场景

1. 当创建复杂对象的算法应该独立于该对象的组成部分以及它们的装配方式时
2. 当构造过程必须允许被构造的对象有不同的表示时

### 有优缺点

1. 分离构建过程和表示，使得构建过程更加灵活，可以构建不同的表示
2. 可以更好地控制构建过程，隐藏具体构建细节
3. 代码复用性高，可以在不同的构建过程中重复使用相同的建造者
4. 如果产品的属性较少，建造者模式可能会导致代码冗余
5. 建造者模式增加了系统的类和对象数量
2. ## 代码示例

```cs
using System;

// 产品类
class Product
{
    public string Part { get; set; }

    public void Display()
    {
        Console.WriteLine($"Part: {Part}");
    }
}

// 抽象生成器类
abstract class Builder
{
    public abstract void BuildPart();
    public abstract Product GetProduct();
}

// 具体生成器类
class ConcreteBuilder : Builder
{
    private Product _product = new Product();

    public override void BuildPart()
    {
        _product.Part = "Part";
    }

    public override Product GetProduct()
    {
        return _product;
    }
}

// 指导者类
class Director
{
    public void Construct(Builder builder)
    {
        builder.BuildPart();
    }
}

// 客户端代码
class Program
{
    static void Main(string[] args)
    {
        // 创建生成器和指导者对象
        Builder builder = new ConcreteBuilder();
        Director director = new Director();

        // 使用指导者构建产品
        director.Construct(builder);

        // 获取构建好的产品
        Product product = builder.GetProduct();

        // 显示产品信息
        product.Display();
    }
}
```

