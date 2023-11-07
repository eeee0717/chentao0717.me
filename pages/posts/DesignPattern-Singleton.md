---
title: 创建型模式——单例模式
date: 2023-10-23T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

1. ## 概要

单例模式（Singleton Pattern）是一种创建型设计模式，它确保一个类只有一个实例，并提供一个全局访问点来访问该实例。这种模式适用于需要在整个系统中共享一个对象实例的情况。

## 使用场景

单例模式适用于以下情况：

1. 当一个类只需要一个实例，并且该实例需要在整个系统中被访问时。
2. 当需要控制对一个资源的并发访问时，例如数据库连接池。

## 优点和缺点

优点：

1. 提供了对唯一实例的全局访问点，方便了对象的访问。
2. 避免了重复创建对象的开销，提高了性能。
3. 可以实现对资源的集中管理和控制。

缺点：

1. 单例模式可能会引入全局状态，增加了代码的复杂性。
2. 单例模式的扩展性较差，一旦需要扩展功能，可能需要修改原有的代码。

## 代码示例

```cs
using System;

// 单例类
public sealed class Singleton
{
    private static Singleton _instance;
    private static readonly object _lock = new object();

    private Singleton()
    {
        // 私有构造函数，防止外部实例化
    }

    public static Singleton Instance
    {
        get
        {
            if (_instance == null)
            {
                lock (_lock)
                {
                    if (_instance == null)
                    {
                        _instance = new Singleton();
                    }
                }
            }
            return _instance;
        }
    }

    public void Display()
    {
        Console.WriteLine("Singleton instance");
    }
}

// 客户端代码
class Program
{
    static void Main(string[] args)
    {
        // 获取单例实例
        Singleton singleton = Singleton.Instance;

        // 调用单例方法
        singleton.Display();
    }
}
```

在上面的示例中，我们定义了一个单例类 `Singleton`，它的构造函数被声明为私有，以防止外部实例化。通过静态属性 `Instance`，我们提供了对唯一实例的全局访问点。在访问 `Instance` 属性时，我们使用双重检查锁定来确保只有一个实例被创建。

在客户端代码中，我们通过 `Singleton.Instance` 获取单例实例，并调用其方法。

这样，我们就可以通过单例模式确保一个类只有一个实例，并且可以在整个系统中被访问。

