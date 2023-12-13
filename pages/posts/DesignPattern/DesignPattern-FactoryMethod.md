---
title: 创建型模式——工厂方法
date: 2023-10-25T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

1. ## 概要

工厂模式（Factory Pattern）提供了一种将对象的实例化过程封装在工厂类中的方式。通过使用工厂模式，可以将对象的创建与使用代码分离，提供一种统一的接口来创建不同类型的对象。

### 使用场景

1. 当一个类不知道它所必须创建的对象的类的时候
2. 当一个类希望由它的子类来指定它所创建的对象的时候
3. 当类将创建对象的职责委托给多个帮助子类中的某一个，并且你希望将那一个帮助子类是代理者这一信息局部化的时候

### 有优缺点

1. 一个调用者想创建一个对象，只要知道其名称就可以了。
2. 扩展性高，如果想增加一个产品，只要扩展一个工厂类就可以。
3. 屏蔽产品的具体实现，调用者只关心产品的接口。
4. 每次增加一个产品时，都需要增加一个具体类和对象实现工厂，使得系统中类的个数成倍增加，在一定程度上增加了系统的复杂度，同时也增加了系统具体类的依赖。这并不是什么好事。
2. ## 代码示例

```cs
using System;

interface Phone 
{
  void createPhone();
}

class IPhone : Phone 
{
  void createPhone() 
  {
    ...
  }
}

class HuaWei : Phone 
{
  void createPhone() 
  {
    ...
  }
}

class Factory
{
   public Phone CreatePhone()
   {
     switch()
     {
       case "A":
         return new IPhone();
       case "B":
         return new HuaWei();
     }   
   }
}

class Program
{
    static void Main(string[] args)
    {
        Factory factory = new Factory();
        Phone iPhone = new factory.CreatePhone("A");
    }
}
```

