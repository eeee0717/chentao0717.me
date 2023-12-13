---
title: 创建型模式——抽象工厂
date: 2023-10-27T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

1. ## 概要

抽象工厂模式（Abstract Factory Pattern）是围绕一个超级工厂创建其他工厂。该超级工厂又称为其他工厂的工厂。这种类型的设计模式属于创建型模式，它提供了一种创建对象的最佳方式。

### 使用场景

1. 一个系统要独立于它的产品创建、组合和表示时
2. 一个系统要由多个产品系列中的一个来配置时
3. 当你要强调一系列相关的产品对象的设计以便进行联合使用时
4. 当你提供一个产品类库，而只是想显示它们的接口而不是实现时

### 有优缺点

1. 它分离了具体的类
2. 它使得易于交换产品系列
3. 它有利于产品的一致性
4. 难以支持新种类的产品：当出现新种类的产品时需要扩展抽象工厂的接口
2. ## 代码示例

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F-%E6%8A%BD%E8%B1%A1%E5%B7%A5%E5%8E%82.png)
```cs
using System;

interface AbstractFactory
{
    public Phone CreatePhone();
    public Mask CreateMask();
}

class Factory : AbstractFactory
{
   public Phone CreatePhone()
   {
        return new IPhone();
   }
   public Mask CreateMask()
   {
        return new N95();
   }
}

interface Phone {}
class IPhone : Phone {}

interface Mask {}
class N95 : Mask {}

class Program
{
    static void Main(string[] args)
    {
        AbstractFactory factory = new Factory();
        Phone iPhone = new factory.CreatePhone();
    }
}
```

