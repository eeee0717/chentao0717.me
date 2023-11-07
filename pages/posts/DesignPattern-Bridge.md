---
title: 结构型模式——桥接模式
date: 2023-10-29T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

1. ## 概要

桥接模式（Bridge Pattern）是一种结构型设计模式，它将抽象部分与实现部分分离，使它们可以独立地变化。桥接模式通过组合的方式，将抽象和实现解耦，从而可以灵活地扩展和修改系统的功能。

## 使用场景

桥接模式适用于以下情况：

1. 当需要在抽象部分和实现部分之间建立一个稳定的连接，并且两者可以独立地变化时。
2. 当需要在运行时动态地切换抽象部分和实现部分的连接时。

## 优点和缺点

优点：

1. 可以将抽象部分和实现部分独立地扩展和修改，符合开闭原则。
2. 可以在运行时动态地切换抽象部分和实现部分的连接，提高了系统的灵活性。

缺点：

1. 增加了系统的复杂性，引入了额外的类和接口。
2. 桥接模式的设计需要提前进行抽象和实现的分离，增加了设计的难度。

## 代码示例

```cs
// 抽象部分
abstract class Shape
{
    protected IRenderer _renderer;

    public Shape(IRenderer renderer)
    {
        _renderer = renderer;
    }

    public abstract void Draw();
}

// 实现部分
interface IRenderer
{
    void Render();
}

// 具体实现部分A
class RendererA : IRenderer
{
    public void Render()
    {
        Console.WriteLine("Rendering with RendererA");
    }
}

// 具体实现部分B
class RendererB : IRenderer
{
    public void Render()
    {
        Console.WriteLine("Rendering with RendererB");
    }
}

// 扩展抽象部分
class Circle : Shape
{
    public Circle(IRenderer renderer) : base(renderer)
    {
    }

    public override void Draw()
    {
        Console.WriteLine("Drawing a circle");
        _renderer.Render();
    }
}

// 客户端代码
class Program
{
    static void Main(string[] args)
    {
        // 创建具体实现部分A
        IRenderer rendererA = new RendererA();

        // 创建具体实现部分B
        IRenderer rendererB = new RendererB();

        // 创建扩展抽象部分，并关联具体实现部分A
        Shape circleA = new Circle(rendererA);
        circleA.Draw();

        // 创建扩展抽象部分，并关联具体实现部分B
        Shape circleB = new Circle(rendererB);
        circleB.Draw();
    }
}
```

在上面的示例中，抽象部分是 `Shape` 类，它定义了绘制图形的高层次逻辑，并包含了对实现部分的引用 `_renderer`。抽象部分通过调用实现部分的 `Render` 方法来完成具体的绘制操作。

实现部分是 `IRenderer` 接口及其具体实现类 `RendererA` 和 `RendererB`。它们负责实现具体的绘制逻辑，例如使用不同的渲染引擎进行绘制。

在客户端代码中，我们创建了具体的实现部分 `rendererA` 和 `rendererB`，然后通过关联它们的实例创建了扩展抽象部分 `circleA` 和 `circleB`。最后，我们调用 `Draw` 方法来绘制圆形，并通过实现部分完成具体的渲染操作。

这样，抽象部分和实现部分通过桥接模式进行了解耦，使得抽象部分和实现部分可以独立地进行扩展和修改。

