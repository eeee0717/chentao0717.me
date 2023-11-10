---
title: CLR-类型与成员基础
date: 2023-07-27T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

## 1、静态类：不能实例化的类

   sealed:密封类，不能被继承，只能被override

## 2、部分类、结构和接口：

   partial：部分类，将一个类分布在各个代码文件中，编译器可以最终综合在一起

   可以将各个功能分开

## 3、虚方法、抽象方法、接口

   1、虚方法：

      需要在父类中进行实现,子类复写

```cs
public class animal
{
  public virtual void Cry()=>print("动物在叫")
}
public class Cat:animal
{
  public overrider Cry()=>print("猫在叫")
}
```

   2、抽象方法：

      父类方法不知道如何去使用，没有默认实现，而且不需要实例化

```cs
public class animal
{
  public abstract void Cry()
}
public class Cat:animal
{
  public overrider Cry()=>print("猫在叫")
}
```

   3、接口：与抽象类相似

```cs
public interface IPrinter
{
  public void print();
}

public interface HPPrinter:IPrinter
{
  public overrider print()=>print("test")  
}
```

