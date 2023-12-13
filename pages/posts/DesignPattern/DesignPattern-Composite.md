---
title: 结构型模式——组合模式
date: 2023-10-30T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

1. ## 概要

组合模式（Composite Pattern）是一种结构型设计模式，它允许将对象组合成树形结构以表示“部分-整体”的层次结构。组合模式使得客户端可以统一地处理单个对象和组合对象，从而简化了代码的复杂性。

## 使用场景

组合模式适用于以下情况：

1. 当需要表示对象的部分-整体层次结构，并且希望客户端能够一致地处理单个对象和组合对象时。
2. 当希望对对象的结构进行递归组合，以便能够以相同的方式处理单个对象和组合对象时。

## 优点和缺点

优点：

1. 可以简化客户端代码，使得客户端可以一致地处理单个对象和组合对象。
2. 可以通过递归组合对象的方式，灵活地处理对象的层次结构。

缺点：

1. 增加了系统的复杂性，引入了额外的类和接口。
2. 组合模式的设计需要提前进行对象的层次结构的定义，增加了设计的难度。

## 代码示例

```cs
using System;
using System.Collections.Generic;

// 组件抽象类
abstract class Component
{
    protected string _name;

    public Component(string name)
    {
        _name = name;
    }

    public abstract void Add(Component component);
    public abstract void Remove(Component component);
    public abstract void Display(int depth);
}

// 叶子组件类
class Leaf : Component
{
    public Leaf(string name) : base(name)
    {
    }

    public override void Add(Component component)
    {
        Console.WriteLine("Cannot add to a leaf");
    }

    public override void Remove(Component component)
    {
        Console.WriteLine("Cannot remove from a leaf");
    }

    public override void Display(int depth)
    {
        Console.WriteLine(new string('-', depth) + _name);
    }
}

// 容器组件类
class Composite : Component
{
    private List<Component> _children = new List<Component>();

    public Composite(string name) : base(name)
    {
    }

    public override void Add(Component component)
    {
        _children.Add(component);
    }

    public override void Remove(Component component)
    {
        _children.Remove(component);
    }

    public override void Display(int depth)
    {
        Console.WriteLine(new string('-', depth) + _name);

        foreach (Component component in _children)
        {
            component.Display(depth + 2);
        }
    }
}

// 客户端代码
class Program
{
    static void Main(string[] args)
    {
        // 创建树形结构
        Composite root = new Composite("Root");
        Composite branch1 = new Composite("Branch 1");
        Composite branch2 = new Composite("Branch 2");
        Leaf leaf1 = new Leaf("Leaf 1");
        Leaf leaf2 = new Leaf("Leaf 2");
        Leaf leaf3 = new Leaf("Leaf 3");

        root.Add(branch1);
        root.Add(branch2);
        branch1.Add(leaf1);
        branch2.Add(leaf2);
        branch2.Add(leaf3);

        // 显示树形结构
        root.Display(0);
    }
}
```

在上面的示例中，我们定义了一个抽象类 `Component`，它作为组件的基类，包含了添加、移除和显示的抽象方法。然后，我们创建了叶子组件类 `Leaf` 和容器组件类 `Composite`，它们分别表示叶子节点和容器节点。

在客户端代码中，我们创建了一个树形结构，包含了根节点、分支节点和叶子节点。通过调用组件的添加和移除方法，我们可以构建出一个层次结构的组合对象。最后，我们调用根节点的显示方法，以递归地显示整个树形结构。

这样，我们就可以使用组合模式来表示对象的部分-整体层次结构，并且可以统一地处理单个对象和组合对象。

