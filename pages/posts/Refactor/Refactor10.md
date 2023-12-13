---
title: 重构—第十章 处理概括关系
date: 2023-09-29T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

## 值域上移

两个子类拥有相同的值域

将此值域移至超类

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/重构-10-1.png)

## 函数上移

有些函数在各个子类中产生完全相同的结果

将该函数移至超类

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/重构-10-2.png)

## 构造函数本体上移

你在各个子类中拥有一些构造函数，它们的本体几乎完全一致

```cs
class Manager extends Employee...
public Manager (String name, String id, int grade) {
  _name = name;
  _id = id;
  _grade = grade;
}
```

=>

```cs
public Manager (String name, String id, int grade) {
  super (name, id);
  _grade = grade;
}
```

## 函数下移

超类中某个函数只与部分子类有关

将这个函数移到相关的子类中去

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/重构-10-3.png)

## 值域下移

超类中某个值域只与部分子类有关

将这个值域移到相关的子类中去

## 提炼子类

class中的某些特性只被某些实体用到，新建一个子类，将上面的一部分特性转移到子类上

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/重构-10-4.png)

## 提炼超类

两个类有相似的特性

为这两个类建立一个超类，将相同的特性移至超类中

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/重构-10-5.png)

## 提炼接口

若干客户使用class接口中的同一个子集，或者两个class的接口有部分相同

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/重构-10-6.png)

## 折叠继承关系

超类和子类之间并无太大区别

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/重构-10-7.png)

## 塑造模版函数

继承是避免重复行为的强大工具。无论何时，只要看到两个子类之间有类似的函数，就可以提升他们到超类中。但是如果这些函数不完全相同，则需要尽量避免重复

## 以委托取代继承

某个子类只使用了超类的部分功能

```cs
class MyStack extends Vector {
  public void push(Object element) {
      insertElementAt(element,0);
    }
    public Object pop() {
      Object result = firstElement();
      removeElementAt(0);
      return result;
  }
}
```

=>

```cs
class MyStack extends Vector{
  private Vector _vector = new Vector();
  public void push(Object element) {
    _vector.insertElementAt(element,0);
  }
}
```

## 以继承取代委托

你在两个classes 之间使用委托关系（delegation），并经常为整个接口编写许多极简单的请托函数（delegating methods）

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/重构-10-8.png)

