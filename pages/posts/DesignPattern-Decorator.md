---
title: 结构型模式——装饰器模式
date: 2023-10-31T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

1. ## 概要

装饰器模式（Decorator Pattern）是一种结构型设计模式，它允许在不改变现有对象结构的情况下，动态地向对象添加额外的功能。装饰器模式通过将对象包装在装饰器类中，然后将装饰器类嵌套在其他装饰器类中，以此实现对对象的透明包装。

## 使用场景

装饰器模式适用于以下情况：

1. 当需要在不改变现有对象结构的情况下，动态地添加额外的功能时。
2. 当需要对一个对象的功能进行多次扩展时，使用继承会导致类的数量急剧增加，而装饰器模式可以避免这种情况。

## 优点和缺点

优点：

1. 可以动态地向对象添加额外的功能，而无需改变现有对象结构。
2. 可以通过嵌套装饰器类的方式，灵活地组合多个装饰器，实现对对象功能的多次扩展。

缺点：

1. 增加了系统的复杂性，引入了额外的类和接口。
2. 装饰器模式的设计需要提前进行对象的定义和装饰器类的设计，增加了设计的难度。

## 代码示例

```cs
using System;

// 组件抽象类
abstract class Component
{
    public abstract void Operation();
}

// 具体组件类
class ConcreteComponent : Component
{
    public override void Operation()
    {
        Console.WriteLine("具体组件的操作");
    }
}

// 装饰器抽象类
abstract class Decorator : Component
{
    protected Component _component;

    public void SetComponent(Component component)
    {
        _component = component;
    }

    public override void Operation()
    {
        if (_component != null)
        {
            _component.Operation();
        }
    }
}

// 具体装饰器类A
class ConcreteDecoratorA : Decorator
{
    public override void Operation()
    {
        base.Operation();
        Console.WriteLine("具体装饰器A的操作");
    }
}

// 具体装饰器类B
class ConcreteDecoratorB : Decorator
{
    public override void Operation()
    {
        base.Operation();
        Console.WriteLine("具体装饰器B的操作");
    }
}

// 客户端代码
class Program
{
    static void Main(string[] args)
    {
        // 创建具体组件对象
        Component component = new ConcreteComponent();

        // 创建具体装饰器对象A，并将具体组件对象作为参数传递给装饰器对象A
        Decorator decoratorA = new ConcreteDecoratorA();
        decoratorA.SetComponent(component);

        // 创建具体装饰器对象B，并将具体装饰器对象A作为参数传递给装饰器对象B
        Decorator decoratorB = new ConcreteDecoratorB();
        decoratorB.SetComponent(decoratorA);

        // 调用装饰器对象B的操作方法
        decoratorB.Operation();
    }
}
```

在上面的示例中，我们定义了一个抽象类 `Component`，它作为组件的基类，包含了一个抽象的操作方法。然后，我们创建了具体组件类 `ConcreteComponent`，它实现了组件的具体操作。

接下来，我们定义了一个装饰器抽象类 `Decorator`，它继承自 `Component`，并包含了一个组件对象 `_component`。装饰器抽象类中的操作方法会先调用组件对象的操作方法，然后再执行自己的操作。

然后，我们创建了具体装饰器类 `ConcreteDecoratorA` 和 `ConcreteDecoratorB`，它们分别继承自 `Decorator`。具体装饰器类在调用父类的操作方法之后，会执行自己的操作。

在客户端代码中，我们首先创建了具体组件对象 `component`。然后，我们创建了具体装饰器对象 `decoratorA`，并将具体组件对象作为参数传递给装饰器对象A。接着，我们创建了具体装饰器对象 `decoratorB`，并将具体装饰器对象A作为参数传递给装饰器对象B。

最后，我们调用装饰器对象B的操作方法，实际上会先调用装饰器对象A的操作方法，然后再执行装饰器对象B的操作方法。这样，我们就可以动态地向对象添加额外的功能，而无需改变现有对象结构。

通过使用装饰器模式，我们可以灵活地扩展对象的功能，同时保持对象接口的一致性。这种模式可以避免使用继承导致的类爆炸问题，使得代码更加灵活和可维护。
